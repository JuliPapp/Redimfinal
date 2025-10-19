import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  User, 
  Mail, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Church,
  Award,
  BookOpen
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';

type ServiceArea = 'medios' | 'adoracion' | 'evangelismo' | 'ministerio_palabra' | 'incorporacion' | 'no_sirvo';
type Gift = 'sabiduria' | 'entendimiento' | 'consejo' | 'fortaleza' | 'ciencia' | 'piedad' | 'temor_dios';

type DiscipleInfo = {
  profile: {
    id: string;
    email: string;
    name: string;
    gender?: string;
    age?: number;
    created_at: string;
  };
  profileData: {
    strugglingAreas?: string[];
    currentSituation?: string;
    goals?: string[];
    supportNeeded?: string;
    is_member?: boolean;
    service_areas?: ServiceArea[];
    has_gifts?: boolean;
    gifts?: Gift[];
    is_studying?: boolean;
  } | null;
};

type Props = {
  discipleId: string;
  discipleName: string;
  accessToken: string;
  onBack: () => void;
};

const SERVICE_AREA_LABELS: Record<ServiceArea, string> = {
  'medios': '🎥 Medios',
  'adoracion': '🎵 Adoración',
  'evangelismo': '✝️ Evangelismo',
  'ministerio_palabra': '📖 Ministerio de la Palabra',
  'incorporacion': '🤝 Incorporación',
  'no_sirvo': '⏸️ No sirvo actualmente',
};

const GIFT_LABELS: Record<Gift, string> = {
  'sabiduria': 'Sabiduría',
  'entendimiento': 'Entendimiento',
  'consejo': 'Consejo',
  'fortaleza': 'Fortaleza',
  'ciencia': 'Ciencia',
  'piedad': 'Piedad',
  'temor_dios': 'Temor de Dios',
};

