import { useState, useEffect } from 'react';
import type { DateRange } from 'react-day-picker@8.10.1';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar as CalendarComponent } from './ui/calendar';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  Video,
  Plus,
  CalendarDays,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';

type TimeSlot = {
  id: string;
  date: string; // YYYY-MM-DD format
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
  onBack?: () => void;
};

export function ImprovedMeetingScheduler({ userRole, leaderId, accessToken, projectId, onBack }: Props) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quick add form - Date-based
  const [selectedDatesForSlots, setSelectedDatesForSlots] = useState<Date[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [startHour, setStartHour] = useState<string>('09:00');
  const [slotCount, setSlotCount] = useState<number>(1);
  const [isAdding, setIsAdding] = useState(false);
  const [calendarMode, setCalendarMode] = useState<'view' | 'individual' | 'range'>('view');
  
  // Debug: Verificar valores iniciales
  useEffect(() => {
    console.log('🔧 Valores iniciales del componente:');
    console.log('  - startHour:', startHour, '(tipo:', typeof startHour, ')');
    console.log('  - slotCount:', slotCount, '(tipo:', typeof slotCount, ')');
  }, []);

  // Reschedule dialog state
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState('');

  // Calendar view (for viewing meetings)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Debug: Monitor selectedDatesForSlots changes
  useEffect(() => {
    if (selectedDatesForSlots.length > 0) {
      console.log('📅 Fechas seleccionadas:', selectedDatesForSlots.map(d => d.toLocaleDateString()));
    }
  }, [selectedDatesForSlots]);

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

  const generateTimeSlots = (startTime: string, count: number): Array<{ start: string; end: string }> => {
    console.log('⚙️ generateTimeSlots llamada con:', { startTime, count });
    
    if (!startTime || typeof startTime !== 'string') {
      console.error('❌ generateTimeSlots: startTime inválido:', startTime);
      return [];
    }
    
    const slots = [];
    const parts = startTime.split(':');
    
    if (parts.length !== 2) {
      console.error('❌ generateTimeSlots: formato de startTime inválido:', startTime);
      return [];
    }
    
    const [hours, minutes] = parts.map(Number);
    
    if (isNaN(hours) || isNaN(minutes)) {
      console.error('❌ generateTimeSlots: horas o minutos no son números:', { hours, minutes });
      return [];
    }
    
    console.log('⚙️ Hora inicial parseada:', { hours, minutes });
    
    for (let i = 0; i < count; i++) {
      const startHour = hours + i;
      const endHour = startHour + 1;
      
      if (startHour >= 24 || endHour > 24) {
        console.log('⚠️ Hora fuera de rango, deteniendo:', { startHour, endHour });
        break;
      }
      
      const start = `${String(startHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const end = `${String(endHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      console.log(`⚙️ Slot ${i + 1} generado:`, { start, end });
      slots.push({ start, end });
    }
    
    console.log('⚙️ Total de slots generados:', slots.length);
    return slots;
  };

  const formatDateToYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const getDatesToProcess = (): Date[] => {
    if (calendarMode === 'range' && dateRange?.from) {
      if (dateRange.to) {
        return getDatesInRange(dateRange.from, dateRange.to);
      } else {
        return [dateRange.from];
      }
    } else if (calendarMode === 'individual') {
      return selectedDatesForSlots;
    }
    return [];
  };

  const handleQuickAdd = async () => {
    const datesToProcess = getDatesToProcess();
    
    console.log('🚀 Iniciando creación de horarios:');
    console.log('  - Modo:', calendarMode);
    console.log('  - Fechas a procesar:', datesToProcess.length);
    console.log('  - Horarios por fecha:', slotCount);
    console.log('  - Total a crear:', datesToProcess.length * slotCount);
    
    if (datesToProcess.length === 0) {
      toast.error('Selecciona al menos una fecha');
      return;
    }

    if (slotCount < 1) {
      toast.error('Selecciona al menos 1 reunión');
      return;
    }
    
    // Validar y normalizar startHour
    let normalizedStartHour = startHour;
    if (!normalizedStartHour || normalizedStartHour.trim() === '') {
      console.warn('⚠️ startHour vacío, usando valor por defecto');
      normalizedStartHour = '09:00';
      setStartHour(normalizedStartHour);
    }
    
    // Verificar formato HH:MM
    if (!/^\d{2}:\d{2}$/.test(normalizedStartHour)) {
      toast.error('Formato de hora inválido. Use HH:MM (ej: 09:00)');
      return;
    }

    setIsAdding(true);
    
    console.log('🔧 Parámetros después de normalización:');
    console.log('  - startHour original:', startHour);
    console.log('  - startHour normalizado:', normalizedStartHour, '(tipo:', typeof normalizedStartHour, ', length:', normalizedStartHour.length, ')');
    console.log('  - slotCount:', slotCount, '(tipo:', typeof slotCount, ')');
    
    const timeSlotsList = generateTimeSlots(normalizedStartHour, slotCount);
    console.log('📋 Horarios generados:', timeSlotsList);
    console.log('📋 Cantidad:', timeSlotsList.length);
    if (timeSlotsList.length > 0) {
      console.log('📋 Primer slot:', timeSlotsList[0]);
      console.log('📋 Estructura del primer slot:', {
        start: timeSlotsList[0].start,
        end: timeSlotsList[0].end,
        'typeof start': typeof timeSlotsList[0].start,
        'typeof end': typeof timeSlotsList[0].end
      });
    }
    
    if (timeSlotsList.length === 0) {
      toast.error('No se pudieron generar horarios. Verifica la hora de inicio.');
      setIsAdding(false);
      return;
    }
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const date of datesToProcess) {
      const dateStr = formatDateToYMD(date);
      console.log('🔵 Procesando fecha:', dateStr);
      
      for (const slot of timeSlotsList) {
        try {
          console.log('⏰ Creando slot:', slot);
          console.log('⏰ Valores:', {
            'slot.start': slot.start,
            'slot.end': slot.end,
            'typeof slot.start': typeof slot.start,
            'typeof slot.end': typeof slot.end,
            'slot completo': JSON.stringify(slot)
          });
          
          // Validar que start y end existan y sean strings válidos
          if (!slot || !slot.start || !slot.end || typeof slot.start !== 'string' || typeof slot.end !== 'string') {
            console.error('❌ Slot inválido:', {
              'slot completo': slot,
              'slot.start presente': !!slot?.start,
              'slot.end presente': !!slot?.end,
              'tipo slot.start': typeof slot?.start,
              'tipo slot.end': typeof slot?.end
            });
            errorCount++;
            errors.push(`${dateStr}: Slot inválido generado`);
            continue;
          }
          
          // Validar dateStr
          if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
            console.error('❌ dateStr inválido:', {
              dateStr,
              'tipo': typeof dateStr,
              'date original': date
            });
            errorCount++;
            errors.push(`Fecha inválida: ${date.toLocaleDateString()}`);
            continue;
          }
          
          // Crear payload con valores garantizados
          const payload = {
            date: String(dateStr),
            start_time: String(slot.start),
            end_time: String(slot.end)
          };
          
          console.log('📤 Payload construido:');
          console.log('  - date:', payload.date, '(tipo:', typeof payload.date, ', length:', payload.date.length, ')');
          console.log('  - start_time:', payload.start_time, '(tipo:', typeof payload.start_time, ', length:', payload.start_time.length, ')');
          console.log('  - end_time:', payload.end_time, '(tipo:', typeof payload.end_time, ', length:', payload.end_time.length, ')');
          console.log('📤 Payload completo:', payload);
          console.log('📤 Payload stringified:', JSON.stringify(payload));
          
          // Doble verificación antes de enviar
          if (!payload.date || !payload.start_time || !payload.end_time) {
            console.error('❌ Payload tiene campos vacíos:', payload);
            errorCount++;
            errors.push(`${dateStr}: Payload con campos vacíos`);
            continue;
          }
          
          if (payload.date.trim() === '' || payload.start_time.trim() === '' || payload.end_time.trim() === '') {
            console.error('❌ Payload tiene campos con strings vacíos:', payload);
            errorCount++;
            errors.push(`${dateStr}: Payload con strings vacíos`);
            continue;
          }
          
          const url = API_URLS.timeSlots();
          console.log('🌐 URL:', url);
          console.log('🔑 Token presente:', !!accessToken);
          
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify(payload)
          });

          console.log('📥 Response status:', response.status);
          console.log('📥 Response ok:', response.ok);
          
          if (response.ok) {
            successCount++;
            console.log('✅ Slot creado exitosamente');
          } else {
            const responseText = await response.text();
            console.log('📥 Response text completo:', responseText);
            
            let error;
            try {
              error = JSON.parse(responseText);
              console.log('📥 Error parseado:', JSON.stringify(error, null, 2));
            } catch (e) {
              console.log('📥 No se pudo parsear el error como JSON');
              error = { error: responseText };
            }
            
            console.error('❌ Error del servidor:', error);
            console.error('❌ Detalles del error:');
            if (error.missing) console.error('  - Campos faltantes:', error.missing);
            if (error.received) console.error('  - Datos recibidos:', error.received);
            if (error.keys) console.error('  - Keys recibidos:', error.keys);
            if (error.values) console.error('  - Valores extraídos:', error.values);
            if (error.types) console.error('  - Tipos:', error.types);
            
            if (error.error?.includes('already exists')) {
              console.log('⚠️ Slot ya existe, ignorando');
              // Skip silently if already exists
            } else {
              errorCount++;
              let errorMsg = '';
              if (error.missing) {
                errorMsg = `Missing: ${error.missing.join(', ')}`;
                if (error.values) {
                  errorMsg += ` (recibidos: ${JSON.stringify(error.values)})`;
                }
              } else {
                errorMsg = error.error || 'Error desconocido';
              }
              errors.push(`${dateStr} ${slot.start}: ${errorMsg}`);
            }
          }
        } catch (err) {
          console.error('💥 Error de red:', err);
          errorCount++;
          errors.push(`${dateStr} ${slot.start || '??'}: Error de conexión`);
        }
      }
    }

    setIsAdding(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} horario(s) agregado(s)`);
      setSelectedDatesForSlots([]);
      setDateRange(undefined);
      setStartHour('09:00');
      setSlotCount(1);
      await fetchMyTimeSlots();
    }
    
    if (errorCount > 0) {
      console.error('❌ Errores encontrados:', errors);
      toast.error(
        <div className="space-y-2">
          <div>{errorCount} horario(s) no pudieron ser agregados</div>
          {errors.length > 0 && (
            <div className="text-xs opacity-80 max-h-32 overflow-y-auto">
              {errors.slice(0, 3).map((err, idx) => (
                <div key={idx}>• {err}</div>
              ))}
              {errors.length > 3 && <div>... y {errors.length - 3} más</div>}
            </div>
          )}
        </div>
      );
    }
    
    if (successCount === 0 && errorCount === 0) {
      toast.info('Todos los horarios ya existen para las fechas seleccionadas');
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
      const response = await fetch(API_URLS.cancelConfirmedMeeting(meetingId), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

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

  const getTimeSlotsForDate = (date: Date) => {
    const dateStr = formatDateToYMD(date);
    return timeSlots.filter(slot => slot.date === dateStr);
  };
  
  const getTimeSlotsGroupedByDate = () => {
    const grouped: Record<string, TimeSlot[]> = {};
    
    timeSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    
    // Sort by date
    const sortedDates = Object.keys(grouped).sort();
    const result: Record<string, TimeSlot[]> = {};
    sortedDates.forEach(date => {
      result[date] = grouped[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
    });
    
    return result;
  };

  const getMeetingsForDate = (date: Date) => {
    const dateString = formatDateToYMD(date);
    return meetings.filter(meeting => {
      // Parse date in format YYYY-MM-DD or DD/MM/YYYY
      let meetingDate = meeting.date;
      if (meetingDate.includes('/')) {
        const [day, month, year] = meetingDate.split('/');
        meetingDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return meetingDate === dateString && meeting.status === 'confirmed';
    });
  };

  const getConfirmedMeetingDates = () => {
    return meetings
      .filter(m => m.status === 'confirmed')
      .map(m => {
        let dateString = m.date;
        // Convert DD/MM/YYYY to YYYY-MM-DD if needed
        if (dateString.includes('/')) {
          const [day, month, year] = dateString.split('/');
          dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return new Date(dateString + 'T00:00:00');
      });
  };

  const getDatesWithSlots = () => {
    const uniqueDates = [...new Set(timeSlots.map(slot => slot.date))];
    return uniqueDates.map(dateStr => new Date(dateStr + 'T00:00:00'));
  };

  const toggleDate = (date: Date) => {
    const dateStr = formatDateToYMD(date);
    setSelectedDatesForSlots(prev => {
      const exists = prev.some(d => formatDateToYMD(d) === dateStr);
      if (exists) {
        return prev.filter(d => formatDateToYMD(d) !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDateToYMD(date);
    return selectedDatesForSlots.some(d => formatDateToYMD(d) === dateStr);
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
      {/* Header with back button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      )}

      {/* Main Title */}
      <div>
        <h2 className="mb-2">
          {userRole === 'leader' ? 'Gestión de Reuniones' : 'Agendar Reunión'}
        </h2>
        <p className="text-muted-foreground">
          {userRole === 'leader' 
            ? 'Configura tus horarios y gestiona reuniones con tus discípulos'
            : 'Visualiza horarios disponibles y agenda reuniones con tu líder'}
        </p>
        
        {/* DEBUG: Test button */}
        {userRole === 'leader' && (
          <div className="mt-2 flex gap-2">
            <Button
              onClick={async () => {
                console.log('\n\n🧪 ========== TEST DIRECTO INICIADO ==========');
                const now = new Date();
                const testDate = formatDateToYMD(now);
                const testPayload = {
                  date: testDate,
                  start_time: '09:00',
                  end_time: '10:00'
                };
                console.log('🧪 Fecha actual:', now);
                console.log('🧪 Fecha formateada:', testDate);
                console.log('🧪 Payload original:', testPayload);
                console.log('🧪 Cada campo del payload:');
                console.log('  - date:', testPayload.date, '(tipo:', typeof testPayload.date, ')');
                console.log('  - start_time:', testPayload.start_time, '(tipo:', typeof testPayload.start_time, ')');
                console.log('  - end_time:', testPayload.end_time, '(tipo:', typeof testPayload.end_time, ')');
                
                const stringified = JSON.stringify(testPayload);
                console.log('🧪 Payload stringified:', stringified);
                console.log('🧪 Stringified length:', stringified.length);
                console.log('🧪 Stringified bytes:', new TextEncoder().encode(stringified).length);
                
                const reparsed = JSON.parse(stringified);
                console.log('🧪 Payload re-parsed:', reparsed);
                console.log('🧪 Cada campo del reparsed:');
                console.log('  - date:', reparsed.date, '(tipo:', typeof reparsed.date, ')');
                console.log('  - start_time:', reparsed.start_time, '(tipo:', typeof reparsed.start_time, ')');
                console.log('  - end_time:', reparsed.end_time, '(tipo:', typeof reparsed.end_time, ')');
                
                console.log('🧪 URL completa:', API_URLS.timeSlots());
                console.log('🧪 Token:', accessToken ? `Present (${accessToken.substring(0, 20)}...)` : 'Missing');
                console.log('🧪 projectId:', projectId);
                
                try {
                  const url = API_URLS.timeSlots();
                  console.log('🧪 Haciendo fetch a:', url);
                  
                  const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                  };
                  console.log('🧪 Headers:', headers);
                  console.log('🧪 Header Content-Type:', headers['Content-Type']);
                  console.log('🧪 Header Authorization presente:', !!headers['Authorization']);
                  
                  const bodyStr = JSON.stringify(testPayload);
                  console.log('🧪 Body que se enviará:', bodyStr);
                  console.log('🧪 Body length:', bodyStr.length);
                  console.log('🧪 Body type:', typeof bodyStr);
                  
                  console.log('🧪 Iniciando fetch...');
                  const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: bodyStr
                  });
                  
                  console.log('🧪 Fetch completado');
                  console.log('🧪 Response status:', response.status);
                  console.log('🧪 Response statusText:', response.statusText);
                  console.log('🧪 Response ok:', response.ok);
                  console.log('🧪 Response headers:', Object.fromEntries(response.headers.entries()));
                  
                  const responseText = await response.text();
                  console.log('🧪 Response text raw:', responseText);
                  console.log('🧪 Response text length:', responseText.length);
                  
                  let responseJson;
                  try {
                    responseJson = JSON.parse(responseText);
                    console.log('🧪 Response JSON parseado:', responseJson);
                    console.log('🧪 Response JSON stringified:', JSON.stringify(responseJson, null, 2));
                  } catch (e) {
                    console.log('🧪 No se pudo parsear como JSON');
                    console.log('🧪 Error:', e);
                  }
                  
                  console.log('🧪 ========== TEST DIRECTO TERMINADO ==========\n\n');
                  
                  if (response.ok) {
                    toast.success('✅ Test exitoso! Horario creado.');
                    await fetchMyTimeSlots();
                  } else {
                    const errorMsg = responseJson?.error || responseText || 'Error desconocido';
                    const errorDetails = responseJson?.missing ? ` Falta: ${responseJson.missing.join(', ')}` : '';
                    toast.error(`❌ Test falló (${response.status}): ${errorMsg}${errorDetails}`);
                  }
                } catch (err) {
                  console.error('🧪 ========== ERROR EN TEST ==========');
                  console.error('🧪 Error completo:', err);
                  console.error('🧪 Error message:', err instanceof Error ? err.message : String(err));
                  console.error('🧪 Error stack:', err instanceof Error ? err.stack : 'No stack');
                  console.error('🧪 Error name:', err instanceof Error ? err.name : 'Unknown');
                  console.error('🧪 Error constructor:', err instanceof Error ? err.constructor.name : typeof err);
                  console.error('🧪 ========== FIN ERROR ==========\n\n');
                  toast.error('❌ Test error - Ver consola para detalles');
                }
              }}
              variant="outline"
              size="sm"
            >
              🧪 Test Conexión
            </Button>
            
            <Button
              onClick={() => {
                console.log('\n📊 ========== ESTADO ACTUAL ==========');
                console.log('📊 Autenticación:');
                console.log('  - accessToken presente:', !!accessToken);
                console.log('  - accessToken length:', accessToken?.length || 0);
                console.log('  - accessToken preview:', accessToken ? accessToken.substring(0, 30) + '...' : 'N/A');
                console.log('\n📊 Configuración:');
                console.log('  - projectId:', projectId);
                console.log('  - userRole:', userRole);
                console.log('  - leaderId:', leaderId || 'N/A');
                console.log('\n📊 URLs:');
                console.log('  - API_URLS.timeSlots():', API_URLS.timeSlots());
                console.log('  - API_URLS.meetings():', API_URLS.meetings());
                console.log('\n📊 Estado del componente:');
                console.log('  - calendarMode:', calendarMode);
                console.log('  - startHour:', startHour);
                console.log('  - slotCount:', slotCount);
                console.log('  - selectedDatesForSlots:', selectedDatesForSlots.length);
                console.log('  - dateRange:', dateRange);
                console.log('  - timeSlots en memoria:', timeSlots.length);
                console.log('  - meetings en memoria:', meetings.length);
                console.log('  - isLoading:', isLoading);
                console.log('  - isAdding:', isAdding);
                console.log('\n📊 Test de función formatDateToYMD:');
                const testDate = new Date();
                console.log('  - Fecha actual:', testDate);
                console.log('  - Fecha formateada:', formatDateToYMD(testDate));
                console.log('\n📊 Test de función generateTimeSlots:');
                const testSlots = generateTimeSlots('09:00', 3);
                console.log('  - Slots generados:', testSlots);
                console.log('📊 ========== FIN ESTADO ==========\n');
              }}
              variant="outline"
              size="sm"
            >
              📊 Ver Estado
            </Button>
          </div>
        )}
      </div>

      {/* Unified Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5" />
            Calendario {userRole === 'leader' && '& Agregar Horarios'}
          </CardTitle>
          <CardDescription>
            {userRole === 'leader' 
              ? 'Selecciona fechas para agregar horarios o ver reuniones confirmadas'
              : 'Días con reuniones confirmadas en azul'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Leader: Mode Toggle */}
          {userRole === 'leader' && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Label className="text-sm font-medium">Modo:</Label>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="view-mode"
                      checked={calendarMode === 'view'}
                      onChange={() => {
                        setCalendarMode('view');
                        setSelectedDatesForSlots([]);
                        setDateRange(undefined);
                      }}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="view-mode" className="cursor-pointer">
                      Ver reuniones
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="multiple-dates"
                      checked={calendarMode === 'individual'}
                      onChange={() => {
                        setCalendarMode('individual');
                        setDateRange(undefined);
                      }}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="multiple-dates" className="cursor-pointer">
                      Fechas individuales
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="range-dates"
                      checked={calendarMode === 'range'}
                      onChange={() => {
                        setCalendarMode('range');
                        setSelectedDatesForSlots([]);
                      }}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="range-dates" className="cursor-pointer">
                      Rango de fechas
                    </Label>
                  </div>
                </div>
              </div>
              {(selectedDatesForSlots.length > 0 || dateRange) && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {calendarMode === 'range' && dateRange?.from
                      ? dateRange.to 
                        ? `${getDatesInRange(dateRange.from, dateRange.to).length} fechas seleccionadas`
                        : '1 fecha seleccionada'
                      : `${selectedDatesForSlots.length} fecha${selectedDatesForSlots.length !== 1 ? 's' : ''} seleccionada${selectedDatesForSlots.length !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-[auto,1fr] gap-6">
            {/* Unified Calendar */}
            <div className="flex justify-center lg:justify-start">
              {userRole === 'leader' && calendarMode === 'range' ? (
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                  modifiers={{
                    confirmed: getConfirmedMeetingDates(),
                    hasSlots: getDatesWithSlots()
                  }}
                  modifiersClassNames={{
                    confirmed: 'rdp-day_confirmed',
                    hasSlots: 'rdp-day_hasSlots'
                  }}
                />
              ) : userRole === 'leader' && calendarMode === 'individual' ? (
                <CalendarComponent
                  mode="multiple"
                  selected={selectedDatesForSlots}
                  onSelect={(dates) => {
                    // dates can be undefined or Date[]
                    const newDates = dates || [];
                    console.log('📆 Calendario actualizado:', newDates.length, 'fechas seleccionadas');
                    setSelectedDatesForSlots(newDates);
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="rounded-md border"
                  modifiers={{
                    confirmed: getConfirmedMeetingDates(),
                    hasSlots: getDatesWithSlots()
                  }}
                  modifiersClassNames={{
                    confirmed: 'rdp-day_confirmed',
                    hasSlots: 'rdp-day_hasSlots'
                  }}
                />
              ) : (
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    confirmed: getConfirmedMeetingDates(),
                    hasSlots: userRole === 'leader' ? getDatesWithSlots() : []
                  }}
                  modifiersClassNames={{
                    confirmed: 'rdp-day_confirmed',
                    hasSlots: 'rdp-day_hasSlots'
                  }}
                />
              )}
            </div>
            
            {/* Right Panel - Context-sensitive info */}
            <div className="space-y-4">
              {/* Show selected dates for adding slots (leader only) */}
              {userRole === 'leader' && calendarMode !== 'view' ? (
                <div className="space-y-4">
                  <div className="pb-3 border-b border-border">
                    <h4 className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Configurar Horarios
                    </h4>
                  </div>

                  {/* Show selected dates badges */}
                  {calendarMode === 'individual' && (
                    <div className="space-y-2">
                      {selectedDatesForSlots.length > 0 ? (
                        <>
                          <Label className="text-sm">
                            Fechas seleccionadas ({selectedDatesForSlots.length}):
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {selectedDatesForSlots
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((date, idx) => (
                                <Badge key={idx} variant="default" className="gap-1 bg-primary">
                                  {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  <button
                                    onClick={() => {
                                      const newDates = selectedDatesForSlots.filter(d => 
                                        formatDateToYMD(d) !== formatDateToYMD(date)
                                      );
                                      setSelectedDatesForSlots(newDates);
                                    }}
                                    className="ml-1 hover:text-destructive hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                    aria-label="Quitar fecha"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                          </div>
                        </>
                      ) : (
                        <Alert className="bg-muted/50">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Haz clic en las fechas del calendario para seleccionarlas. Vuelve a hacer clic para deseleccionar.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* Range mode helper */}
                  {calendarMode === 'range' && !dateRange?.from && (
                    <Alert className="bg-muted/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Selecciona una fecha de inicio y luego una fecha de fin para crear un rango.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Time configuration */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-hour">Hora de inicio</Label>
                      <Input
                        id="start-hour"
                        type="time"
                        value={startHour}
                        onChange={(e) => {
                          console.log('⏰ Hora de inicio cambiada a:', e.target.value);
                          setStartHour(e.target.value);
                        }}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Hora actual: {startHour || '(no establecida)'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slot-count">Cantidad de reuniones consecutivas (1 hora cada una)</Label>
                      <Input
                        id="slot-count"
                        type="number"
                        min="1"
                        max="12"
                        value={slotCount}
                        onChange={(e) => setSlotCount(Math.max(1, Math.min(12, parseInt(e.target.value) || 1)))}
                      />
                    </div>

                    {/* Debug info */}
                    <Alert className="text-xs">
                      <AlertCircle className="h-3 w-3" />
                      <AlertDescription className="text-xs">
                        <div><strong>Modo:</strong> {calendarMode}</div>
                        <div><strong>Fechas seleccionadas:</strong> {selectedDatesForSlots.length}</div>
                        <div><strong>Fechas a procesar:</strong> {getDatesToProcess().length}</div>
                        <div><strong>Horarios por fecha:</strong> {slotCount}</div>
                        <div><strong>Total horarios:</strong> {getDatesToProcess().length * slotCount}</div>
                      </AlertDescription>
                    </Alert>

                    {getDatesToProcess().length > 0 && slotCount > 0 && startHour && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <p>Se crearán <strong>{getDatesToProcess().length * slotCount} horarios</strong></p>
                            <div className="text-xs space-y-1">
                              <p className="font-medium">Vista previa de horarios:</p>
                              {(() => {
                                const previewSlots = generateTimeSlots(startHour || '09:00', Math.min(slotCount, 3));
                                if (previewSlots.length === 0) {
                                  return <p className="text-red-500">⚠️ Error: No se pudieron generar horarios</p>;
                                }
                                return previewSlots.map((slot, idx) => (
                                  <p key={idx}>• {slot.start} - {slot.end}</p>
                                ));
                              })()}
                              {slotCount > 3 && <p>• ... y {slotCount - 3} más</p>}
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {getDatesToProcess().length > 0 && (!startHour || startHour.trim() === '') && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          ⚠️ Debes seleccionar una hora de inicio
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Button 
                        onClick={handleQuickAdd} 
                        disabled={isAdding || getDatesToProcess().length === 0 || !startHour || startHour.trim() === ''}
                        className="w-full"
                      >
                        {isAdding ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Agregando...
                          </>
                        ) : getDatesToProcess().length === 0 ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Selecciona fechas primero
                          </>
                        ) : !startHour || startHour.trim() === '' ? (
                          <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Configura la hora de inicio
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar {getDatesToProcess().length * slotCount} Horario{getDatesToProcess().length * slotCount !== 1 ? 's' : ''}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Show day details when viewing */
                <>
                  <div className="pb-3 border-b border-border">
                    <h4>
                      {selectedDate?.toLocaleDateString('es-ES', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h4>
                  </div>
                  
                  {selectedDate && getMeetingsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h5 className="text-sm">Reuniones Confirmadas</h5>
                      </div>
                      {getMeetingsForDate(selectedDate).map(meeting => (
                        <div 
                          key={meeting.id}
                          className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/10"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <div className="mb-2">
                                {userRole === 'leader' ? meeting.disciple_name : meeting.leader_name}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{meeting.time}</span>
                              </div>
                              {meeting.reschedule_requested && (
                                <Badge variant="secondary" className="mt-2 bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                                  Cambio solicitado
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate && getTimeSlotsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <h5 className="text-sm">Horarios {userRole === 'leader' ? 'Configurados' : 'Disponibles'}</h5>
                      </div>
                      {getTimeSlotsForDate(selectedDate).map(slot => (
                        <div 
                          key={slot.id}
                          className={`p-3 rounded-lg border ${
                            slot.is_available 
                              ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' 
                              : 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{slot.start_time} - {slot.end_time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={slot.is_available ? 'default' : 'secondary'}
                                className={slot.is_available 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
                                }
                              >
                                {slot.is_available ? 'Disponible' : 'Ocupado'}
                              </Badge>
                              {userRole === 'leader' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTimeSlot(slot.id)}
                                  className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {userRole === 'disciple' && slot.is_available && (
                            <Button 
                              size="sm" 
                              onClick={() => handleRequestMeeting(slot.id)}
                              className="w-full mt-2"
                            >
                              Solicitar esta hora
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {userRole === 'leader' 
                          ? 'No hay reuniones ni horarios para este día. Usa el modo de selección para agregar horarios.'
                          : 'No hay reuniones ni horarios disponibles para este día'}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <h5 className="text-sm mb-3">Leyenda del calendario:</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-muted-foreground">Reuniones confirmadas</span>
              </div>
              {userRole === 'leader' && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-green-600 dark:bg-green-400"></div>
                  </div>
                  <span className="text-muted-foreground">Horarios configurados</span>
                </div>
              )}
              {userRole === 'leader' && (selectedDatesForSlots.length > 0 || dateRange) && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-muted-foreground">Seleccionadas para agregar</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>



      {/* All Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {userRole === 'leader' ? 'Mis Horarios Configurados' : 'Horarios Disponibles'}
          </CardTitle>
          <CardDescription>
            {userRole === 'leader' 
              ? `${timeSlots.length} horarios configurados`
              : `${timeSlots.filter(s => s.is_available).length} horarios disponibles para solicitar`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(userRole === 'leader' ? timeSlots : timeSlots.filter(s => s.is_available)).length === 0 ? (
            <Alert>
              <Clock className="h-5 w-5" />
              <AlertDescription className="ml-2">
                <p className="mb-1">
                  {userRole === 'leader' ? 'No tienes horarios configurados' : 'No hay horarios disponibles'}
                </p>
                <p className="text-muted-foreground">
                  {userRole === 'leader' 
                    ? 'Usa el formulario de arriba para crear tus horarios disponibles.'
                    : 'Tu líder aún no ha configurado horarios o todos están ocupados.'}
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {Object.entries(getTimeSlotsGroupedByDate()).map(([date, slots]) => {
                const displaySlots = userRole === 'leader' ? slots : slots.filter(s => s.is_available);
                if (displaySlots.length === 0) return null;
                
                const dateObj = new Date(date + 'T00:00:00');
                const isToday = formatDateToYMD(new Date()) === date;
                const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                
                return (
                  <div key={date} className="space-y-2">
                    <h4 className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {dateObj.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      {isToday && (
                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                          Hoy
                        </Badge>
                      )}
                      {isPast && !isToday && (
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 dark:bg-gray-950/30 dark:text-gray-400">
                          Pasado
                        </Badge>
                      )}
                      <span className="text-muted-foreground">
                        ({displaySlots.length}{userRole === 'disciple' ? ' disponibles' : ''})
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                      {displaySlots.map(slot => (
                        <div 
                          key={slot.id}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            userRole === 'leader'
                              ? 'border-border hover:border-primary/50'
                              : 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/10 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm truncate">{slot.start_time} - {slot.end_time}</span>
                            {userRole === 'leader' && (
                              <Badge 
                                variant={slot.is_available ? 'default' : 'secondary'}
                                className={`text-xs ${slot.is_available 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' 
                                  : 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400'
                                }`}
                              >
                                {slot.is_available ? '✓' : '✗'}
                              </Badge>
                            )}
                          </div>
                          {userRole === 'leader' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTimeSlot(slot.id)}
                              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleRequestMeeting(slot.id)}
                              disabled={isPast}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Solicitar
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            {userRole === 'leader' ? 'Solicitudes de Reunión' : 'Mis Reuniones'}
          </CardTitle>
          <CardDescription>
            {meetings.length} {userRole === 'leader' ? 'solicitudes' : 'reuniones'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {meetings.length === 0 ? (
            <Alert>
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
              {meetings.map(meeting => (
                <div key={meeting.id} className="rounded-lg border border-border bg-card overflow-hidden">
                  {/* Reschedule Alert */}
                  {meeting.reschedule_requested && (
                    <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border-b border-orange-200 dark:border-orange-900">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm mb-1 text-orange-900 dark:text-orange-100">
                            Solicitud de cambio de horario
                          </h5>
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
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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
                        
                        <div className="flex-1">
                          <div className="mb-1">
                            {userRole === 'leader' ? meeting.disciple_name : meeting.leader_name}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <p className="text-sm">{meeting.date}</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Clock className="w-3.5 h-3.5" />
                            <p className="text-sm">{meeting.time}</p>
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
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' 
                            : meeting.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400'
                        }
                      >
                        {meeting.status === 'confirmed' ? 'Confirmada' :
                         meeting.status === 'pending' ? 'Pendiente' :
                         'Cancelada'}
                      </Badge>
                    </div>
                
                    {/* Meeting Actions */}
                    {meeting.status === 'pending' && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        {userRole === 'leader' ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleConfirmMeeting(meeting.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelMeeting(meeting.id)}
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
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Cancelar solicitud
                          </Button>
                        )}
                      </div>
                    )}

                    {meeting.status === 'confirmed' && !meeting.reschedule_requested && (
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
                        {userRole === 'leader' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRequestReschedule(meeting)}
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Solicitar cambio
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelConfirmedMeeting(meeting.id)}
                          className="text-destructive hover:text-destructive"
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
          )}
        </CardContent>
      </Card>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Cambio de Horario</DialogTitle>
            <DialogDescription>
              Por favor proporciona un motivo para solicitar el cambio de esta reunión.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rescheduleReason}
            onChange={(e) => setRescheduleReason(e.target.value)}
            placeholder="Ej: Tengo un compromiso inesperado a esa hora..."
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReschedule}>
              Enviar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
