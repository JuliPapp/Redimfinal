import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MeetingScheduler } from './MeetingScheduler';
import { DiscipleCheckInsView } from './DiscipleCheckInsView';
import { DiscipleProfileView } from './DiscipleProfileView';
import { ThemeToggle } from './ThemeToggle';
import { 
  LogOut,
  Eye,
  UserMinus,
  BookOpen,
  Loader2,
  RefreshCw,
  Moon,
  Sun,
  Clock,
  Video,
  User
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';
import svgPaths from '../imports/svg-rtshddnzq9';

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
  onThemeToggle?: () => void;
};

export function LeaderDashboard({ 
  leaderName, 
  accessToken, 
  projectId, 
  theme = 'light', 
  onLogout, 
  onViewLibrary, 
  onThemeToggle 
}: Props) {
  const [disciples, setDisciples] = useState<Disciple[]>([]);
  const [availableDisciples, setAvailableDisciples] = useState<Disciple[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Disciple[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(null);
  const [viewMode, setViewMode] = useState<'checkins' | 'profile' | null>(null);

  useEffect(() => {
    fetchDisciples();
    fetchAvailableDisciples();
    fetchPendingRequests();
  }, []);

  const fetchDisciples = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.disciples(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar discípulos');
      }

      const data = await response.json();
      setDisciples(data.disciples || []);
    } catch (err: any) {
      console.error('Error fetching disciples:', err);
      toast.error(err.message || 'Error al cargar discípulos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableDisciples = async () => {
    try {
      const response = await fetch(API_URLS.availableDisciples(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar discípulos disponibles');
      }

      const data = await response.json();
      setAvailableDisciples(data.availableDisciples || []);
    } catch (err: any) {
      console.error('Error fetching available disciples:', err);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch(API_URLS.pendingRequests(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Error al cargar solicitudes pendientes');
      }

      const data = await response.json();
      setPendingRequests(data.pendingRequests || []);
    } catch (err: any) {
      console.error('Error fetching pending requests:', err);
    }
  };

  const handleUnassignDisciple = async (discipleId: string) => {
    if (!confirm('¿Estás seguro de que quieres desasignar a este discípulo?')) {
      return;
    }

    try {
      const response = await fetch(API_URLS.unassignDisciple(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ discipleId })
      });

      if (!response.ok) {
        throw new Error('Error al desasignar discípulo');
      }

      toast.success('Discípulo desasignado exitosamente');
      await fetchDisciples();
      await fetchAvailableDisciples();
      await fetchPendingRequests();
    } catch (err: any) {
      console.error('Error unassigning disciple:', err);
      toast.error(err.message || 'Error al desasignar discípulo');
    }
  };

  const handleAssignDisciple = async (discipleId: string) => {
    if (!confirm('¿Quieres enviar una solicitud de acompañamiento a este discípulo?')) {
      return;
    }

    try {
      const response = await fetch(API_URLS.assignDisciple(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ discipleId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al enviar solicitud');
      }

      toast.success('Solicitud enviada exitosamente');
      await fetchDisciples();
      await fetchAvailableDisciples();
      await fetchPendingRequests();
    } catch (err: any) {
      console.error('Error assigning disciple:', err);
      toast.error(err.message || 'Error al enviar solicitud');
    }
  };

  const handleCancelRequest = async (discipleId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta solicitud?')) {
      return;
    }

    try {
      const response = await fetch(API_URLS.unassignDisciple(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ discipleId })
      });

      if (!response.ok) {
        throw new Error('Error al cancelar solicitud');
      }

      toast.success('Solicitud cancelada exitosamente');
      await fetchDisciples();
      await fetchAvailableDisciples();
      await fetchPendingRequests();
    } catch (err: any) {
      console.error('Error cancelling request:', err);
      toast.error(err.message || 'Error al cancelar solicitud');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `Desde ${day} de ${month} de ${year}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (viewMode === 'checkins' && selectedDisciple) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] p-8">
        <div className="max-w-5xl mx-auto">
          <DiscipleCheckInsView
            disciple={selectedDisciple}
            accessToken={accessToken}
            projectId={projectId}
            onBack={() => {
              setViewMode(null);
              setSelectedDisciple(null);
            }}
          />
        </div>
      </div>
    );
  }

  if (viewMode === 'profile' && selectedDisciple) {
    console.log('🔍 Rendering DiscipleProfileView for:', selectedDisciple);
    return (
      <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#1a1a1a] p-8">
        <div className="max-w-5xl mx-auto">
          <DiscipleProfileView
            discipleId={selectedDisciple.id}
            discipleName={selectedDisciple.name}
            accessToken={accessToken}
            onBack={() => {
              console.log('📤 Going back from DiscipleProfileView');
              setViewMode(null);
              setSelectedDisciple(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] dark:bg-[#1a1a1a] relative">
      {/* Header fijo */}
      <div className="absolute bg-[#fdfcfe] dark:bg-[#242424] left-0 top-0 w-full border-b border-[#e5dfe8] dark:border-[#333333] z-10">
        <div className="max-w-[1135px] mx-auto px-[135px] py-6">
          <div className="flex items-center justify-between">
            {/* Saludo y badge */}
            <div className="flex items-center gap-3">
              <p className="font-['Inter'] font-normal leading-[24px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                {getGreeting()}, {leaderName}
              </p>
              <div className="bg-[rgba(126,179,213,0.1)] dark:bg-[rgba(126,179,213,0.2)] h-[21.811px] rounded-[10px] px-2 py-1">
                <p className="font-['Inter'] font-medium leading-[16px] text-[#7eb3d5] dark:text-[#8ec5e6] text-[12px]">
                  Líder
                </p>
              </div>
            </div>

            {/* Botones de acciones */}
            <div className="flex items-center gap-2">
              {/* Botón Biblioteca */}
              {onViewLibrary && (
                <button
                  onClick={onViewLibrary}
                  className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[35.994px] rounded-[10px] border border-[#e5dfe8] dark:border-[#333333] px-3 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                >
                  <svg className="block size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g clipPath="url(#clip0_biblioteca)" id="Icon">
                      <path d="M7.99716 4.66501V13.995" stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                      <path d={svgPaths.pd5f2f00} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                    </g>
                    <defs>
                      <clipPath id="clip0_biblioteca">
                        <rect fill="white" height="15.9943" width="15.9943" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                    Biblioteca
                  </span>
                </button>
              )}

              {/* Botón tema */}
              {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className="rounded-[10px] size-[35.994px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-[15.994px] h-[15.994px] text-[#2D3748] dark:text-[#e5e5e5]" />
                  ) : (
                    <Moon className="w-[15.994px] h-[15.994px] text-[#2D3748] dark:text-[#e5e5e5]" />
                  )}
                </button>
              )}

              {/* Botón logout */}
              <button
                onClick={onLogout}
                className="rounded-[10px] size-[35.994px] flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333333] transition-colors"
              >
                <svg className="block size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                  <g id="Icon">
                    <path d={svgPaths.p3a68dbc0} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                    <path d="M13.995 7.99716H5.99787" stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                    <path d={svgPaths.p1f15eec0} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-[896px] mx-auto px-4 pt-[116px] pb-8">
        <div className="flex flex-col gap-6">
          
          {/* Card 1: Mis Discípulos */}
          <div className="bg-[#fdfcfe] dark:bg-[#242424] rounded-[16px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333]">
            <div className="p-6">
              {/* Header con título y botón actualizar */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="font-['Inter'] font-medium leading-[16px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px] mb-2">
                    Mis discípulos
                  </p>
                  <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                    Personas que estás acompañando en su proceso de restauración
                  </p>
                </div>
                <button
                  onClick={() => {
                    fetchDisciples();
                    fetchAvailableDisciples();
                    fetchPendingRequests();
                  }}
                  disabled={isLoading}
                  className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[31.996px] rounded-[10px] border border-[#e5dfe8] dark:border-[#333333] px-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                >
                  <span className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                    {isLoading ? 'Cargando...' : 'Actualizar'}
                  </span>
                </button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="confirmados" className="w-full">
                <TabsList className="bg-[#e8f5f1] dark:bg-[#2a2a2a] h-[36px] rounded-[16px] w-full grid grid-cols-3 p-0 mb-8">
                  <TabsTrigger 
                    value="confirmados" 
                    className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                  >
                    <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                      Confirmados ({disciples.length})
                    </p>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pendientes" 
                    className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                  >
                    <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                      Pendientes ({pendingRequests.length})
                    </p>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="disponibles" 
                    className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                  >
                    <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                      Disponibles ({availableDisciples.length})
                    </p>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="confirmados" className="mt-0">
                  {/* Lista de discípulos */}
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#7eb3d5]" />
                    </div>
                  ) : disciples.length === 0 ? (
                    <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                      <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                        No tienes discípulos asignados todavía.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {disciples.map((disciple) => (
                        <div 
                          key={disciple.id}
                          className="h-[113.8px] relative rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]"
                        >
                          <div className="absolute left-[16.9px] top-[16.9px] flex flex-col gap-[3.999px]">
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                              {disciple.name}
                            </p>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              {disciple.email}
                            </p>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              {formatDate(disciple.created_at)}
                            </p>
                          </div>

                          <div className="absolute flex gap-[7.997px] h-[31.996px] right-[16.9px] top-[40.9px]">
                            <button
                              onClick={() => {
                                console.log('👤 Viewing profile for disciple:', disciple);
                                setSelectedDisciple(disciple);
                                setViewMode('profile');
                              }}
                              className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[31.996px] rounded-[10px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center h-full gap-2">
                                <User className="size-[15.994px] text-[#2D3748] dark:text-[#e5e5e5]" />
                                <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                                  Ver Perfil
                                </p>
                              </div>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedDisciple(disciple);
                                setViewMode('checkins');
                              }}
                              className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[31.996px] rounded-[10px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center h-full relative">
                                <svg className="absolute left-[10.91px] top-[8px] size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                  <g clipPath="url(#clip0_eye)" id="Icon">
                                    <path d={svgPaths.p2eb0bf00} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d={svgPaths.p1f301500} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_eye">
                                      <rect fill="white" height="15.9943" width="15.9943" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px] ml-[30.9px]">
                                  Ver check-ins
                                </p>
                              </div>
                            </button>

                            <button
                              onClick={() => handleUnassignDisciple(disciple.id)}
                              className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[31.996px] rounded-[10px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center h-full relative">
                                <svg className="top-[8px] size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                  <g clipPath="url(#clip0_unassign)" id="Icon">
                                    <path d={svgPaths.p15935c00} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d={svgPaths.p23a34100} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d="M14.6615 7.33073H10.6629" stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_unassign">
                                      <rect fill="white" height="15.9943" width="15.9943" />
                                    </clipPath>
                                  </defs>
                                </svg>
                          
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pendientes" className="mt-0">
                  {pendingRequests.length === 0 ? (
                    <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                      <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                        No hay solicitudes pendientes de confirmación
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {pendingRequests.map((disciple) => (
                        <div 
                          key={disciple.id}
                          className="h-[113.8px] relative rounded-[12px] border-[0.909px] border-[#fbbf24] dark:border-[#d97706] dark:bg-[#1a1a1a]"
                        >
                          <div className="absolute left-[16.9px] top-[16.9px] flex flex-col gap-[3.999px]">
                            <div className="flex items-center gap-2">
                              <p className="font-['Inter'] font-normal leading-[24px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                                {disciple.name}
                              </p>
                              <div className="bg-[#fef3c7] dark:bg-[#78350f] h-[21.811px] rounded-[10px] px-2 py-1">
                                <p className="font-['Inter'] font-medium leading-[16px] text-[#f59e0b] dark:text-[#fbbf24] text-[12px]">
                                  Pendiente
                                </p>
                              </div>
                            </div>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              {disciple.email}
                            </p>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              Solicitud enviada
                            </p>
                          </div>

                          <div className="absolute flex gap-[7.997px] h-[31.996px] right-[16.9px] top-[40.9px]">
                            <button
                              onClick={() => handleCancelRequest(disciple.id)}
                              className="bg-[#fdfcfb] dark:bg-[#2a2a2a] h-[31.996px] rounded-[10px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3 hover:bg-gray-50 dark:hover:bg-[#333333] transition-colors"
                            >
                              <div className="flex items-center h-full relative">
                                <svg className="absolute left-[10.91px] top-[8px] size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                  <g id="Icon">
                                    <path d="M12.6622 3.33073L3.33216 12.6608" stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d="M3.33216 3.33073L12.6622 12.6608" stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                  </g>
                                </svg>
                                <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px] ml-[30.9px]">
                                  Cancelar solicitud
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="disponibles" className="mt-0">
                  {availableDisciples.length === 0 ? (
                    <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                      <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                        No hay discípulos disponibles en este momento
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-3">
                      {availableDisciples.map((disciple) => (
                        <div 
                          key={disciple.id}
                          className="h-[113.8px] relative rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]"
                        >
                          <div className="absolute left-[16.9px] top-[16.9px] flex flex-col gap-[3.999px]">
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                              {disciple.name}
                            </p>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              {disciple.email}
                            </p>
                            <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                              {formatDate(disciple.created_at)}
                            </p>
                          </div>

                          <div className="absolute flex gap-[7.997px] h-[31.996px] right-[16.9px] top-[40.9px]">
                            <button
                              onClick={() => handleAssignDisciple(disciple.id)}
                              className="bg-[#7eb3d5] dark:bg-[#5a8db0] h-[31.996px] rounded-[10px] px-3 hover:bg-[#7eb3d5]/90 dark:hover:bg-[#4a7d9f] transition-colors"
                            >
                              <div className="flex items-center h-full relative">
                                <svg className="absolute left-[10.91px] top-[8px] size-[15.994px]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                  <g clipPath="url(#clip0_assign)" id="Icon">
                                    <path d={svgPaths.p15935c00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d={svgPaths.p23a34100} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d="M10.6629 7.33073H14.6615" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                    <path d="M12.6622 5.33145V9.33002" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_assign">
                                      <rect fill="white" height="15.9943" width="15.9943" />
                                    </clipPath>
                                  </defs>
                                </svg>
                                <p className="font-['Inter'] font-medium leading-[20px] text-white text-[14px] tracking-[-0.1504px] ml-[30.9px]">
                                  Enviar solicitud
                                </p>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Card 2: MeetingScheduler (Horarios + Reuniones) */}
          <MeetingScheduler 
            userRole="leader"
            accessToken={accessToken}
            projectId={projectId}
          />

          {/* Card 3: Mensaje inspirador */}
          <div className="bg-[#fdfcfe] dark:bg-[#242424] rounded-[16px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] p-6">
            <div className="text-center space-y-2">
              <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                Como líder, tu rol es acompañar con amor y sin juicio. Recuerda que cada persona tiene su propio tiempo en el proceso de restauración.
              </p>
              <p className="font-['Inter'] font-normal italic leading-[24px] text-[#7eb3d5] dark:text-[#8ec5e6] text-[16px] tracking-[-0.3125px]">
                "El que comenzó en vosotros la buena obra, la perfeccionará" — Filipenses 1:6
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
