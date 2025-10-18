import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, MessageCircle, List, Sparkles } from 'lucide-react';

type Props = {
  onSelectTraditional: () => void;
  onSelectConversational: () => void;
  onBack: () => void;
};

export function CheckInChoice({ onSelectTraditional, onSelectConversational, onBack }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Elige tu tipo de check-in</h1>
            <p className="text-muted-foreground">
              Selecciona la forma en que prefieres hacer tu check-in de hoy
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Conversational Check-in */}
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={onSelectConversational}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="flex items-center gap-2">
                Conversacional
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  Nuevo
                </span>
              </CardTitle>
              <CardDescription>
                Una conversación natural guiada por IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Comparte libremente lo que hay en tu corazón. La IA te hará preguntas 
                naturales para entender mejor tus luchas y encontrar las raíces profundas.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Conversación natural y empática</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Identifica raíces de forma más profunda</span>
                </li>
                <li className="flex items-start gap-2">
                  <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Plan personalizado basado en tu historia</span>
                </li>
              </ul>
              <Button className="w-full mt-4">
                Comenzar conversación
              </Button>
            </CardContent>
          </Card>

          {/* Traditional Check-in */}
          <Card 
            className="cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={onSelectTraditional}
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <List className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle>Tradicional</CardTitle>
              <CardDescription>
                Formato estructurado con opciones predefinidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Responde preguntas específicas seleccionando de listas predefinidas. 
                Rápido y directo al punto.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <List className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>Selecciona de opciones predefinidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <List className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>Más rápido y estructurado</span>
                </li>
                <li className="flex items-start gap-2">
                  <List className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span>Ideal si tienes poco tiempo</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-4">
                Usar formato tradicional
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: El check-in conversacional puede descubrir raíces más profundas, 
            pero toma un poco más de tiempo (5-10 minutos)
          </p>
        </div>
      </div>
    </div>
  );
}
