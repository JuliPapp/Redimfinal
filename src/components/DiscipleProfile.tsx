import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ArrowLeft, Save, User, Award, BookOpen, Church, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';

type ServiceArea = 'medios' | 'adoracion' | 'evangelismo' | 'ministerio_palabra' | 'incorporacion' | 'no_sirvo';
type Gift = 'sabiduria' | 'entendimiento' | 'consejo' | 'fortaleza' | 'ciencia' | 'piedad' | 'temor_dios';

type ProfileData = {
  is_member: boolean;
  service_areas: ServiceArea[];
  has_gifts: boolean;
  gifts: Gift[];
  is_studying: boolean;
};

type Props = {
  accessToken: string;
  onBack: () => void;
};

const SERVICE_AREAS: { value: ServiceArea; label: string; icon: string }[] = [
  { value: 'medios', label: 'Medios', icon: '🎥' },
  { value: 'adoracion', label: 'Adoración', icon: '🎵' },
  { value: 'evangelismo', label: 'Evangelismo', icon: '✝️' },
  { value: 'ministerio_palabra', label: 'Ministerio de la Palabra', icon: '📖' },
  { value: 'incorporacion', label: 'Incorporación', icon: '🤝' },
  { value: 'no_sirvo', label: 'No sirvo actualmente', icon: '⏸️' },
];

const SPIRITUAL_GIFTS: { value: Gift; label: string; description: string }[] = [
  { value: 'sabiduria', label: 'Sabiduría', description: 'Discernir la voluntad de Dios' },
  { value: 'entendimiento', label: 'Entendimiento', description: 'Comprender verdades profundas' },
  { value: 'consejo', label: 'Consejo', description: 'Guiar con palabra oportuna' },
  { value: 'fortaleza', label: 'Fortaleza', description: 'Perseverar en la fe' },
  { value: 'ciencia', label: 'Ciencia', description: 'Conocimiento de las Escrituras' },
  { value: 'piedad', label: 'Piedad', description: 'Devoción y reverencia' },
  { value: 'temor_dios', label: 'Temor de Dios', description: 'Respeto y admiración por Dios' },
];

export function DiscipleProfile({ accessToken, onBack }: Props) {
  const [profile, setProfile] = useState<ProfileData>({
    is_member: false,
    service_areas: [],
    has_gifts: false,
    gifts: [],
    is_studying: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await fetch(API_URLS.discipleProfile(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          setProfile({
            is_member: data.profile.is_member || false,
            service_areas: data.profile.service_areas || [],
            has_gifts: data.profile.has_gifts || false,
            gifts: data.profile.gifts || [],
            is_studying: data.profile.is_studying || false,
          });
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(API_URLS.updateDiscipleProfile(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (response.ok) {
        toast.success('Perfil actualizado exitosamente');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Error al guardar el perfil');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleServiceArea = (area: ServiceArea) => {
    setProfile(prev => {
      const newAreas = prev.service_areas.includes(area)
        ? prev.service_areas.filter(a => a !== area)
        : [...prev.service_areas, area];
      return { ...prev, service_areas: newAreas };
    });
  };

  const toggleGift = (gift: Gift) => {
    setProfile(prev => {
      const newGifts = prev.gifts.includes(gift)
        ? prev.gifts.filter(g => g !== gift)
        : [...prev.gifts, gift];
      return { ...prev, gifts: newGifts };
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
              <p className="text-muted-foreground">Completa tu información ministerial y espiritual</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar
              </>
            )}
          </Button>
        </div>

        {/* Membresía */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Church className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Membresía</CardTitle>
                <CardDescription>¿Eres miembro de la iglesia?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Label htmlFor="is-member" className="text-base cursor-pointer">
                  Soy miembro
                </Label>
                {profile.is_member && (
                  <Badge variant="default" className="gap-1">
                    <Church className="h-3 w-3" />
                    Miembro
                  </Badge>
                )}
              </div>
              <Switch
                id="is-member"
                checked={profile.is_member}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, is_member: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Áreas de Servicio */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary/50 rounded-lg">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle>Áreas de Servicio</CardTitle>
                <CardDescription>¿En qué áreas sirves actualmente?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SERVICE_AREAS.map((area) => (
                <div
                  key={area.value}
                  onClick={() => toggleServiceArea(area.value)}
                  className={`
                    flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${profile.service_areas.includes(area.value)
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                    }
                  `}
                >
                  <Checkbox
                    checked={profile.service_areas.includes(area.value)}
                    onCheckedChange={() => toggleServiceArea(area.value)}
                  />
                  <span className="text-2xl">{area.icon}</span>
                  <span className="font-medium">{area.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dones Espirituales */}
        <Collapsible open={profile.has_gifts}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors pt-[24px] pr-[24px] pb-[14px] pl-[24px]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/50 rounded-lg">
                    <Award className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>Dones Espirituales</CardTitle>
                    <CardDescription>¿Has identificado dones del Espíritu Santo en tu vida?</CardDescription>
                  </div>
                  <Switch
                    checked={profile.has_gifts}
                    onCheckedChange={(checked) => {
                      setProfile(prev => ({ ...prev, has_gifts: checked, gifts: checked ? prev.gifts : [] }));
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <Separator className="mb-4" />
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-3 pb-2">
                    {SPIRITUAL_GIFTS.map((gift) => (
                      <div
                        key={gift.value}
                        onClick={() => toggleGift(gift.value)}
                        className={`
                          flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${profile.gifts.includes(gift.value)
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:border-primary/50'
                          }
                        `}
                      >
                        <Checkbox
                          checked={profile.gifts.includes(gift.value)}
                          onCheckedChange={() => toggleGift(gift.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{gift.label}</div>
                          <div className="text-sm text-muted-foreground">{gift.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Estudio */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle>Formación</CardTitle>
                <CardDescription>¿Estás estudiando una carrera actualmente?</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Label htmlFor="is-studying" className="text-base cursor-pointer">
                  Estoy estudiando
                </Label>
                {profile.is_studying && (
                  <Badge variant="secondary" className="gap-1">
                    <BookOpen className="h-3 w-3" />
                    En formación
                  </Badge>
                )}
              </div>
              <Switch
                id="is-studying"
                checked={profile.is_studying}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, is_studying: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Resumen de tu Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Church className="h-4 w-4 text-primary" />
              <span className="font-medium">Membresía:</span>
              <span className="text-muted-foreground">{profile.is_member ? 'Miembro' : 'No es miembro'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">Áreas de servicio:</span>
              <span className="text-muted-foreground">
                {profile.service_areas.length === 0 
                  ? 'Ninguna seleccionada'
                  : `${profile.service_areas.length} área${profile.service_areas.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-medium">Dones espirituales:</span>
              <span className="text-muted-foreground">
                {!profile.has_gifts 
                  ? 'Sin identificar'
                  : profile.gifts.length === 0
                  ? 'Ninguno seleccionado'
                  : `${profile.gifts.length} don${profile.gifts.length > 1 ? 'es' : ''} identificado${profile.gifts.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium">Estudiando:</span>
              <span className="text-muted-foreground">{profile.is_studying ? 'Sí' : 'No'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
