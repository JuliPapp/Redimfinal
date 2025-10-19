import React, { useState, useEffect, useCallback } from 'react';
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
  Users,
  Pencil,
  Check,
  User
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
import { API_URLS } from '../utils/api';
import { MeetingScheduler } from './MeetingScheduler';

type Props = {
  mode: 'personal' | 'community';
  userName: string;
  accessToken?: string;
  theme?: 'light' | 'dark';
  onStartCheckIn: () => void;
  onViewHistory?: () => void;
  onViewResources?: () => void;
  onViewProfile?: () => void;
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

export function HomeScreen({ mode, userName, accessToken, theme = 'light', onStartCheckIn, onViewHistory, onViewResources, onViewProfile, onLogout, onModeChange, onThemeToggle }: Props) {
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
  const [hasLoadedModules, setHasLoadedModules] = useState(false);
  
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

      const response = await fetch(API_URLS.checkinsStats(), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWeeklyCheckIns(data.last7Days || 0);
        setTotalDays(data.total || 0);
        
        // Check if user has checked in today
        const checkInsResponse = await fetch(API_URLS.checkins(), {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
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
        API_URLS.myLeader(),
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
  }, [mode]);

  // Load module order only once on mount
  useEffect(() => {
    if (!hasLoadedModules) {
      loadModuleOrder();
      setHasLoadedModules(true);
    }
  }, []);

  useEffect(() => {
    console.log('📋 Current module order:', moduleOrder.map(m => m.id));
  }, [moduleOrder]);

  const loadModuleOrder = async () => {
    try {
      // Try to load from backend first
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const response = await fetch(API_URLS.moduleConfig(), {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.config) {
            // Merge with default modules to add any new modules that don't exist
            const existingIds = data.config.map((m: ModuleConfig) => m.id);
            const newModules = DEFAULT_MODULE_ORDER.filter(
              (m) => !existingIds.includes(m.id)
            );
            
            let finalConfig = data.config;
            
            if (newModules.length > 0) {
              const merged = [
                ...data.config.slice(0, 2), // Keep first two modules
                ...newModules,              // Add new modules
                ...data.config.slice(2)     // Keep rest of modules
              ];
              finalConfig = merged;
              setModuleOrder(merged);
              // Save the merged order back to backend
              await saveModuleOrderToBackend(merged, session.access_token);
            } else {
              setModuleOrder(data.config);
            }
            // Also save to localStorage as cache
            localStorage.setItem('home_module_order', JSON.stringify(finalConfig));
            return;
          }
        }
      }
      
      // Fallback to localStorage if backend fails or no session
      const saved = localStorage.getItem('home_module_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          
          // Merge with default modules to add any new modules that don't exist
          const existingIds = parsed.map((m: ModuleConfig) => m.id);
          const newModules = DEFAULT_MODULE_ORDER.filter(
            (m) => !existingIds.includes(m.id)
          );
          
          if (newModules.length > 0) {
            const merged = [
              ...parsed.slice(0, 2),
              ...newModules,
              ...parsed.slice(2)
            ];
            setModuleOrder(merged);
            localStorage.setItem('home_module_order', JSON.stringify(merged));
          } else {
            setModuleOrder(parsed);
          }
        } catch (e) {
          console.error('Error parsing localStorage:', e);
          setModuleOrder(DEFAULT_MODULE_ORDER);
        }
      } else {
        setModuleOrder(DEFAULT_MODULE_ORDER);
      }
    } catch (error) {
      console.error('Error loading module order:', error);
      setModuleOrder(DEFAULT_MODULE_ORDER);
    }
  };

  const saveModuleOrderToBackend = async (newOrder: ModuleConfig[], token: string) => {
    try {
      await fetch(API_URLS.saveModuleConfig(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ config: newOrder })
      });
    } catch (error) {
      console.error('Error saving to backend:', error);
    }
  };

  const saveModuleOrder = async (newOrder: ModuleConfig[]) => {
    console.log('💾 saveModuleOrder called with:', newOrder.map(m => m.id));
    
    // Save to localStorage immediately
    localStorage.setItem('home_module_order', JSON.stringify(newOrder));
    console.log('✅ Saved to localStorage');
    
    // Try to save to backend
    try {
      const { createClient } = await import('../utils/supabase/client');
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        await saveModuleOrderToBackend(newOrder, session.access_token);
        console.log('✅ Saved to backend');
      } else {
        console.warn('⚠️ No session found, skipping backend save');
      }
    } catch (error) {
      console.error('❌ Error saving module order to backend:', error);
    }
  };

  const moveModule = useCallback((dragIndex: number, hoverIndex: number) => {
    setModuleOrder((prevModules) => {
      const newModules = [...prevModules];
      const [removed] = newModules.splice(dragIndex, 1);
      newModules.splice(hoverIndex, 0, removed);
      return newModules;
    });
  }, []);

  const toggleEditMode = async () => {
    if (isEditMode) {
      // Save on exit
      console.log('💾 Saving module order:', moduleOrder.map(m => m.id));
      await saveModuleOrder(moduleOrder);
      toast.success('Diseño guardado y sincronizado');
    } else {
      console.log('✏️ Entering edit mode with order:', moduleOrder.map(m => m.id));
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

      const response = await fetch(API_URLS.requestInfo(), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

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

      const response = await fetch(API_URLS.acceptRequest(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

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

      const response = await fetch(API_URLS.rejectRequest(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

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
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-[20px] text-left">{greeting()}, {userName}</h1>

            </div>
            <div className="flex gap-2">
              {onViewProfile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onViewProfile}
                  title="Ver mi perfil"
                >
                  <User className="w-5 h-5" />
                </Button>
              )}
              <Button 
                variant={isEditMode ? "default" : "ghost"} 
                size="icon" 
                onClick={toggleEditMode}
                title={isEditMode ? "Guardar diseño" : "Personalizar módulos"}
              >
                {isEditMode ? <Check className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
              </Button>
              {onThemeToggle && <ThemeToggle theme={theme} onToggle={onThemeToggle} />}
              <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto p-4 space-y-4">
        {/* Edit Mode Banner */}
        {isEditMode && (
          <Alert className="border-primary bg-primary/10">
            <Pencil className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Modo de edición:</strong> Arrastra los módulos para reorganizarlos.
            </AlertDescription>
          </Alert>
        )}

        {/* Daily Check-in Reminder - Always on top */}
        {!hasCheckedInToday && (
          <Alert className="border-primary/50 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm">
                  <strong>Recordatorio:</strong> Aún no has hecho tu check-in de hoy.
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
            <AlertDescription className="mt-2 space-y-2">
              <p className="text-sm">
                <strong>{leaderRequest.name}</strong> ({leaderRequest.email}) quiere acompañarte 
                en tu proceso.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {moduleOrder.map((module, index) => {
          if (!module.enabled) return null;

          // Determinar si módulo debe ocupar 2 columnas
          const fullWidth = module.id === 'check-in-main' || module.id === 'quick-stats';

          return (
            <DraggableModule
              key={module.id}
              id={module.id}
              index={index}
              isEditMode={isEditMode}
              onMove={moveModule}
              className={fullWidth ? 'lg:col-span-2' : ''}
            >
              {module.id === 'check-in-main' && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="mb-1">¿Cómo estás hoy?</div>
                          <p className="text-muted-foreground text-sm">
                            Tómate unos minutos para hacer tu check-in diario.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {onViewHistory && (
                            <Button onClick={onViewHistory} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                              <CalendarIcon className="w-3 h-3 mr-1.5" />
                              Ver historial
                            </Button>
                          )}
                          <Button onClick={onStartCheckIn} size="sm" className="flex-1 sm:flex-initial">
                            Comenzar check-in
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {module.id === 'mode-info' && (
                <>
                  <Card className="h-full flex flex-col m-[0px] p-[0px]">
                    <CardHeader className="pb-[0px] pt-[24px] pr-[24px] pl-[24px]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base text-[16px]">Modo de acompañamiento</CardTitle>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="secondary" className="text-xs">
                            {mode === 'personal' ? 'Personal' : 'En comunidad'}
                          </Badge>
                          {onModeChange && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setShowModeDialog(true)}
                              className="h-6 w-6"
                              title="Cambiar modo"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 flex-1">
                      <p className="text-muted-foreground text-xs text-[14px]">
                        {mode === 'personal' 
                          ? 'Caminando con Dios en este proceso.'
                          : leaderInfo 
                            ? 'Tienes un líder acompañándote.'
                            : 'Esperando asignación de líder.'}
                      </p>
                      
                      {mode === 'community' && !isLoadingLeader && leaderInfo && (
                        <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <UserCheck className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">
                                {leaderInfo.name}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-shrink-0"
                              onClick={() => setShowMeetingScheduler(!showMeetingScheduler)}
                            >
                              <Users className="w-3 h-3 mr-2" />
                              {showMeetingScheduler ? 'Ocultar' : 'Agendar'}
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {mode === 'community' && !isLoadingLeader && !leaderInfo && (
                        <div className="p-3 rounded-lg border border-muted bg-muted/30">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <UserX className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm mb-0.5">Sin líder asignado</div>
                              <p className="text-muted-foreground text-xs">
                                Espera a que un líder te envíe una solicitud.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {mode === 'community' && showMeetingScheduler && leaderInfo && accessToken && (
                    <div className="mt-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Esta semana</span>
                      </div>
                      <div className="text-2xl mb-0.5">{weeklyCheckIns}</div>
                      <p className="text-muted-foreground text-xs">Check-ins</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Progreso</span>
                      </div>
                      <div className="text-2xl mb-0.5">{totalDays}</div>
                      <p className="text-muted-foreground text-xs">Días</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Constancia</span>
                      </div>
                      <div className="text-2xl mb-0.5">{weeklyCheckIns >= 5 ? '🔥' : '💪'}</div>
                      <p className="text-muted-foreground text-xs">
                        {weeklyCheckIns >= 5 ? '¡Excelente!' : 'Sigue así'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {module.id === 'resources' && (
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="w-4 h-4" />
                      Recursos espirituales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 flex-1 pt-[13px] pr-[24px] pb-[24px] pl-[24px]">
                    <p className="text-muted-foreground text-xs mb-3">
                      Explora nuestra colección de recursos para fortalecer tu camino espiritual.
                    </p>
                    {onViewResources && (
                      <Button onClick={onViewResources} variant="outline" size="sm" className="w-full justify-start">
                        <BookOpen className="w-3 h-3 mr-2" />
                        Biblioteca espiritual
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </DraggableModule>
          );
        })}
        </div>
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