export function DiscipleProfileView({ discipleId, discipleName, accessToken, onBack }: Props) {
  console.log('🎯 DiscipleProfileView rendered with:', { discipleId, discipleName });
  
  const [notes, setNotes] = useState('');
  const [originalNotes, setOriginalNotes] = useState('');
  const [discipleInfo, setDiscipleInfo] = useState<DiscipleInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchDiscipleInfo();
    fetchNotes();
  }, [discipleId]);

  useEffect(() => {
    setHasUnsavedChanges(notes !== originalNotes);
  }, [notes, originalNotes]);

  const fetchDiscipleInfo = async () => {
    try {
      console.log('Fetching disciple info for:', discipleId);
      const response = await fetch(API_URLS.discipleInfo(discipleId), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      console.log('Disciple info response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al cargar información del discípulo');
      }

      const data = await response.json();
      console.log('Disciple info data:', data);
      console.log('Profile data contains ministerial info:', {
        is_member: data.profileData?.is_member,
        service_areas: data.profileData?.service_areas,
        has_gifts: data.profileData?.has_gifts,
        gifts: data.profileData?.gifts,
        is_studying: data.profileData?.is_studying
      });
      setDiscipleInfo(data);
    } catch (err: any) {
      console.error('Error fetching disciple info:', err);
      toast.error(err.message || 'Error al cargar información');
    }
  };

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching notes for disciple:', discipleId);
      const response = await fetch(API_URLS.leaderNotes(discipleId), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      console.log('Notes response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Error al cargar notas');
      }

      const data = await response.json();
      console.log('Notes data:', data);
      setNotes(data.notes || '');
      setOriginalNotes(data.notes || '');
    } catch (err: any) {
      console.error('Error fetching notes:', err);
      toast.error(err.message || 'Error al cargar notas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URLS.leaderNotes(discipleId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes })
      });

      if (!response.ok) {
        throw new Error('Error al guardar notas');
      }

      setOriginalNotes(notes);
      toast.success('Notas guardadas exitosamente');
    } catch (err: any) {
      console.error('Error saving notes:', err);
      toast.error(err.message || 'Error al guardar notas');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h2 className="text-xl">{discipleName}</h2>
            <p className="text-sm text-muted-foreground">Perfil del discípulo</p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      {discipleInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
            <CardDescription>
              Datos básicos del perfil del discípulo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p>{discipleInfo.profile.name}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {discipleInfo.profile.email}
                </p>
              </div>

              {discipleInfo.profile.gender && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p>{discipleInfo.profile.gender}</p>
                </div>
              )}

              {discipleInfo.profile.age && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Edad</p>
                  <p>{discipleInfo.profile.age} años</p>
                </div>
              )}

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Miembro desde</p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {formatDate(discipleInfo.profile.created_at)}
                </p>
              </div>
            </div>

            {discipleInfo.profileData && (
              <>
                <Separator />
                
                {discipleInfo.profileData.strugglingAreas && discipleInfo.profileData.strugglingAreas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm">Áreas de lucha</p>
                    <div className="flex flex-wrap gap-2">
                      {discipleInfo.profileData.strugglingAreas.map((area, index) => (
                        <Badge key={index} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {discipleInfo.profileData.currentSituation && (
                  <div className="space-y-2">
                    <p className="text-sm">Situación actual</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{discipleInfo.profileData.currentSituation}</p>
                    </div>
                  </div>
                )}

                {discipleInfo.profileData.goals && discipleInfo.profileData.goals.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm">Objetivos</p>
                    <ul className="space-y-1">
                      {discipleInfo.profileData.goals.map((goal, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {discipleInfo.profileData.supportNeeded && (
                  <div className="space-y-2">
                    <p className="text-sm">Apoyo necesario</p>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{discipleInfo.profileData.supportNeeded}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ministerial and Spiritual Information */}
      {discipleInfo && discipleInfo.profileData && (
        discipleInfo.profileData.is_member !== undefined ||
        (discipleInfo.profileData.service_areas && discipleInfo.profileData.service_areas.length > 0) ||
        (discipleInfo.profileData.has_gifts && discipleInfo.profileData.gifts && discipleInfo.profileData.gifts.length > 0) ||
        discipleInfo.profileData.is_studying !== undefined
      ) ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Church className="w-5 h-5" />
              Información Ministerial y Espiritual
            </CardTitle>
            <CardDescription>
              Detalles sobre membresía, servicio y dones espirituales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {discipleInfo.profileData.is_member !== undefined && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Membresía</p>
                <div className="flex items-center gap-2">
                  {discipleInfo.profileData.is_member ? (
                    <>
                      <Church className="w-4 h-4 text-primary" />
                      <Badge variant="default" className="gap-1">
                        <Church className="h-3 w-3" />
                        Miembro
                      </Badge>
                    </>
                  ) : (
                    <p className="text-sm">No es miembro</p>
                  )}
                </div>
              </div>
            )}

            {discipleInfo.profileData.service_areas && discipleInfo.profileData.service_areas.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Áreas de Servicio</p>
                <div className="flex flex-wrap gap-2">
                  {discipleInfo.profileData.service_areas.map((area, index) => (
                    <Badge key={index} variant="secondary">
                      {SERVICE_AREA_LABELS[area] || area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {discipleInfo.profileData.has_gifts && discipleInfo.profileData.gifts && discipleInfo.profileData.gifts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Dones Espirituales</p>
                <div className="flex flex-wrap gap-2">
                  {discipleInfo.profileData.gifts.map((gift, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      {GIFT_LABELS[gift] || gift}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {discipleInfo.profileData.is_studying !== undefined && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Formación</p>
                <div className="flex items-center gap-2">
                  {discipleInfo.profileData.is_studying ? (
                    <>
                      <BookOpen className="w-4 h-4 text-secondary-foreground" />
                      <Badge variant="secondary" className="gap-1">
                        <BookOpen className="h-3 w-3" />
                        En formación
                      </Badge>
                    </>
                  ) : (
                    <p className="text-sm">No está estudiando actualmente</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Private Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notas Privadas
          </CardTitle>
          <CardDescription>
            Estas notas son privadas y solo tú puedes verlas. Úsalas para llevar registro de reuniones, observaciones y seguimiento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí tus notas privadas sobre las reuniones, progreso, observaciones, etc.&#10;&#10;Ejemplo:&#10;- 15/01/2025: Primera reunión. Mostró apertura para hablar sobre...&#10;- 22/01/2025: Progreso notable en..."
                className="min-h-[300px] font-mono text-sm"
              />
              
              {hasUnsavedChanges && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Tienes cambios sin guardar
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                {hasUnsavedChanges && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotes(originalNotes);
                      toast.info('Cambios descartados');
                    }}
                  >
                    Descartar
                  </Button>
                )}
                <Button
                  onClick={handleSaveNotes}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Notas
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
