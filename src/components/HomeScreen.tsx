import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { ThemeToggle } from './ThemeToggle';
import { DraggableModule } from './DraggableModule';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  BookOpen,
  LogOut,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
  Bell,
  Video,
  Settings,
  Check
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';
import { MeetingScheduler } from './MeetingScheduler';

type Props = {
  mode: 'personal' | 'community';
  userName: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  onStartCheckIn: () => void;
  onViewHistory?: () => void;
  onViewResources?: () => void;
  onLogout: () => void;
  onModeChange?: (newMode: 'personal' | 'community') => void;
  onThemeToggle?: () => void;
};

type LeaderRequest = {
  id: string;
  name: string;
  email: string;
};

type LeaderInfo = {
  id: string;
  name: string;
  email: string;
};

type ModuleConfig = {
  id: string;
  enabled: boolean;
};

const DEFAULT_MODULE_ORDER = [
  { id: 'check-in-main', enabled: true },
  { id: 'mode-info', enabled: true },
  { id: 'quick-stats', enabled: true },
  { id: 'resources', enabled: true },
];

export function HomeScreen({ mode, userName, accessToken, theme = 'light', onStartCheckIn, onViewHistory, onViewResources, onLogout, onModeChange, onThemeToggle }: Props) {
  const [showModeDialog, setShowModeDialog] = useState(false);
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [leaderRequest, setLeaderRequest] = useState<LeaderRequest | null>(null);
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo | null>(null);
  const [isLoadingRequest, setIsLoadingRequest] = useState(true);
  const [isLoadingLeader, setIsLoadingLeader] = useState(true);
  const [showMeetingScheduler, setShowMeetingScheduler] = useState(false);
  const [weeklyCheckIns, setWeeklyCheckIns] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [moduleOrder, setModuleOrder] = useState<ModuleConfig[]>(DEFAULT_MODULE_ORDER);
  
  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour >= 6 && hour < 12) return 'Buenos días';
    if (hour >= 12 && hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const fetchQuickStats = async () => {
    try {
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/checkins-stats`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeeklyCheckIns(data.last7Days || 0);
        setTotalDays(data.total || 0);
        
        // Check if user has checked in today
        const checkInsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/checkins`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          }
        );
        
        if (checkInsResponse.ok) {
          const checkInsData = await checkInsResponse.json();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const hasToday = (checkInsData.checkIns || []).some((c: any) => {
            const checkInDate = new Date(c.created_at);
            checkInDate.setHours(0, 0, 0, 0);
            return checkInDate.getTime() === today.getTime();
          });
          
          setHasCheckedInToday(hasToday);
        }
      }
    } catch (err) {
      console.error('Error fetching quick stats:', err);
    }
  };

  const fetchLeaderInfo = async () => {
    if (!accessToken) return;
    
    setIsLoadingLeader(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/my-leader`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeaderInfo(data.leader);
      }
    } catch (err) {
      console.error('Error fetching leader info:', err);
    } finally {
      setIsLoadingLeader(false);
    }
  };

  useEffect(() => {
    checkForRequest();
    fetchQuickStats();
    if (mode === 'community') {
      fetchLeaderInfo();
    }
    loadModuleOrder();
  }, [mode]);

  const loadModuleOrder = () => {
    const saved = localStorage.getItem('home_module_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setModuleOrder(parsed);
      } catch (e) {
        console.error('Error loading module order:', e);
      }
    }
  };

  const saveModuleOrder = (newOrder: ModuleConfig[]) => {
    localStorage.setItem('home_module_order', JSON.stringify(newOrder));
  };

  const moveModule = useCallback((dragIndex: number, hoverIndex: number) => {
    setModuleOrder((prevModules) => {
      const newModules = [...prevModules];
      const [removed] = newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, removed);
      return newModules;
    });
  }, []);

  const toggleEditMode = () => {
    if (isEditMode) {
      // Save on exit
      saveModuleOrder(moduleOrder);
      toast.success('Diseño guardado');
    }
    setIsEditMode(!isEditMode);
  };

  const checkForRequest = async () => {
    setIsLoadingRequest(true);
    try {
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/request-info`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.hasRequest && data.leader) {
          setLeaderRequest(data.leader);
        }
      }
    } catch (err) {
      console.error('Error checking for request:', err);
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/accept-request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        setLeaderRequest(null);
        if (onModeChange) {
          await onModeChange('community'); // Switch to community mode
        }
        toast.success('¡Solicitud aceptada! Recargando...');
        
        // Reload page to refresh profile - reduced timeout
        setTimeout(() => window.location.reload(), 800);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al aceptar solicitud');
      }
    } catch (err: any) {
      console.error('Error accepting request:', err);
      toast.error(err.message || 'Error al aceptar solicitud');
    }
  };

  const handleRejectRequest = async () => {
    if (!confirm('¿Estás seguro de que quieres rechazar esta solicitud de acompañamiento?')) {
      return;
    }

    try {
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/reject-request`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        toast.success('Solicitud rechazada');
        setLeaderRequest(null);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al rechazar solicitud');
      }
    } catch (err: any) {
      console.error('Error rejecting request:', err);
      toast.error(err.message || 'Error al rechazar solicitud');
    }
  };

  const handleModeChange = async () => {
    if (!onModeChange) return;
    
    setIsChangingMode(true);
    const newMode = mode === 'personal' ? 'community' : 'personal';
    await onModeChange(newMode);
    setIsChangingMode(false);
    setShowModeDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1>{greeting()}, {userName}</h1>
              <p className="text-muted-foreground">
                {today.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={isEditMode ? "default" : "ghost"} 
                size="icon" 
                onClick={toggleEditMode}
                title={isEditMode ? "Guardar diseño" : "Personalizar módulos"}
              >
                {isEditMode ? <Check className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </Button>
              {onThemeToggle && <ThemeToggle theme={theme} onToggle={onThemeToggle} />}
              <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto p-4 space-y-6">
        {/* Edit Mode Banner */}
        {isEditMode && (
          <Alert className="border-primary bg-primary/10">
            <Settings className="h-4 w-4" />
            <AlertDescription>
              <strong>Modo de edición:</strong> Arrastra los módulos para reorganizarlos. Haz clic en el botón ✓ para guardar.
            </AlertDescription>
          </Alert>
        )}

        {/* Daily Check-in Reminder - Always on top */}
        {!hasCheckedInToday && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>
                  <strong>Recordatorio:</strong> Aún no has hecho tu check-in diario de hoy.
                </span>
                <Button size="sm" onClick={onStartCheckIn} className="w-full sm:w-auto">
                  Hacer check-in
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Leader Request Alert - Always on top */}
        {!isLoadingRequest && leaderRequest && (
          <Alert className="border-primary/50 bg-primary/5">
            <Bell className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              Nueva solicitud de acompañamiento
            </AlertTitle>
            <AlertDescription className="mt-3 space-y-3">
              <p>
                <strong>{leaderRequest.name}</strong> ({leaderRequest.email}) quiere acompañarte 
                en tu proceso de restauración como tu líder espiritual.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAcceptRequest}
                  size="sm"
                  className="flex-1"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Aceptar
                </Button>
                <Button 
                  onClick={handleRejectRequest}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Draggable Modules */}
        {moduleOrder.map((module, index) => {
          if (!module.enabled) return null;

          return (
            <DraggableModule
              key={module.id}
              id={module.id}
              index={index}
              isEditMode={isEditMode}
              onMove={moveModule}
            >
              {module.id === 'check-in-main' && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="mb-1">¿Cómo estás hoy?</div>
                          <p className="text-muted-foreground">
                            Tómate unos minutos para hacer tu check-in diario. 
                            Te ayudará a identificar patrones y encontrar el camino hacia la sanidad.
                          </p>
                        </div>
                        <Button onClick={onStartCheckIn} className="w-full sm:w-auto">
                          Comenzar check-in
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {module.id === 'mode-info' && (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          Modo de acompañamiento
                        </CardTitle>
                        <Badge variant="secondary">
                          {mode === 'personal' ? 'Personal' : 'En comunidad'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {mode === 'personal' 
                          ? 'Estás caminando este proceso por tu cuenta, entre tú y Dios.'
                          : leaderInfo 
                            ? 'Tienes un líder que te acompaña en tu proceso de restauración.'
                            : 'Modo comunidad permite que un líder te acompañe en tu proceso.'}
                      </p>
                      
                      {mode === 'community' && !isLoadingLeader && leaderInfo && (
                        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="mb-1">Tu líder</div>
                              <p className="text-muted-foreground">
                                {leaderInfo.name}
                              </p>
                              <p className="text-muted-foreground">
                                {leaderInfo.email}
                              </p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowMeetingScheduler(!showMeetingScheduler)}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            {showMeetingScheduler ? 'Ocultar' : 'Agendar reunión'}
                          </Button>
                        </div>
                      )}
                      
                      {mode === 'community' && !isLoadingLeader && !leaderInfo && (
                        <div className="p-4 rounded-lg border border-muted bg-muted/30 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <UserX className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="mb-1">Sin líder asignado</div>
                              <p className="text-muted-foreground">
                                Estás en modo comunidad pero aún no tienes un líder asignado. 
                                Espera a que un líder te envíe una solicitud de acompañamiento.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {onModeChange && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowModeDialog(true)}
                          className="w-full sm:w-auto"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Cambiar modo
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {mode === 'community' && showMeetingScheduler && leaderInfo && accessToken && (
                    <div className="mt-6">
                      <MeetingScheduler
                        userRole="disciple"
                        leaderId={leaderInfo.id}
                        accessToken={accessToken}
                        projectId={projectId}
                      />
                    </div>
                  )}
                </>
              )}

              {module.id === 'quick-stats' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Esta semana
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl">{weeklyCheckIns}</div>
                      <p className="text-muted-foreground mt-2">Check-ins completados</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Progreso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl">{totalDays}</div>
                      <p className="text-muted-foreground mt-2">Días de seguimiento</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Constancia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl">{weeklyCheckIns >= 5 ? '🔥' : '💪'}</div>
                      <p className="text-muted-foreground mt-2">
                        {weeklyCheckIns >= 5 ? '¡Excelente!' : 'Sigue así'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {module.id === 'resources' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Recursos espirituales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Accede a versículos, oraciones y recursos que te ayudarán en tu proceso de restauración.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {onViewHistory && (
                        <Button onClick={onViewHistory} variant="outline" className="flex-1 sm:flex-none">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Ver historial
                        </Button>
                      )}
                      {onViewResources && (
                        <Button onClick={onViewResources} variant="outline" className="flex-1 sm:flex-none">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Biblioteca espiritual
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </DraggableModule>
          );
        })}
      </div>

      {/* Mode Change Dialog */}
      <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar modo de acompañamiento</DialogTitle>
            <DialogDescription>
              ¿Quieres cambiar a modo {mode === 'personal' ? 'en comunidad' : 'personal'}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {mode === 'personal' ? (
              <div className="space-y-3">
                <AlertCircle className="w-10 h-10 text-primary mx-auto" />
                <p className="text-center">
                  Al cambiar a modo "En comunidad", podrás ser acompañado por un líder espiritual 
                  que caminará contigo en tu proceso de restauración.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Heart className="w-10 h-10 text-primary mx-auto" />
                <p className="text-center">
                  Al cambiar a modo "Personal", continuarás tu proceso solo con Dios. 
                  Tu líder actual ya no podrá ver tu progreso.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModeDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleModeChange} disabled={isChangingMode}>
              {isChangingMode ? 'Cambiando...' : 'Confirmar cambio'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
