import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { X, ChevronRight, AlertTriangle } from 'lucide-react';
import type { CheckInData } from '../App';

const STRUGGLE_CATEGORIES = [
  {
    name: 'Familia y Contexto Familiar',
    description: 'Tu relación con tu familia de origen y actual',
    struggles: [
      { id: 'padre-ausente', label: 'Padre ausente físicamente o emocionalmente' },
      { id: 'madre-ausente', label: 'Madre ausente físicamente o emocionalmente' },
      { id: 'falta-afecto-paternal', label: 'Falta de afecto o afirmación del padre' },
      { id: 'falta-afecto-maternal', label: 'Falta de afecto o afirmación de la madre' },
      { id: 'conflictos-padres', label: 'Conflictos constantes entre mis padres' },
      { id: 'divorcio-padres', label: 'Divorcio o separación de mis padres' },
      { id: 'familia-disfuncional', label: 'Ambiente familiar disfuncional o caótico' },
      { id: 'abuso-familiar', label: 'Abuso físico, emocional o verbal en familia' },
      { id: 'negligencia-familiar', label: 'Negligencia o abandono emocional' },
      { id: 'conflictos-hermanos', label: 'Conflictos o rivalidad con hermanos' },
      { id: 'rechazo-familiar', label: 'Sentirme rechazado/a por mi familia' },
      { id: 'expectativas-familiares', label: 'Presión por expectativas familiares' },
      { id: 'secretos-familiares', label: 'Secretos familiares dolorosos' },
      { id: 'problemas-pareja', label: 'Problemas en mi matrimonio/relación de pareja' },
      { id: 'problemas-hijos', label: 'Dificultades con mis hijos' },
      { id: 'familia-no-cristiana', label: 'Familia no apoya mi fe cristiana' },
    ]
  },
  {
    name: 'Heridas y Experiencias Dolorosas',
    description: 'Traumas y heridas del pasado que afectan tu presente',
    struggles: [
      { id: 'abuso-sexual', label: 'Abuso sexual en la infancia o adolescencia' },
      { id: 'abuso-sexual-adulto', label: 'Abuso sexual en la adultez' },
      { id: 'violacion', label: 'Violación' },
      { id: 'abuso-fisico', label: 'Abuso físico' },
      { id: 'abuso-emocional', label: 'Abuso emocional o psicológico' },
      { id: 'bullying', label: 'Bullying o acoso escolar' },
      { id: 'rechazo-social', label: 'Rechazo social o exclusión' },
      { id: 'abandono', label: 'Abandono (por padre, madre u otra persona)' },
      { id: 'perdida-ser-querido', label: 'Pérdida de un ser querido' },
      { id: 'trauma-accidente', label: 'Trauma por accidente o situación violenta' },
      { id: 'traicion', label: 'Traición de alguien cercano' },
      { id: 'ruptura-dolorosa', label: 'Ruptura amorosa muy dolorosa' },
      { id: 'aborto-pasado', label: 'Aborto (propio o de pareja)' },
      { id: 'exposicion-pornografia', label: 'Exposición temprana a pornografía' },
      { id: 'discriminacion', label: 'Discriminación (racial, social, etc.)' },
      { id: 'experiencia-guerra', label: 'Experiencia de guerra o violencia extrema' },
      { id: 'enfermedad-grave', label: 'Enfermedad grave propia o de ser querido' },
    ]
  },
  {
    name: 'Relaciones y Conexiones',
    description: 'Tus vínculos con otras personas',
    struggles: [
      { id: 'soledad-profunda', label: 'Soledad profunda' },
      { id: 'aislamiento', label: 'Aislamiento social o autoimpuesto' },
      { id: 'falta-amistades', label: 'Falta de amistades genuinas' },
      { id: 'amistades-toxicas', label: 'Amistades tóxicas o destructivas' },
      { id: 'codependencia', label: 'Codependencia en relaciones' },
      { id: 'miedo-intimidad', label: 'Miedo a la intimidad emocional' },
      { id: 'dificultad-confiar', label: 'Dificultad para confiar en otros' },
      { id: 'conflictos-constantes', label: 'Conflictos constantes con otros' },
      { id: 'necesidad-aprobacion', label: 'Necesidad excesiva de aprobación' },
      { id: 'miedo-rechazo', label: 'Miedo paralizante al rechazo' },
      { id: 'relaciones-superficiales', label: 'Solo tengo relaciones superficiales' },
      { id: 'dificultad-limites', label: 'Dificultad para poner límites sanos' },
      { id: 'abandono-iglesia', label: 'Desconexión de la iglesia/comunidad' },
      { id: 'conflictos-autoridad', label: 'Conflictos con figuras de autoridad' },
    ]
  },
  {
    name: 'Vida Espiritual',
    description: 'Tu relación con Dios',
    struggles: [
      { id: 'alejamiento-dios', label: 'Alejamiento de Dios' },
      { id: 'dificultad-orar', label: 'Dificultad para orar' },
      { id: 'dificultad-leer-biblia', label: 'Dificultad para leer la Biblia' },
      { id: 'duda-fe', label: 'Duda o crisis de fe' },
      { id: 'dureza-corazon', label: 'Dureza de corazón' },
      { id: 'rebeldia-dios', label: 'Rebeldía contra Dios' },
      { id: 'falta-intimidad-dios', label: 'Falta de intimidad con Dios' },
      { id: 'sentir-lejos-dios', label: 'Sentir que Dios está lejos' },
      { id: 'enojo-dios', label: 'Enojo con Dios' },
      { id: 'cuestionar-dios', label: 'Cuestionar la existencia o bondad de Dios' },
      { id: 'falta-proposito', label: 'Falta de propósito o llamado' },
      { id: 'desobediencia', label: 'Desobediencia consciente a Dios' },
      { id: 'falta-perdon', label: 'No poder perdonar (a otros o a mí mismo/a)' },
      { id: 'heridas-iglesia', label: 'Heridas causadas por la iglesia' },
      { id: 'religiosidad-vacia', label: 'Religiosidad vacía (sin relación real)' },
    ]
  },
  {
    name: 'Estado Emocional y Mental',
    description: 'Tu salud emocional y mental',
    struggles: [
      { id: 'depresion', label: 'Depresión' },
      { id: 'ansiedad', label: 'Ansiedad o ataques de pánico' },
      { id: 'trauma-ptsd', label: 'Trauma/PTSD no tratado' },
      { id: 'pensamientos-suicidas', label: 'Pensamientos suicidas', isRisk: true },
      { id: 'auto-lesion', label: 'Auto-lesión', isRisk: true },
      { id: 'baja-autoestima', label: 'Baja autoestima o auto-rechazo' },
      { id: 'verguenza-toxica', label: 'Vergüenza tóxica' },
      { id: 'culpa-excesiva', label: 'Culpa excesiva' },
      { id: 'inseguridad', label: 'Inseguridad profunda' },
      { id: 'miedo-paralizante', label: 'Miedo o terror constante' },
      { id: 'ira-incontrolable', label: 'Ira o rabia incontrolable' },
      { id: 'amargura', label: 'Amargura o resentimiento' },
      { id: 'vacio-existencial', label: 'Vacío existencial' },
      { id: 'desesperanza', label: 'Desesperanza' },
      { id: 'confusion-identidad', label: 'Confusión de identidad' },
      { id: 'trastorno-alimenticio', label: 'Trastorno alimenticio' },
      { id: 'toc', label: 'Pensamientos o comportamientos obsesivos' },
    ]
  },
  {
    name: 'Hábitos y Patrones de Conducta',
    description: 'Comportamientos repetitivos que te esclavizan',
    struggles: [
      { id: 'pornografia', label: 'Pornografía' },
      { id: 'masturbacion', label: 'Masturbación compulsiva' },
      { id: 'adiccion-sexual', label: 'Adicción sexual' },
      { id: 'relaciones-promiscuas', label: 'Relaciones sexuales promiscuas' },
      { id: 'fornicacion', label: 'Relaciones sexuales fuera del matrimonio' },
      { id: 'infidelidad', label: 'Infidelidad' },
      { id: 'alcohol', label: 'Consumo problemático de alcohol' },
      { id: 'drogas', label: 'Consumo de drogas' },
      { id: 'comida-atracones', label: 'Atracones de comida' },
      { id: 'comida-restriccion', label: 'Restricción extrema de comida' },
      { id: 'redes-sociales', label: 'Adicción a redes sociales/internet' },
      { id: 'videojuegos', label: 'Adicción a videojuegos' },
      { id: 'juego-apuestas', label: 'Juego/apuestas' },
      { id: 'compras-compulsivas', label: 'Compras compulsivas' },
      { id: 'trabajo-excesivo', label: 'Trabajo excesivo (workaholic)' },
      { id: 'mentira-habitual', label: 'Mentira habitual' },
      { id: 'manipulacion', label: 'Manipulación de otros' },
      { id: 'procrastinacion', label: 'Procrastinación crónica' },
      { id: 'perfeccionismo', label: 'Perfeccionismo paralizante' },
      { id: 'evitacion', label: 'Evitar problemas o responsabilidades' },
    ]
  },
  {
    name: 'Identidad y Sexualidad',
    description: 'Luchas relacionadas con identidad y sexualidad',
    struggles: [
      { id: 'confusion-identidad-sexual', label: 'Confusión de identidad sexual/género' },
      { id: 'atraccion-mismo-sexo', label: 'Atracción hacia el mismo sexo' },
      { id: 'rechazo-cuerpo', label: 'Rechazo de mi cuerpo o género biológico' },
      { id: 'lujuria', label: 'Lujuria o pensamientos sexuales obsesivos' },
      { id: 'fantasias-sexuales', label: 'Fantasías sexuales inapropiadas' },
      { id: 'identidad-Cristo', label: 'No saber quién soy en Cristo' },
      { id: 'comparaciones', label: 'Comparaciones constantes con otros' },
      { id: 'rechazo-propio', label: 'Rechazo profundo de mí mismo/a' },
    ]
  },
  {
    name: 'Otros',
    description: 'Cualquier otra lucha no listada',
    struggles: [
      { id: 'otro', label: 'Otra lucha no mencionada' },
    ]
  }
];

