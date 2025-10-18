import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  Calendar, 
  TrendingUp, 
  Heart, 
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Loader2
} from 'lucide-react';

type CheckIn = {
  id: string;
  struggles: string[];
  intensity: number;
  trigger?: string;
  emotions: string[];
  identified_roots: string[];
  timestamp: string;
  created_at: string;
};

type CheckInStats = {
  total: number;
  last7Days: number;
  last30Days: number;
  avgIntensity: number;
  topStruggles: Array<{ struggle: string; count: number }>;
  topRoots: Array<{ root: string; count: number }>;
};

type Props = {
  accessToken: string;
  projectId: string;
  onBack: () => void;
};

const STRUGGLE_LABELS: Record<string, string> = {
  'fornicacion': 'Fornicación',
  'masturbacion': 'Masturbación',
  'pornografia': 'Pornografía',
  'lujuria': 'Lujuria',
  'fantasias': 'Fantasías sexuales',
  'coqueteo': 'Coqueteo',
  'mentira': 'Mentira/engaño',
  'auto-lesion': 'Auto-lesión',
  'pensamientos-suicidas': 'Pensamientos suicidas',
  'otro': 'Otro'
};

const EMOTION_LABELS: Record<string, string> = {
  'tristeza': 'Tristeza',
  'ansiedad': 'Ansiedad',
  'ira': 'Ira',
  'verguenza': 'Vergüenza',
  'soledad': 'Soledad',
  'confusion': 'Confusión',
  'paz': 'Paz',
  'alegria': 'Alegría',
  'esperanza': 'Esperanza'
};

const ROOT_LABELS: Record<string, string> = {
  'falta-intimidad-dios': 'Falta de intimidad con Dios',
  'familia-rota': 'Familia rota/disfuncional',
  'abuso-pasado': 'Abuso en el pasado',
  'rechazo': 'Rechazo/abandono',
  'trauma': 'Trauma no sanado',
  'mentiras-creidas': 'Mentiras creídas sobre identidad',
  'falta-comunidad': 'Falta de comunidad',
  'adiccion': 'Adicción/dependencia'
};

export function CheckInHistory({ accessToken, projectId, onBack }: Props) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [stats, setStats] = useState<CheckInStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    fetchCheckIns();
    fetchStats();
  }, []);

  const fetchCheckIns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/checkins`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCheckIns(data.checkIns || []);
      }
    } catch (err) {
      console.error('Error fetching check-ins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/checkins-stats`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-destructive';
    if (intensity >= 5) return 'text-orange-500';
    return 'text-yellow-500';
  };

  const getIntensityBadge = (intensity: number) => {
    if (intensity >= 8) return 'destructive';
    if (intensity >= 5) return 'secondary';
    return 'outline';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando historial...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Mi Historial</h1>
            <p className="text-muted-foreground">
              Revisa tu progreso y patrones identificados
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">
              <Calendar className="w-4 h-4 mr-2" />
              Historial
            </TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="w-4 h-4 mr-2" />
              Estadísticas
            </TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            {checkIns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="mb-2">No hay check-ins todavía</h3>
                  <p className="text-muted-foreground">
                    Completa tu primer check-in diario para empezar a rastrear tu progreso
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {checkIns.map((checkIn) => (
                    <Card key={checkIn.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(checkIn.created_at)}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Intensidad: <span className={getIntensityColor(checkIn.intensity)}>
                                {checkIn.intensity}/10
                              </span>
                            </CardDescription>
                          </div>
                          <Badge variant={getIntensityBadge(checkIn.intensity)}>
                            {checkIn.intensity >= 8 ? 'Alta' : checkIn.intensity >= 5 ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Struggles */}
                        {checkIn.struggles && checkIn.struggles.length > 0 && (
                          <div>
                            <div className="mb-2 text-muted-foreground">
                              Luchas:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {checkIn.struggles.map((s, idx) => {
                                // Handle both old format (string) and new format (object)
                                const struggleName = typeof s === 'string' ? s : s?.name || s;
                                const intensity = typeof s === 'object' && s?.intensity ? s.intensity : null;
                                return (
                                  <Badge key={idx} variant="outline">
                                    {STRUGGLE_LABELS[struggleName] || struggleName}
                                    {intensity && ` (${intensity}/10)`}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Trigger */}
                        {checkIn.trigger && (
                          <div>
                            <div className="mb-1 text-muted-foreground">
                              Detonante:
                            </div>
                            <p className="text-sm bg-muted p-2 rounded-md">
                              {checkIn.trigger}
                            </p>
                          </div>
                        )}

                        {/* Emotions */}
                        {checkIn.emotions && checkIn.emotions.length > 0 && (
                          <div>
                            <div className="mb-2 text-muted-foreground">
                              Emociones:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {checkIn.emotions.map((e) => (
                                <Badge key={e} variant="secondary">
                                  {EMOTION_LABELS[e] || e}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Roots */}
                        {checkIn.identified_roots && checkIn.identified_roots.length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                              <TrendingUp className="w-4 h-4" />
                              Raíces identificadas:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {checkIn.identified_roots.map((r) => (
                                <Badge key={r} variant="default">
                                  {ROOT_LABELS[r] || r}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="mt-6">
            {stats ? (
              <div className="space-y-4">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl">{stats.total}</div>
                      <p className="text-muted-foreground">check-ins</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Esta semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl">{stats.last7Days}</div>
                      <p className="text-muted-foreground">últimos 7 días</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle>Intensidad promedio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl ${getIntensityColor(stats.avgIntensity)}`}>
                        {stats.avgIntensity}/10
                      </div>
                      <p className="text-muted-foreground">en total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Struggles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Luchas más frecuentes
                    </CardTitle>
                    <CardDescription>
                      Tus principales áreas de batalla
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.topStruggles.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No hay datos suficientes
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {stats.topStruggles.map((item, index) => (
                          <div key={item.struggle} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="mb-1">
                                {STRUGGLE_LABELS[item.struggle] || item.struggle}
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary"
                                  style={{ width: `${(item.count / stats.total) * 100}%` }}
                                />
                              </div>
                            </div>
                            <Badge variant="secondary">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Top Roots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Raíces más identificadas
                    </CardTitle>
                    <CardDescription>
                      Patrones espirituales y emocionales recurrentes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.topRoots.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No hay datos suficientes
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {stats.topRoots.map((item, index) => (
                          <div key={item.root} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="mb-1">
                                {ROOT_LABELS[item.root] || item.root}
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-secondary"
                                  style={{ width: `${(item.count / stats.total) * 100}%` }}
                                />
                              </div>
                            </div>
                            <Badge variant="outline">{item.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No hay estadísticas disponibles
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
