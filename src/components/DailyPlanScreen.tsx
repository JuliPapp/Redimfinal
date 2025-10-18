import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  BookOpen, 
  Heart, 
  CheckCircle2, 
  Users,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import type { RootAnalysis } from '../App';
import { getRelevantContent, type Scripture, type Prayer, type Action } from '../lib/content';

type Props = {
  analysis: RootAnalysis;
  mode: 'personal' | 'community';
  onBack: () => void;
};

export function DailyPlanScreen({ analysis, mode, onBack }: Props) {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  
  // Get root categories
  const categories = Array.from(new Set(
    analysis.identifiedRoots.map(rootId => {
      // Map root IDs to categories (simplified)
      if (rootId.includes('dios') || rootId.includes('biblia') || rootId.includes('espiritual') || 
          rootId.includes('confesion') || rootId.includes('perdon') || rootId.includes('corazon') ||
          rootId.includes('rebeldia') || rootId.includes('orgullo')) return 'spiritual';
      if (rootId.includes('identidad') || rootId.includes('mentiras') || rootId.includes('autoestima') ||
          rootId.includes('inseguridades') || rootId.includes('verguenza') || rootId.includes('comparaciones')) return 'identity';
      if (rootId.includes('papa') || rootId.includes('mama') || rootId.includes('familia')) return 'family';
      if (rootId.includes('abuso') || rootId.includes('violacion') || rootId.includes('trauma') ||
          rootId.includes('rechazo') || rootId.includes('burlas')) return 'trauma';
      if (rootId.includes('amistades') || rootId.includes('relaciones') || rootId.includes('soledad') ||
          rootId.includes('aislamiento')) return 'relationships';
      if (rootId.includes('depresion') || rootId.includes('angustia') || rootId.includes('muerte') ||
          rootId.includes('cansancio')) return 'mental';
      return 'behavior';
    })
  ));

  const content = getRelevantContent(analysis.identifiedRoots, categories as any);

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev =>
      prev.includes(actionId) 
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/10 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-amber-500/10 text-amber-700 dark:text-amber-300';
      case 'hard': return 'bg-red-500/10 text-red-700 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Medio';
      case 'hard': return 'Desafiante';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div>Tu plan de hoy</div>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto p-4 py-8 space-y-6">
        {/* Intro message */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p>
                  Identificamos <strong>{analysis.identifiedRoots.length} posibles raíces</strong> detrás 
                  de tus luchas. Recuerda: el objetivo no es solo dejar de hacer algo, sino sanar el 
                  corazón para que el fruto cambie naturalmente.
                </p>
                <p className="text-muted-foreground">
                  Este plan está diseñado específicamente para lo que compartiste hoy. 
                  No tienes que hacer todo. Elige lo que resuene contigo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scriptures */}
        {content.scriptures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Palabra para ti
              </CardTitle>
              <CardDescription>
                Versículos que hablan directamente a tu situación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.scriptures.map((scripture: Scripture) => (
                <div key={scripture.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-primary">{scripture.reference}</div>
                  </div>
                  <p className="italic">"{scripture.text}"</p>
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground">
                      <strong>Para ti hoy:</strong> {scripture.application}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Prayers */}
        {content.prayers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Guía de oración
              </CardTitle>
              <CardDescription>
                Puedes orar con tus propias palabras o usar esto como guía
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.prayers.map((prayer: Prayer) => (
                <div key={prayer.id} className="p-4 bg-secondary/30 rounded-lg space-y-3">
                  <div className="text-primary">{prayer.title}</div>
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {prayer.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {content.actions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Acciones prácticas
              </CardTitle>
              <CardDescription>
                Pasos concretos para hoy. Marca los que completes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {content.actions.map((action: Action) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    completedActions.includes(action.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleAction(action.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={action.id}
                      checked={completedActions.includes(action.id)}
                      onCheckedChange={() => toggleAction(action.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <label htmlFor={action.id} className="cursor-pointer">
                          {action.title}
                        </label>
                        <Badge 
                          variant="secondary" 
                          className={getDifficultyColor(action.difficulty)}
                        >
                          {getDifficultyLabel(action.difficulty)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Community reminder */}
        {mode === 'community' && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                No camines esto solo/a
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Elegiste caminar esto en comunidad. Considera compartir con tu mentor:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Qué luchas enfrentaste hoy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Qué raíces identificaste</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Cómo pueden orar específicamente por ti</span>
                </li>
              </ul>
              <p className="pt-2">
                <strong>Recuerda:</strong> la confesión mutua trae sanidad (Santiago 5:16). 
                No tienes que cargar esto solo/a.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Encouragement */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-muted-foreground">
                Este es un proceso, no un evento. No esperes perfección. 
                Espera progreso. Dios está contigo en cada paso.
              </p>
              <p className="italic text-primary">
                "El que comenzó en vosotros la buena obra, la perfeccionará 
                hasta el día de Jesucristo." — Filipenses 1:6
              </p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onBack} variant="outline" className="w-full">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