// Flatten all struggles for easy access
const ALL_STRUGGLES = STRUGGLE_CATEGORIES.flatMap(cat => cat.struggles);

const EMOTIONS = [
  // Emociones negativas/difíciles
  { id: 'ansiedad', label: 'Ansiedad', category: 'negative' },
  { id: 'panico', label: 'Pánico', category: 'negative' },
  { id: 'miedo', label: 'Miedo/Terror', category: 'negative' },
  { id: 'tristeza', label: 'Tristeza profunda', category: 'negative' },
  { id: 'depresion', label: 'Depresión', category: 'negative' },
  { id: 'desesperanza', label: 'Desesperanza', category: 'negative' },
  { id: 'desesperacion', label: 'Desesperación', category: 'negative' },
  { id: 'soledad', label: 'Soledad', category: 'negative' },
  { id: 'abandono', label: 'Abandono', category: 'negative' },
  { id: 'vacio', label: 'Vacío interior', category: 'negative' },
  { id: 'verguenza', label: 'Vergüenza', category: 'negative' },
  { id: 'humillacion', label: 'Humillación', category: 'negative' },
  { id: 'culpa', label: 'Culpa', category: 'negative' },
  { id: 'condenacion', label: 'Condenación', category: 'negative' },
  { id: 'rechazo', label: 'Rechazo', category: 'negative' },
  { id: 'inseguridad', label: 'Inseguridad', category: 'negative' },
  { id: 'inferioridad', label: 'Inferioridad', category: 'negative' },
  { id: 'confusion', label: 'Confusión', category: 'negative' },
  { id: 'desorientacion', label: 'Desorientación', category: 'negative' },
  { id: 'enojo', label: 'Enojo/Ira', category: 'negative' },
  { id: 'rabia', label: 'Rabia', category: 'negative' },
  { id: 'frustracion', label: 'Frustración', category: 'negative' },
  { id: 'impotencia', label: 'Impotencia', category: 'negative' },
  { id: 'amargura', label: 'Amargura', category: 'negative' },
  { id: 'resentimiento', label: 'Resentimiento', category: 'negative' },
  { id: 'celos', label: 'Celos', category: 'negative' },
  { id: 'envidia', label: 'Envidia', category: 'negative' },
  { id: 'cansancio', label: 'Cansancio extremo', category: 'negative' },
  { id: 'abrumado', label: 'Abrumado/Sobrepasado', category: 'negative' },
  { id: 'estres', label: 'Estrés intenso', category: 'negative' },
  { id: 'inquietud', label: 'Inquietud/Desasosiego', category: 'negative' },
  { id: 'desconfianza', label: 'Desconfianza', category: 'negative' },
  { id: 'disgusto', label: 'Disgusto/Asco', category: 'negative' },
  
  // Emociones positivas (importante incluirlas para balance)
  { id: 'paz', label: 'Paz', category: 'positive' },
  { id: 'calma', label: 'Calma', category: 'positive' },
  { id: 'esperanza', label: 'Esperanza', category: 'positive' },
  { id: 'fe', label: 'Fe/Confianza en Dios', category: 'positive' },
  { id: 'gratitud', label: 'Gratitud', category: 'positive' },
  { id: 'alegria', label: 'Alegría', category: 'positive' },
  { id: 'gozo', label: 'Gozo', category: 'positive' },
  { id: 'fortaleza', label: 'Fortaleza', category: 'positive' },
  { id: 'valentia', label: 'Valentía', category: 'positive' },
  { id: 'determinacion', label: 'Determinación', category: 'positive' },
  { id: 'amor', label: 'Amor', category: 'positive' },
  { id: 'aceptacion', label: 'Aceptación', category: 'positive' },
];

