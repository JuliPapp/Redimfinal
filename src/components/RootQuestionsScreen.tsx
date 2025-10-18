import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { X, ChevronRight } from 'lucide-react';
import type { CheckInData, RootAnalysis } from '../App';

const ROOT_CAUSES = [
  // Spiritual
  { id: 'falta-intimidad-dios', label: 'No tener intimidad con Dios', category: 'spiritual' },
  { id: 'evitar-voz-dios', label: 'Evitar la voz de Dios', category: 'spiritual' },
  { id: 'corazon-endurecido', label: 'Endurecer mi corazón', category: 'spiritual' },
  { id: 'falta-confesion', label: 'Falta de confesión', category: 'spiritual' },
  { id: 'no-perdonar', label: 'No perdonar (a otros o a mí mismo/a)', category: 'spiritual' },
  { id: 'naturalizar-antinatural', label: 'Naturalizar lo anti-natural', category: 'spiritual' },
  { id: 'dudar-diseno-dios', label: 'Dudar del diseño de Dios', category: 'spiritual' },
  { id: 'rebeldia', label: 'Rebeldía', category: 'spiritual' },
  { id: 'orgullo', label: 'Orgullo', category: 'spiritual' },
  { id: 'vacio-espiritual', label: 'Vacío espiritual', category: 'spiritual' },
  { id: 'cuestiono-biblia', label: 'Cuestiono la Biblia', category: 'spiritual' },
  { id: 'malas-experiencias-iglesia', label: 'Malas experiencias con la iglesia', category: 'spiritual' },
  { id: 'desobediencia', label: 'Desobediencia a los principios de Dios', category: 'spiritual' },
  { id: 'ceguera-espiritual', label: 'Ceguera espiritual', category: 'spiritual' },
  
  // Identity
  { id: 'falta-identidad-cristo', label: 'Falta de identidad en Cristo', category: 'identity' },
  { id: 'creer-mentiras', label: 'Creer mentiras sobre mí mismo/a', category: 'identity' },
  { id: 'inseguridades', label: 'Inseguridades', category: 'identity' },
  { id: 'baja-autoestima', label: 'Baja autoestima', category: 'identity' },
  { id: 'verguenza', label: 'Vergüenza no resuelta', category: 'identity' },
  { id: 'comparaciones', label: 'Comparaciones constantes con otros', category: 'identity' },
  { id: 'temor-abandono', label: 'Temor al abandono', category: 'identity' },
  { id: 'perdida-identidad', label: 'Pérdida de identidad', category: 'identity' },
  { id: 'insatisfaccion', label: 'Insatisfacción constante', category: 'identity' },
  { id: 'falta-proposito', label: 'Falta de propósito', category: 'identity' },
  
  // Family
  { id: 'papa-ausente', label: 'Papá ausente o poco presente', category: 'family' },
  { id: 'mama-ausente', label: 'Mamá ausente o poco presente', category: 'family' },
  { id: 'familia-rota', label: 'Familia rota o disfuncional', category: 'family' },
  { id: 'falta-amor-paternal', label: 'Falta de amor paternal/maternal', category: 'family' },
  { id: 'ruptura-familia', label: 'Ruptura en la familia', category: 'family' },
  { id: 'abuso-familiar', label: 'Abuso familiar (físico/emocional)', category: 'family' },
  
  // Trauma
  { id: 'rechazo', label: 'Haber sido rechazado/a o despreciado/a', category: 'trauma' },
  { id: 'abuso', label: 'Ser víctima de abuso sexual o emocional', category: 'trauma' },
  { id: 'violacion', label: 'Ser víctima de violación', category: 'trauma' },
  { id: 'burlas', label: 'Ser víctima de agresiones o burlas', category: 'trauma' },
  { id: 'discriminacion', label: 'Ser discriminado/a', category: 'trauma' },
  { id: 'trauma', label: 'Traumas no sanados', category: 'trauma' },
  
  // Relationships
  { id: 'soledad', label: 'Soledad', category: 'relationships' },
  { id: 'aislamiento', label: 'Aislamiento', category: 'relationships' },
  { id: 'amistades-toxicas', label: 'Amistades que no me edifican', category: 'relationships' },
  { id: 'relaciones-rotas', label: 'Relaciones rotas o dañadas', category: 'relationships' },
  { id: 'codependencia', label: 'Codependencia', category: 'relationships' },
  
  // Mental/Emotional
  { id: 'depresion', label: 'Depresión', category: 'mental' },
  { id: 'angustia', label: 'Angustia', category: 'mental' },
  { id: 'ansiedad', label: 'Ansiedad', category: 'mental' },
  { id: 'cansancio', label: 'Quemado/a o cansado/a', category: 'mental' },
  { id: 'pensamientos-muerte', label: 'Pensamientos de muerte', category: 'mental' },
  { id: 'amargura', label: 'Amargura', category: 'mental' },
  { id: 'culpa', label: 'Culpa excesiva', category: 'mental' },
  
  // Behavior
  { id: 'falta-limites', label: 'Falta de límites', category: 'behavior' },
  { id: 'esclavitud', label: 'Esclavitud a hábitos', category: 'behavior' },
  { id: 'adiccion-placer', label: 'Adicción al placer', category: 'behavior' },
  { id: 'codicia', label: 'Codicia', category: 'behavior' },
  { id: 'egoismo', label: 'Egoísmo', category: 'behavior' },
];

