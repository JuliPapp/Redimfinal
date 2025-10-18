import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/time-slots`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/leader-time-slots/${leaderId}`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings`,
        {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/time-slots`,
        {
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
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/time-slots/${slotId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/request-meeting`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            time_slot_id: slotId,
            leader_id: leaderId
          })
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${meetingId}/confirm`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${meetingId}/cancel`,
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
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${meetingId}/cancel-confirmed`,
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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${selectedMeeting.id}/request-reschedule`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ reason: rescheduleReason })
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${meetingId}/approve-reschedule`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-636f4a29/meetings/${meetingId}/reject-reschedule`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        }
      );

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Leader: Manage Time Slots */}
      {userRole === 'leader' && (
        <Card>
          <CardHeader>
            <CardTitle>Mis Horarios Disponibles</CardTitle>
            <CardDescription>
              Configura tus horarios para que tus discípulos puedan agendar reuniones contigo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Time Slot Form */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h4 className="text-sm">Agregar nuevo horario</h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground pl-1">Día de la semana</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Seleccionar día</option>
                    {DAYS_OF_WEEK.map(day => (
                      <option key={day.value} value={day.value}>{day.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground pl-1">Hora de inicio</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground pl-1">Hora de fin</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs text-transparent pl-1 select-none">Acción</label>
                  <Button 
                    onClick={handleAddTimeSlot} 
                    disabled={isAddingSlot}
                    className="w-full"
                  >
                    {isAddingSlot ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Agregar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Time Slots List */}
            {timeSlots.length === 0 ? (
              <Alert className="border-dashed">
                <Clock className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  <p className="mb-1">No tienes horarios configurados</p>
                  <p className="text-muted-foreground">
                    Agrega horarios disponibles para que tus discípulos puedan agendar reuniones contigo.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-muted-foreground">
                    {timeSlots.length} horario{timeSlots.length !== 1 ? 's' : ''} configurado{timeSlots.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid gap-3">
                  {timeSlots.map(slot => (
                    <div 
                      key={slot.id} 
                      className="group relative overflow-hidden rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            slot.is_available 
                              ? 'bg-green-100 dark:bg-green-950/30' 
                              : 'bg-orange-100 dark:bg-orange-950/30'
                          }`}>
                            <Calendar className={`w-5 h-5 ${
                              slot.is_available 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-orange-600 dark:text-orange-400'
                            }`} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="truncate">{getDayLabel(slot.day)}</h4>
                              <Badge 
                                variant={slot.is_available ? 'secondary' : 'outline'}
                                className={slot.is_available 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 border-orange-200 dark:border-orange-800'
                                }
                              >
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                  slot.is_available ? 'bg-green-500' : 'bg-orange-500'
                                }`} />
                                {slot.is_available ? 'Disponible' : 'Ocupado'}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <p className="text-sm">
                                {slot.start_time} - {slot.end_time}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTimeSlot(slot.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                          title="Eliminar horario"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Disciple: View Leader's Available Time Slots */}
      {userRole === 'disciple' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Agendar Reunión con tu Líder</CardTitle>
                <CardDescription>
                  Selecciona un horario disponible para agendar una reunión
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {timeSlots.filter(s => s.is_available).length === 0 ? (
              <Alert className="border-dashed">
                <Clock className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  <p className="mb-1">No hay horarios disponibles</p>
                  <p className="text-muted-foreground">
                    Tu líder aún no ha configurado horarios o todos están ocupados. Intenta más tarde.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <p className="text-sm text-muted-foreground">
                    {timeSlots.filter(s => s.is_available).length} horario{timeSlots.filter(s => s.is_available).length !== 1 ? 's' : ''} disponible{timeSlots.filter(s => s.is_available).length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid gap-3">
                  {timeSlots.filter(s => s.is_available).map(slot => (
                    <div 
                      key={slot.id} 
                      className="group relative overflow-hidden rounded-lg border border-border bg-gradient-to-r from-card to-primary/5 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="truncate">{getDayLabel(slot.day)}</h4>
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                Disponible
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <p className="text-sm">
                                {slot.start_time} - {slot.end_time}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleRequestMeeting(slot.id)}
                          className="ml-2"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Solicitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Meetings List */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>
                {userRole === 'leader' ? 'Solicitudes de Reunión' : 'Mis Reuniones'}
              </CardTitle>
              <CardDescription>
                {userRole === 'leader' 
                  ? 'Reuniones solicitadas por tus discípulos'
                  : 'Reuniones agendadas con tu líder'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <Alert className="border-dashed">
              <Video className="h-5 w-5" />
              <AlertDescription className="ml-2">
                <p className="mb-1">No hay reuniones {userRole === 'leader' ? 'solicitadas' : 'agendadas'}</p>
                <p className="text-muted-foreground">
                  {userRole === 'leader' 
                    ? 'Cuando tus discípulos soliciten reuniones, aparecerán aquí.'
                    : 'Cuando agendes una reunión con tu líder, aparecerá aquí.'}
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm text-muted-foreground">
                  {meetings.length} reunión{meetings.length !== 1 ? 'es' : ''}
                </p>
              </div>
              <div className="grid gap-4">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-200">
                    {/* Reschedule Alert */}
                    {meeting.reschedule_requested && (
                      <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-900">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm mb-1 text-orange-900 dark:text-orange-100">Solicitud de cambio de horario</h5>
                            <p className="text-sm text-orange-800 dark:text-orange-200 mb-3">
                              <strong>Motivo:</strong> {meeting.reschedule_reason}
                            </p>
                            {userRole === 'disciple' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReschedule(meeting.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Aprobar cambio
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectReschedule(meeting.id)}
                                  className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:text-orange-300"
                                >
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

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            meeting.status === 'confirmed' 
                              ? 'bg-blue-100 dark:bg-blue-950/30' 
                              : meeting.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-950/30'
                              : 'bg-gray-100 dark:bg-gray-950/30'
                          }`}>
                            {meeting.status === 'confirmed' ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            ) : meeting.status === 'pending' ? (
                              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="mb-1">
                              {userRole === 'leader' ? meeting.disciple_name : meeting.leader_name}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-3.5 h-3.5" />
                              <p className="text-sm">
                                {meeting.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <Clock className="w-3.5 h-3.5" />
                              <p className="text-sm">
                                {meeting.time}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={
                            meeting.status === 'confirmed' ? 'default' :
                            meeting.status === 'pending' ? 'secondary' :
                            'outline'
                          }
                          className={
                            meeting.status === 'confirmed' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                              : meeting.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400 border-gray-200 dark:border-gray-800'
                          }
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            meeting.status === 'confirmed' ? 'bg-blue-500' :
                            meeting.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                            'bg-gray-500'
                          }`} />
                          {meeting.status === 'confirmed' ? 'Confirmada' :
                           meeting.status === 'pending' ? 'Pendiente' :
                           'Cancelada'}
                        </Badge>
                      </div>
                  
                      {/* Pending meeting actions */}
                      {meeting.status === 'pending' && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                          {userRole === 'leader' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleConfirmMeeting(meeting.id)}
                                className="flex-1 sm:flex-none"
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Confirmar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelMeeting(meeting.id)}
                                className="flex-1 sm:flex-none"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rechazar
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelMeeting(meeting.id)}
                              className="w-full sm:w-auto"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Cancelar solicitud
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Confirmed meeting actions */}
                      {meeting.status === 'confirmed' && !meeting.reschedule_requested && (
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                          {userRole === 'leader' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRequestReschedule(meeting)}
                              className="flex-1 sm:flex-none"
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Solicitar cambio
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelConfirmedMeeting(meeting.id)}
                            className="flex-1 sm:flex-none hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancelar reunión
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reschedule Dialog */}
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
            <Button onClick={handleSubmitReschedule}>
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