type Props = {
  onComplete: (data: CheckInData) => void;
  onCancel: () => void;
};

export function CheckInScreen({ onComplete, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [selectedStruggles, setSelectedStruggles] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const totalSteps = 4;
  const progressPercent = (step / totalSteps) * 100;

  const toggleStruggle = (id: string) => {
    setSelectedStruggles(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleEmotion = (id: string) => {
    setSelectedEmotions(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        struggles: selectedStruggles,
        intensity,
        trigger: trigger.trim() || undefined,
        emotions: selectedEmotions,
      });
    }
  };

  const canProceed = () => {
    if (step === 1) return selectedStruggles.length > 0;
    if (step === 2) return true; // Intensity always has a value
    if (step === 3) return true; // Trigger is optional
    if (step === 4) return selectedEmotions.length > 0;
    return false;
  };

  const hasRiskStruggles = selectedStruggles.some(s => 
    ALL_STRUGGLES.find(st => st.id === s)?.isRisk
  );

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div>Check-in diario</div>
            <p className="text-muted-foreground">Paso {step} de {totalSteps}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <Progress value={progressPercent} className="h-1 rounded-none" />
      </div>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto p-4 py-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>¿Con qué estás luchando hoy?</CardTitle>
                <CardDescription>
                  Selecciona todo lo que aplique. Este es un espacio seguro y sin juicio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {STRUGGLE_CATEGORIES.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform flex-shrink-0 ml-2 ${
                          expandedCategories.includes(category.name) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {expandedCategories.includes(category.name) && (
                      <div className="space-y-2 pl-4">
                        {category.struggles.map((struggle) => (
                          <div
                            key={struggle.id}
                            className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              selectedStruggles.includes(struggle.id)
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => toggleStruggle(struggle.id)}
                          >
                            <Checkbox
                              id={struggle.id}
                              checked={selectedStruggles.includes(struggle.id)}
                              onCheckedChange={() => toggleStruggle(struggle.id)}
                              className="mt-0.5"
                            />
                            <div className="flex-1">
                              <Label htmlFor={struggle.id} className="cursor-pointer flex items-center gap-2">
                                {struggle.label}
                                {struggle.isRisk && (
                                  <AlertTriangle className="w-4 h-4 text-destructive" />
                                )}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {selectedStruggles.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm">
                      <strong>Seleccionaste {selectedStruggles.length} lucha{selectedStruggles.length > 1 ? 's' : ''}.</strong> 
                      {' '}Reconocer esto es el primer paso hacia la sanidad.
                    </p>
                  </div>
                )}
                
                {hasRiskStruggles && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">
                      <strong>Notamos que estás pasando por un momento muy difícil.</strong> Por favor, 
                      considera buscar ayuda inmediata si estás en peligro. Siempre hay alguien dispuesto 
                      a escucharte.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>¿Qué tan intensa es la lucha hoy?</CardTitle>
                <CardDescription>
                  0 = muy leve, 10 = extremadamente intensa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                    <span className="text-primary">{intensity}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Slider
                    value={[intensity]}
                    onValueChange={(vals) => setIntensity(vals[0])}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-muted-foreground">
                    <span>Leve</span>
                    <span>Intensa</span>
                  </div>
                </div>

                {intensity >= 8 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <p className="text-amber-700 dark:text-amber-300">
                      Esto suena muy pesado. Recuerda que no tienes que enfrentarlo solo/a.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>¿Qué pasó antes? (opcional)</CardTitle>
                <CardDescription>
                  Identificar el disparador ayuda a entender patrones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Por ejemplo: 'Vi algo en redes sociales', 'Tuve una discusión', 'Me sentí solo/a', 'Estaba aburrido/a'..."
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>¿Qué emociones sientes ahora?</CardTitle>
                <CardDescription>
                  Identifica tus emociones. Todas son válidas. Puedes seleccionar varias.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-muted-foreground">Emociones difíciles</h4>
                      {selectedEmotions.filter(id => 
                        EMOTIONS.find(e => e.id === id)?.category === 'negative'
                      ).length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {selectedEmotions.filter(id => 
                            EMOTIONS.find(e => e.id === id)?.category === 'negative'
                          ).length} seleccionadas
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                      {EMOTIONS.filter(e => e.category === 'negative').map((emotion) => (
                        <button
                          key={emotion.id}
                          onClick={() => toggleEmotion(emotion.id)}
                          className={`p-3 rounded-lg border text-left transition-colors text-sm ${
                            selectedEmotions.includes(emotion.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {emotion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-muted-foreground">Emociones positivas</h4>
                      {selectedEmotions.filter(id => 
                        EMOTIONS.find(e => e.id === id)?.category === 'positive'
                      ).length > 0 && (
                        <span className="text-sm text-muted-foreground">
                          {selectedEmotions.filter(id => 
                            EMOTIONS.find(e => e.id === id)?.category === 'positive'
                          ).length} seleccionadas
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {EMOTIONS.filter(e => e.category === 'positive').map((emotion) => (
                        <button
                          key={emotion.id}
                          onClick={() => toggleEmotion(emotion.id)}
                          className={`p-3 rounded-lg border text-left transition-colors text-sm ${
                            selectedEmotions.includes(emotion.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {emotion.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedEmotions.length > 0 && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm">
                      Identificaste <strong>{selectedEmotions.length} emoción{selectedEmotions.length > 1 ? 'es' : ''}</strong>. 
                      {' '}Reconocer lo que sientes es un paso valiente hacia la sanidad.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card p-4">
        <div className="container max-w-2xl mx-auto flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Atrás
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            disabled={!canProceed()}
            className="flex-1"
          >
            {step === totalSteps ? 'Continuar' : 'Siguiente'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