type Props = {
  checkInData: CheckInData;
  onComplete: (analysis: RootAnalysis) => void;
  onCancel: () => void;
};

export function RootQuestionsScreen({ checkInData, onComplete, onCancel }: Props) {
  const [selectedRoots, setSelectedRoots] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const categories = [
    { id: 'spiritual', name: 'Espiritual', description: 'Tu relación con Dios' },
    { id: 'identity', name: 'Identidad', description: 'Cómo te ves a ti mismo/a' },
    { id: 'family', name: 'Familia', description: 'Tu contexto familiar' },
    { id: 'trauma', name: 'Heridas', description: 'Experiencias dolorosas' },
    { id: 'relationships', name: 'Relaciones', description: 'Tus conexiones con otros' },
    { id: 'mental', name: 'Emocional', description: 'Tu estado emocional' },
    { id: 'behavior', name: 'Hábitos', description: 'Patrones de conducta' },
  ];

  const currentCategory = categories[step - 1];
  const rootsInCategory = ROOT_CAUSES.filter(r => r.category === currentCategory.id);
  const totalSteps = categories.length;
  const progressPercent = (step / totalSteps) * 100;

  const toggleRoot = (id: string) => {
    setSelectedRoots(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        identifiedRoots: selectedRoots,
        checkInData,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="border-b border-border bg-card">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div>Identificando raíces</div>
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
          <Card>
            <CardHeader>
              <CardTitle>{currentCategory.name}</CardTitle>
              <CardDescription>{currentCategory.description}</CardDescription>
              <p className="text-muted-foreground pt-2">
                Selecciona las que resuenen contigo. Está bien si no estás 100% seguro/a.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {rootsInCategory.map((root) => (
                <div
                  key={root.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoots.includes(root.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleRoot(root.id)}
                >
                  <Checkbox
                    id={root.id}
                    checked={selectedRoots.includes(root.id)}
                    onCheckedChange={() => toggleRoot(root.id)}
                    className="mt-0.5"
                  />
                  <Label htmlFor={root.id} className="cursor-pointer flex-1">
                    {root.label}
                  </Label>
                </div>
              ))}

              {rootsInCategory.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay opciones en esta categoría por ahora.
                </p>
              )}
            </CardContent>
          </Card>

          {selectedRoots.length > 0 && (
            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-muted-foreground mb-2">
                Has identificado {selectedRoots.length} posible{selectedRoots.length !== 1 ? 's' : ''} raíz
                {selectedRoots.length !== 1 ? 'ces' : ''} hasta ahora.
              </p>
              <p className="text-muted-foreground">
                Recuerda: identificar la raíz es el primer paso hacia la sanidad. Dios quiere 
                restaurar estas áreas de tu vida.
              </p>
            </div>
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
          <Button onClick={handleNext} className="flex-1">
            {step === totalSteps ? 'Ver mi plan' : 'Siguiente'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
