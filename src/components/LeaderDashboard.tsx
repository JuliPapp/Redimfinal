import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MeetingScheduler } from './MeetingScheduler';
import { DiscipleCheckInsView } from './DiscipleCheckInsView';
import { ThemeToggle } from './ThemeToggle';
import { 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  LogOut,
  Eye,
  UserPlus,
  UserMinus,
  BookOpen,
  Loader2,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Disciple = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

type Props = {
  leaderName: string;
  accessToken: string;
  projectId: string;
  theme?: 'light' | 'dark';
  onLogout: () => void;
  onViewLibrary?: () => void;
  onViewAdminPanel?: () => void;
  onViewDisciple?: (discipleId: string) => void;
  onThemeToggle?: () => void;
};

export function LeaderDashboard({ leaderName, accessToken, projectId, theme = 'light', onLogout, onViewLibrary, onViewAdminPanel, onThemeToggle }: Props) {
  const [disciples, setDisciples] = useState<Disciple[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Disciple[]>([]);
  const [availableDisciples, setAvailableDisciples] = useState<Disciple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('my-disciples');
  const [isLegacyMode, setIsLegacyMode] = useState(false);
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [viewMode, setViewMode] = useState<'checkins' | null>(null);
  const [leaderStats, setLeaderStats] = useState<{
    totalCheckIns: number;
    checkInsThisWeek: number;
    avgIntensity: number;
    trend: number;
  } | null>(null);

  useEffect(() => {
    fetchDisciples();
    fetchPendingRequests();
    fetchLeaderStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailableDisciples();
    } else if (activeTab === 'pending') {
      fetchPendingRequests();
    }
  }, [activeTab]);

  const fetchDisciples = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/disciples`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar discípulos');
      }

      const data = await response.json();
      setDisciples(data.disciples || []);
    } catch (err: any) {
      console.error('Error fetching disciples:', err);
      setError(err.message || 'Error al cargar discípulos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/pending-requests`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar solicitudes pendientes');
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
      if (data.legacyMode) {
        setIsLegacyMode(true);
      }
    } catch (err: any) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const fetchAvailableDisciples = async () => {
    setIsLoadingAvailable(true);
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/available-disciples`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar usuarios disponibles');
      }

      const data = await response.json();
      setAvailableDisciples(data.availableDisciples || []);
    } catch (err: any) {
      console.error('Error fetching available disciples:', err);
      toast.error(err.message || 'Error al cargar usuarios disponibles');
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  const fetchLeaderStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/leader-stats`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLeaderStats({
          totalCheckIns: data.totalCheckIns || 0,
          checkInsThisWeek: data.checkInsThisWeek || 0,
          avgIntensity: data.avgIntensity || 0,
          trend: data.trend || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching leader stats:', err);
    }
  };

  const handleAssignDisciple = async (discipleId: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/assign-disciple`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ discipleId })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al asignar discípulo');
      }

      toast.success('Solicitud enviada exitosamente');
      
      // Refresh all lists
      await fetchDisciples();
      await fetchPendingRequests();
      await fetchAvailableDisciples();
    } catch (err: any) {
      console.error('Error assigning disciple:', err);
      toast.error(err.message || 'Error al asignar discípulo');
    }
  };

  const handleUnassignDisciple = async (discipleId: string) => {
    if (!confirm('¿Estás seguro de que deseas dejar de acompañar a este discípulo?')) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/unassign-disciple`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ discipleId })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al desasignar discípulo');
      }

      toast.success('Solicitud cancelada exitosamente');
      
      // Refresh all lists
      await fetchDisciples();
      await fetchPendingRequests();
      await fetchAvailableDisciples();
    } catch (err: any) {
      console.error('Error unassigning disciple:', err);
      toast.error(err.message || 'Error al desasignar discípulo');
    }
  };

  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // If viewing a disciple's check-ins, show that view
  if (selectedDisciple && viewMode === 'checkins') {
    return (
      <DiscipleCheckInsView
        disciple={selectedDisciple}
        accessToken={accessToken}
        projectId={projectId}
        onBack={() => {
          setSelectedDisciple(null);
          setViewMode(null);
          // Refresh disciples list in case the disciple changed to personal mode
          fetchDisciples();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1>{greeting()}, {leaderName}</h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Líder
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Panel de acompañamiento • Tu cuenta fue configurada como líder
              </p>
            </div>
            <div className="flex gap-2">
              {onViewAdminPanel && (
                <Button variant="default" onClick={onViewAdminPanel}>
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              )}
              {onViewLibrary && (
                <Button variant="outline" onClick={onViewLibrary}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Biblioteca
                </Button>
              )}
              {onThemeToggle && <ThemeToggle theme={theme} onToggle={onThemeToggle} />}
              <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto p-4 py-8 space-y-6">
        {/* Legacy Mode Warning */}
        {isLegacyMode && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Modo de compatibilidad activado:</strong> El sistema de solicitudes no está disponible porque falta la migración de base de datos. 
              Las asignaciones se harán directamente sin confirmación del discípulo. 
              Para habilitar el sistema de solicitudes, ejecuta el SQL en <code>DATABASE_MIGRATION.md</code>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Mis Discípulos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">{disciples.length} personas</div>
              <p className="text-muted-foreground mt-2">
                Acompañando en su proceso
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Pendientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">{pendingRequests.length} solicitudes</div>
              <p className="text-muted-foreground mt-2">
                Esperando confirmación
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Progreso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderStats ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl">{leaderStats.checkInsThisWeek}</div>
                    {leaderStats.trend !== 0 && (
                      <Badge variant={leaderStats.trend > 0 ? "default" : "secondary"} className="text-xs">
                        {leaderStats.trend > 0 ? '+' : ''}{leaderStats.trend}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    Check-ins esta semana
                  </p>
                  {leaderStats.avgIntensity > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Intensidad promedio: {leaderStats.avgIntensity}/10
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="text-muted-foreground">--</div>
                  <p className="text-muted-foreground mt-2">Cargando...</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for disciples */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-disciples">
              Confirmados ({disciples.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendientes ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="available">
              Disponibles ({availableDisciples.length})
            </TabsTrigger>
            <TabsTrigger value="meetings">
              Reuniones
            </TabsTrigger>
          </TabsList>

          {/* My Disciples Tab */}
          <TabsContent value="my-disciples" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mis discípulos</CardTitle>
                    <CardDescription>
                      Personas que estás acompañando en su proceso de restauración
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchDisciples()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      'Actualizar'
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Cargando...
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : disciples.length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <div className="mb-1">Aún no tienes discípulos asignados</div>
                      <p className="text-muted-foreground">
                        Ve a la pestaña "Disponibles" para asignarte discípulos
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {disciples.map((disciple) => (
                      <div
                        key={disciple.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="mb-1">{disciple.name}</div>
                          <p className="text-muted-foreground">
                            {disciple.email}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            Desde {new Date(disciple.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDisciple(disciple);
                              setViewMode('checkins');
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver check-ins
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnassignDisciple(disciple.id)}
                          >
                            <UserMinus className="w-4 h-4 mr-2" />
                            Desasignar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Solicitudes pendientes</CardTitle>
                <CardDescription>
                  Personas que aún no han aceptado tu solicitud de acompañamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Cargando...
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <div className="mb-1">No hay solicitudes pendientes</div>
                      <p className="text-muted-foreground">
                        Las personas que invites aparecerán aquí hasta que acepten
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingRequests.map((disciple) => (
                      <div
                        key={disciple.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30"
                      >
                        <div className="flex-1">
                          <div className="mb-1">{disciple.name}</div>
                          <p className="text-muted-foreground">
                            {disciple.email}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            Solicitud enviada • Esperando confirmación
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnassignDisciple(disciple.id)}
                        >
                          <UserMinus className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Available Disciples Tab */}
          <TabsContent value="available" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Usuarios disponibles</CardTitle>
                <CardDescription>
                  Personas sin líder asignado que puedes acompañar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAvailable ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Cargando...
                  </div>
                ) : availableDisciples.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <UserPlus className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <div className="mb-1">No hay usuarios disponibles</div>
                      <p className="text-muted-foreground">
                        Todos los usuarios ya tienen líder asignado
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableDisciples.map((disciple) => (
                      <div
                        key={disciple.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="mb-1">{disciple.name}</div>
                          <p className="text-muted-foreground">
                            {disciple.email}
                          </p>
                          <p className="text-muted-foreground mt-1">
                            Registrado {new Date(disciple.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleAssignDisciple(disciple.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Enviar solicitud
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings" className="mt-6">
            <MeetingScheduler
              userRole="leader"
              accessToken={accessToken}
              projectId={projectId}
            />
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Como líder, tu rol es acompañar con amor y sin juicio. Recuerda que cada persona 
                tiene su propio tiempo en el proceso de restauración.
              </p>
              <p className="italic text-primary">
                "El que comenzó en vosotros la buena obra, la perfeccionará" — Filipenses 1:6
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
