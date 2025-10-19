import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';
import svgPaths from '../imports/svg-2nhxywnq9y';

type TimeSlot = {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
};

type Meeting = {
  id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  leader_name?: string;
  disciple_name?: string;
  reschedule_requested?: boolean;
  reschedule_reason?: string;
  original_date?: string;
  original_time?: string;
};

type Props = {
  userRole: 'leader' | 'disciple';
  leaderId?: string;
  accessToken: string;
  projectId: string;
};

const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Lunes' },
  { value: 'tuesday', label: 'Martes' },
  { value: 'wednesday', label: 'Miércoles' },
  { value: 'thursday', label: 'Jueves' },
  { value: 'friday', label: 'Viernes' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' }
];

export function MeetingScheduler({ userRole, leaderId, accessToken, projectId }: Props) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [activeTab, setActiveTab] = useState(userRole === 'disciple' ? 'disponibles' : 'confirmados');

  useEffect(() => {
    if (userRole === 'leader') {
      fetchMyTimeSlots();
      fetchMyMeetings();
    } else if (leaderId) {
      fetchLeaderTimeSlots();
      fetchMyMeetings();
    }
  }, [userRole, leaderId]);

  const fetchMyTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.timeSlots(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.timeSlots || []);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaderTimeSlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URLS.leaderTimeSlots(leaderId!), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.timeSlots || []);
      }
    } catch (err) {
      console.error('Error fetching leader time slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyMeetings = async () => {
    try {
      const response = await fetch(API_URLS.meetings(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings || []);
      }
    } catch (err) {
      console.error('Error fetching meetings:', err);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!selectedDay || !startTime || !endTime) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    setIsAddingSlot(true);
    try {
      const response = await fetch(API_URLS.timeSlots(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          day: selectedDay,
          start_time: startTime,
          end_time: endTime
        })
      });
      if (response.ok) {
        toast.success('Horario agregado exitosamente');
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        await fetchMyTimeSlots();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al agregar horario');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al agregar horario');
    } finally {
      setIsAddingSlot(false);
    }
  };

  const handleDeleteTimeSlot = async (slotId: string) => {
    try {
      const response = await fetch(API_URLS.deleteTimeSlot(slotId), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        toast.success('Horario eliminado');
        await fetchMyTimeSlots();
      } else {
        throw new Error('Error al eliminar horario');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar horario');
    }
  };

  const handleRequestMeeting = async (slotId: string) => {
    try {
      const response = await fetch(API_URLS.requestMeeting(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          time_slot_id: slotId,
          leader_id: leaderId
        })
      });
      if (response.ok) {
        toast.success('Solicitud de reunión enviada');
        await fetchLeaderTimeSlots();
        await fetchMyMeetings();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al solicitar reunión');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al solicitar reunión');
    }
  };

  const handleConfirmMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(API_URLS.confirmMeeting(meetingId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        toast.success('Reunión confirmada');
        await fetchMyMeetings();
      } else {
        throw new Error('Error al confirmar reunión');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al confirmar reunión');
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(API_URLS.cancelMeeting(meetingId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        toast.success('Reunión cancelada');
        await fetchMyMeetings();
        if (userRole === 'leader') {
          await fetchMyTimeSlots();
        }
      } else {
        throw new Error('Error al cancelar reunión');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al cancelar reunión');
    }
  };

  const handleCancelConfirmedMeeting = async (meetingId: string) => {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reunión confirmada?')) {
      return;
    }
    try {
      const response = await fetch(
        API_URLS.cancelConfirmedMeeting(meetingId),
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );
      if (response.ok) {
        toast.success('Reunión cancelada');
        await fetchMyMeetings();
        if (userRole === 'leader') {
          await fetchMyTimeSlots();
        } else {
          await fetchLeaderTimeSlots();
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al cancelar reunión');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al cancelar reunión');
    }
  };

  const handleRequestReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowRescheduleDialog(true);
    setRescheduleReason('');
  };

  const handleSubmitReschedule = async () => {
    if (!selectedMeeting || !rescheduleReason.trim()) {
      toast.error('Por favor proporciona un motivo para el cambio');
      return;
    }
    try {
      const response = await fetch(API_URLS.requestReschedule(selectedMeeting.id), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ reason: rescheduleReason })
      });
      if (response.ok) {
        toast.success('Solicitud de cambio enviada');
        setShowRescheduleDialog(false);
        setSelectedMeeting(null);
        setRescheduleReason('');
        await fetchMyMeetings();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al solicitar cambio');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al solicitar cambio');
    }
  };

  const handleApproveReschedule = async (meetingId: string) => {
    try {
      const response = await fetch(API_URLS.approveReschedule(meetingId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        toast.success('Cambio de horario aprobado. El horario ahora está disponible.');
        await fetchMyMeetings();
        await fetchLeaderTimeSlots();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al aprobar cambio');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al aprobar cambio');
    }
  };

  const handleRejectReschedule = async (meetingId: string) => {
    try {
      const response = await fetch(API_URLS.rejectReschedule(meetingId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        toast.success('Solicitud de cambio rechazada');
        await fetchMyMeetings();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Error al rechazar solicitud');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error al rechazar solicitud');
    }
  };

  const getDayLabel = (day: string) => {
    return DAYS_OF_WEEK.find(d => d.value === day)?.label || day;
  };

  const calculateEndTime = (startTime: string): string => {
    if (!startTime) return '';
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + 1) % 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleStartTimeChange = (newStartTime: string) => {
    setStartTime(newStartTime);
    if (newStartTime) {
      const calculatedEndTime = calculateEndTime(newStartTime);
      setEndTime(calculatedEndTime);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#fdfcfe] dark:bg-[#242424] rounded-[16px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p className="text-[#5a6c6d] dark:text-[#a3a3a3]">Cargando...</p>
      </div>
    );
  }

  const confirmedMeetings = meetings.filter(m => m.status === 'confirmed');
  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const cancelledMeetings = meetings.filter(m => m.status === 'cancelled');
  const availableSlots = timeSlots.filter(s => s.is_available);

  // MeetingCard Component
  const MeetingCard = ({ meeting }: { meeting: Meeting }) => (
    <div className="bg-[#fdfcfe] dark:bg-[#1a1a1a] rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333]" data-name="MeetingCard">
      <div className="box-border flex flex-col items-start overflow-clip pb-[0.909px] pt-[16.903px] px-[16.903px] relative rounded-[inherit]">
        {meeting.reschedule_requested && (
          <div className="w-full mb-4 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm mb-1 text-orange-900 dark:text-orange-100">Solicitud de cambio de horario</h5>
                <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                  <strong>Motivo:</strong> {meeting.reschedule_reason}
                </p>
                {userRole === 'disciple' && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveReschedule(meeting.id)} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Aprobar cambio
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectReschedule(meeting.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                )}
                {userRole === 'leader' && (
                  <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Esperando respuesta del discípulo...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between relative shrink-0 w-full">
          <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
            <div className="flex gap-[11.996px] items-start relative w-full">
              {/* Icon Container */}
              <div className="bg-gray-100 dark:bg-[#2a2a2a] relative rounded-[12px] shrink-0 size-[40px]">
                <div className="flex items-center justify-center relative size-[40px]">
                  <svg className="block size-[20px]" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <g clipPath="url(#clip0_meeting)" id="Icon">
                      <path d={svgPaths.p14d24500} stroke="currentColor" className="text-[#4A5565] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M12.5 7.5L7.5 12.5" stroke="currentColor" className="text-[#4A5565] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                      <path d="M7.5 7.5L12.5 12.5" stroke="currentColor" className="text-[#4A5565] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                    </g>
                    <defs>
                      <clipPath id="clip0_meeting">
                        <rect fill="white" height="20" width="20" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Contenido */}
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                <div className="flex flex-col gap-[3.999px] items-start relative w-full">
                  <div className="h-[23.999px] relative shrink-0 w-full">
                    <p className="font-['Inter'] font-normal leading-[24px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                      {userRole === 'leader' ? meeting.disciple_name : meeting.leader_name}
                    </p>
                  </div>

                  <div className="flex gap-[7.997px] items-center relative shrink-0 w-full">
                    <svg className="block size-[13.999px]" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                      <g clipPath="url(#clip0_calendar)" id="Icon">
                        <path d="M4.66619 1.16655V3.49964" stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                        <path d="M9.33239 1.16655V3.49964" stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                        <path d={svgPaths.p3c05b400} stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                        <path d="M1.74982 5.83274H12.2488" stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                      </g>
                      <defs>
                        <clipPath id="clip0_calendar">
                          <rect fill="white" height="13.9986" width="13.9986" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="font-['Inter'] font-normal leading-[20px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[14px] tracking-[-0.1504px]">
                      {meeting.date}
                    </p>
                  </div>

                  <div className="flex gap-[7.997px] items-center relative shrink-0 w-full">
                    <svg className="block size-[13.999px]" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                      <g clipPath="url(#clip0_clock)" id="Icon">
                        <path d={svgPaths.p1fb1e8c0} stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                        <path d={svgPaths.p1839c080} stroke="currentColor" className="text-[#5A6C6D] dark:text-[#a3a3a3]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16655" />
                      </g>
                      <defs>
                        <clipPath id="clip0_clock">
                          <rect fill="white" height="13.9986" width="13.9986" />
                        </clipPath>
                      </defs>
                    </svg>
                    <p className="font-['Inter'] font-normal leading-[20px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[14px] tracking-[-0.1504px]">
                      {meeting.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-gray-100 dark:bg-[#2a2a2a] h-[21.811px] relative rounded-[10px] shrink-0" data-name="Badge">
            <div className="h-[21.811px] overflow-clip relative rounded-[inherit] px-3 py-1">
              <div className="absolute bg-[#6a7282] dark:bg-[#8a92a2] left-[8.91px] rounded-full size-[5.994px] top-[7.91px]" />
              <p className="font-['Inter'] font-medium leading-[16px] text-[#364153] dark:text-[#a3a3a3] text-[12px] ml-4">
                {meeting.status === 'confirmed' ? 'Confirmada' :
                 meeting.status === 'pending' ? 'Pendiente' : 'Cancelada'}
              </p>
            </div>
            <div aria-hidden="true" className="absolute border-[0.909px] border-gray-200 inset-0 pointer-events-none rounded-[10px]" />
          </div>
        </div>

        {/* Actions */}
        {meeting.status === 'pending' && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#e5dfe8] dark:border-[#333333] w-full">
            {userRole === 'leader' ? (
              <>
                <Button size="sm" onClick={() => handleConfirmMeeting(meeting.id)} className="bg-[#7eb3d5] hover:bg-[#7eb3d5]/90">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleCancelMeeting(meeting.id)} className="border-[#e5dfe8] dark:border-[#333333]">
                  <XCircle className="w-4 h-4 mr-2" />
                  Rechazar
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={() => handleCancelMeeting(meeting.id)} className="border-[#e5dfe8] dark:border-[#333333]">
                <XCircle className="w-4 h-4 mr-2" />
                Cancelar solicitud
              </Button>
            )}
          </div>
        )}

        {meeting.status === 'confirmed' && !meeting.reschedule_requested && (
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#e5dfe8] dark:border-[#333333] w-full">
            {userRole === 'leader' && (
              <Button size="sm" variant="outline" onClick={() => handleRequestReschedule(meeting)} className="border-[#e5dfe8] dark:border-[#333333]">
                <RefreshCw className="w-4 h-4 mr-2" />
                Solicitar cambio
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => handleCancelConfirmedMeeting(meeting.id)} className="border-[#e5dfe8] dark:border-[#333333] hover:bg-destructive/10 hover:text-destructive">
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar reunión
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-auto relative shrink-0 w-full" data-name="MeetingScheduler">
      <div className="flex flex-col gap-[23.999px] items-start relative w-full">
        
        {/* ========== MÓDULO 1: CONFIGURACIÓN DE HORARIOS (Solo Líderes) ========== */}
        {userRole === 'leader' && (
          <div className="bg-[#fdfcfe] dark:bg-[#242424] box-border flex flex-col gap-[23.999px] items-start p-[0.909px] relative rounded-[16px] shrink-0 w-full" data-name="HorariosDisponiblesModule">
            <div aria-hidden="true" className="absolute border-[#e5dfe8] dark:border-[#333333] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
            
            {/* CardHeader */}
            <div className="h-[69.993px] relative shrink-0 w-full px-6 pt-6" data-name="CardHeader">
              <div className="h-[16.001px] mb-4">
                <p className="font-['Inter'] font-medium leading-[16px] text-[#2d3748] dark:text-[#e5e5e5] text-[16px] tracking-[-0.3125px]">
                  Mis Horarios Disponibles
                </p>
              </div>
              <div className="h-[23.999px]">
                <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                  Configura tus horarios para que tus discípulos puedan agendar reuniones contigo
                </p>
              </div>
            </div>

            {/* CardContent */}
            <div className="relative shrink-0 w-full px-6 pb-6" data-name="CardContent">
              <div className="flex flex-col gap-[23.999px] items-start">
                {/* Form para agregar horarios */}
                <div className="h-[143.615px] relative rounded-[12px] shrink-0 w-full" data-name="AddScheduleForm">
                  <div aria-hidden="true" className="absolute border-[0.909px] border-[rgba(126,179,213,0.2)] border-solid inset-0 pointer-events-none rounded-[12px]" />
                  <div className="box-border flex flex-col gap-[7.997px] items-start pb-[0.909px] pt-[16.903px] px-[16.903px] relative w-full">
                    {/* Header */}
                    <div className="flex gap-[7.997px] items-center relative shrink-0 w-full">
                      <div className="bg-[rgba(126,179,213,0.1)] dark:bg-[rgba(126,179,213,0.2)] relative rounded-full shrink-0 size-[31.996px]">
                        <div className="flex items-center justify-center relative size-[31.996px]">
                          <svg className="block size-[15.994px] text-[#7EB3D5] dark:text-[#8ec5e6]" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <g clipPath="url(#clip0_clock_icon)" id="Icon">
                              <path d={svgPaths.pc8bf600} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                              <path d={svgPaths.p1c2ab400} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                            </g>
                            <defs>
                              <clipPath id="clip0_clock_icon">
                                <rect fill="white" height="15.9943" width="15.9943" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                      </div>
                      <div className="relative shrink-0">
                        <p className="font-['Inter'] font-normal leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                          Agregar nuevo horario
                        </p>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="h-[69.815px] relative shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="relative">
                        <div className="box-border flex items-start pl-[4px] mb-2">
                          <p className="font-['Inter'] font-normal leading-[16px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[12px]">
                            Día de la semana
                          </p>
                        </div>
                        <select
                          value={selectedDay}
                          onChange={(e) => setSelectedDay(e.target.value)}
                          className="bg-[#fdfcfb] dark:bg-[#1a1a1a] dark:text-[#e5e5e5] h-[42.273px] w-full rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3"
                        >
                          <option value="">Seleccionar día</option>
                          {DAYS_OF_WEEK.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="relative">
                        <div className="box-border flex items-start pl-[4px] mb-2">
                          <p className="font-['Inter'] font-normal leading-[16px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[12px]">
                            Hora de inicio
                          </p>
                        </div>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => handleStartTimeChange(e.target.value)}
                          className="bg-[#fdfcfb] dark:bg-[#1a1a1a] dark:text-[#e5e5e5] h-[45.817px] w-full rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3"
                        />
                      </div>

                      <div className="relative">
                        <div className="box-border flex items-start pl-[4px] mb-2">
                          <p className="font-['Inter'] font-normal leading-[16px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[12px]">
                            Hora de fin
                          </p>
                        </div>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-[#fdfcfb] dark:bg-[#1a1a1a] dark:text-[#e5e5e5] h-[45.817px] w-full rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] px-3"
                        />
                      </div>

                      <div className="relative">
                        <div className="box-border flex items-start pl-[4px] mb-2">
                          <p className="font-['Inter'] font-normal leading-[16px] text-[rgba(0,0,0,0)] text-[12px]">
                            Acción
                          </p>
                        </div>
                        <Button
                          onClick={handleAddTimeSlot}
                          disabled={isAddingSlot}
                          className="bg-[#7eb3d5] h-[35.994px] w-full rounded-[10px] hover:bg-[#7eb3d5]/90"
                        >
                          {isAddingSlot ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Agregando...
                            </>
                          ) : (
                            <>
                              <svg className="block size-[15.994px] mr-2" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                                <g clipPath="url(#clip0_check)" id="Icon">
                                  <path d={svgPaths.p2e209400} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                  <path d={svgPaths.p19a80c80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                                </g>
                                <defs>
                                  <clipPath id="clip0_check">
                                    <rect fill="white" height="15.9943" width="15.9943" />
                                  </clipPath>
                                </defs>
                              </svg>
                              Agregar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista de horarios configurados */}
                {timeSlots.length === 0 ? (
                  <div className="bg-[#fdfcfe] dark:bg-[#1a1a1a] h-[85.81px] relative rounded-[12px] shrink-0 w-full" data-name="Alert">
                    <div aria-hidden="true" className="absolute border-[#e5dfe8] dark:border-[#333333] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[12px]" />
                    <div className="absolute left-[16.63px] size-[15.994px] top-[14.8px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g clipPath="url(#clip0_alert)" id="Icon">
                          <path d={svgPaths.p1ffb2e00} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                          <path d={svgPaths.p2e209400} stroke="currentColor" className="text-[#2D3748] dark:text-[#e5e5e5]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33286" />
                        </g>
                        <defs>
                          <clipPath id="clip0_alert">
                            <rect fill="white" height="15.9943" width="15.9943" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <div className="absolute h-[60px] left-[52.62px] top-[12.8px]">
                      <p className="font-['Inter'] font-normal leading-[26px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px]">
                        No tienes horarios configurados
                      </p>
                      <p className="font-['Inter'] font-normal leading-[26px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[16px] tracking-[-0.3125px] mt-2">
                        Agrega horarios disponibles para que tus discípulos puedan agendar reuniones contigo.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-3 w-full">
                    {timeSlots.map(slot => (
                      <div key={slot.id} className="group bg-[#fdfcfe] dark:bg-[#1a1a1a] rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] p-4 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              slot.is_available ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'
                            }`}>
                              <Calendar className={`w-5 h-5 ${
                                slot.is_available ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[#2d3748] dark:text-[#e5e5e5]">{getDayLabel(slot.day)}</h4>
                                <div className={`px-2 py-1 rounded text-xs ${
                                  slot.is_available 
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700' 
                                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700'
                                }`}>
                                  {slot.is_available ? 'Disponible' : 'Ocupado'}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[#5a6c6d] dark:text-[#a3a3a3] text-sm">
                                <Clock className="w-3.5 h-3.5 text-[#5a6c6d] dark:text-[#a3a3a3]" />
                                <span>{slot.start_time} - {slot.end_time}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTimeSlot(slot.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========== MÓDULO 2: REUNIONES CON DISCÍPULOS ========== */}
        <div className="bg-[#fdfcfe] dark:bg-[#242424] relative rounded-[16px] shrink-0 w-full" data-name="ReunionesModule">
          <div aria-hidden="true" className="absolute border-[#e5dfe8] dark:border-[#333333] border-[0.909px] border-solid inset-0 pointer-events-none rounded-[16px]" />
          <div className="box-border flex flex-col gap-[29.993px] items-start py-[24.908px] relative w-full pt-[24px] pr-[24px] pb-[0px] pl-[24px]">
            {/* Header */}
            <div className="relative shrink-0" data-name="Header">
              <div className="flex gap-[11.996px] items-center relative">
                <div className="bg-[rgba(126,179,213,0.1)] relative rounded-[12px] shrink-0 size-[40px]">
                  <div className="flex items-center justify-center relative size-[40px]">
                    <Users className="size-[20px] text-[#7EB3D5]" />
                  </div>
                </div>
                <div className="relative">
                  <div className="mb-1">
                    <p className="font-['Inter'] font-medium leading-[16px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.3125px]">
                      {userRole === 'leader' ? 'Reuniones con Discípulos' : 'Horarios disponibles'}
                    </p>
                  </div>
                  <div>
                    <p className="font-['Inter'] font-normal leading-[24px] text-[#5a6c6d] dark:text-[#a3a3a3] text-[14px] tracking-[-0.3125px]">
                      {userRole === 'leader' ? 'Gestiona las reuniones con tus discípulos' : 'Coordiná tus reuniones'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-[#e8f5f1] dark:bg-[#2a2a2a] h-[36px] rounded-[16px] w-full grid grid-cols-2 p-0" data-name="TabList">
                {userRole === 'leader' ? (
                  <>
                    <TabsTrigger 
                      value="confirmados" 
                      className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                    >
                      <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                        Confirmadas ({confirmedMeetings.length})
                      </p>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pendientes" 
                      className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                    >
                      <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                        A confirmar ({pendingMeetings.length})
                      </p>
                    </TabsTrigger>
                  </>
                ) : (
                  <>
                    <TabsTrigger 
                      value="disponibles" 
                      className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                    >
                      <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                        Disponibles ({availableSlots.length})
                      </p>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="misreuniones" 
                      className="rounded-[16px] data-[state=active]:bg-white dark:data-[state=active]:bg-[#1a1a1a] h-[28.999px] mx-[2.98px]"
                    >
                      <p className="font-['Inter'] font-medium leading-[20px] text-[#2d3748] dark:text-[#e5e5e5] text-[14px] tracking-[-0.1504px]">
                        Mis reuniones ({confirmedMeetings.length})
                      </p>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              {/* Tab Content */}
              <div className="mt-6">
                {userRole === 'leader' ? (
                  <>
                    <TabsContent value="confirmados" className="space-y-3 mt-0">
                      {confirmedMeetings.length === 0 ? (
                        <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                          <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                            No hay reuniones confirmadas
                          </AlertDescription>
                        </Alert>
                      ) : (
                        confirmedMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
                      )}
                    </TabsContent>

                    <TabsContent value="pendientes" className="space-y-3 mt-0">
                      {pendingMeetings.length === 0 ? (
                        <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                          <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                            No hay reuniones pendientes
                          </AlertDescription>
                        </Alert>
                      ) : (
                        pendingMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
                      )}
                    </TabsContent>
                  </>
                ) : (
                  <>
                    <TabsContent value="disponibles" className="space-y-3 mt-0">
                      {availableSlots.length === 0 ? (
                        <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                          <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                            Tu líder no tiene horarios disponibles en este momento
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <div className="grid gap-3 w-full">
                          {availableSlots.map(slot => (
                            <div key={slot.id} className="bg-[#fdfcfe] dark:bg-[#1a1a1a] rounded-[12px] border-[0.909px] border-[#e5dfe8] dark:border-[#333333] p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100 dark:bg-green-900/30">
                                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="text-[#2d3748] dark:text-[#e5e5e5]">{getDayLabel(slot.day)}</h4>
                                      <div className="px-2 py-1 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-700">
                                        Disponible
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[#5a6c6d] dark:text-[#a3a3a3] text-sm">
                                      <Clock className="w-3.5 h-3.5 text-[#5a6c6d] dark:text-[#a3a3a3]" />
                                      <span>{slot.start_time} - {slot.end_time}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleRequestMeeting(slot.id)}
                                  className="bg-[#7eb3d5] hover:bg-[#7eb3d5]/90"
                                >
                                  Solicitar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="misreuniones" className="space-y-3 mt-0">
                      {confirmedMeetings.length === 0 ? (
                        <Alert className="border-[#e5dfe8] dark:border-[#333333] dark:bg-[#1a1a1a]">
                          <AlertDescription className="text-[#5a6c6d] dark:text-[#a3a3a3]">
                            No tienes reuniones confirmadas
                          </AlertDescription>
                        </Alert>
                      ) : (
                        confirmedMeetings.map(meeting => <MeetingCard key={meeting.id} meeting={meeting} />)
                      )}
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>

            {/* Reuniones Canceladas - fuera de tabs */}
            {cancelledMeetings.length > 0 && (
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="CancelledSection">
                {/* Reuniones canceladas ocultas por solicitud del usuario */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar cambio de horario</DialogTitle>
            <DialogDescription>
              Explica por qué necesitas cambiar el horario de esta reunión. Tu discípulo deberá aprobar el cambio.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedMeeting && (
              <div className="mb-4 p-3 rounded-md bg-muted">
                <p className="text-muted-foreground">
                  Reunión actual: {selectedMeeting.date} a las {selectedMeeting.time}
                </p>
              </div>
            )}
            <Textarea
              placeholder="Escribe el motivo del cambio de horario..."
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReschedule} className="bg-[#7eb3d5] hover:bg-[#7eb3d5]/90">
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
