import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Heart, Users, AlertCircle, Shield } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

type Props = {
  onComplete: (mode: 'personal' | 'community') => void;
};

export function OnboardingScreen({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'personal' | 'community' | null>(null);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const disclaimerAccepted = localStorage.getItem('disclaimer_accepted');
    if (disclaimerAccepted === 'true') {
      // Skip step 1, go directly to step 2
      setStep(2);
    }
  }, []);

  const handleContinue = () => {
    if (step === 1 && acceptedDisclaimer) {
      // Save that disclaimer was accepted
      localStorage.setItem('disclaimer_accepted', 'true');
      setStep(2);
    } else if (step === 2 && selectedMode) {
      onComplete(selectedMode);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-foreground">Camino de Restauración</h1>
          <p className="text-muted-foreground">
            Un espacio seguro para tu proceso de sanidad
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Antes de comenzar</CardTitle>
              <CardDescription>
                Es importante que conozcas algunas cosas sobre esta aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tu privacidad es sagrada:</strong> Toda tu información se guarda de forma segura 
                  en tu dispositivo. Nadie más tiene acceso a lo que compartes aquí.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>No es un sustituto profesional:</strong> Esta app es una herramienta de 
                  acompañamiento espiritual. No reemplaza terapia profesional, atención médica o 
                  servicios de emergencia.
                </AlertDescription>
              </Alert>

              <Alert>
                <Heart className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cero condena:</strong> Aquí no hay juicio. Dios te ama tal como eres y 
                  camina contigo en este proceso de restauración.
                </AlertDescription>
              </Alert>

              <div className="pt-4 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="disclaimer"
                    checked={acceptedDisclaimer}
                    onCheckedChange={(checked) => setAcceptedDisclaimer(checked as boolean)}
                  />
                  <label
                    htmlFor="disclaimer"
                    className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    He leído y acepto que esta aplicación es una herramienta de apoyo espiritual 
                    y no sustituye ayuda profesional. En caso de emergencia, buscaré ayuda inmediata.
                  </label>
                </div>

                <Button
                  onClick={handleContinue}
                  disabled={!acceptedDisclaimer}
                  className="w-full"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo prefieres caminar este proceso?</CardTitle>
              <CardDescription>
                No te preocupes, podrás cambiar esto cuando quieras desde la pantalla principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button
                onClick={() => setSelectedMode('personal')}
                className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                  selectedMode === 'personal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">Personal</div>
                    <p className="text-muted-foreground">
                      Caminaré este proceso por mi cuenta, entre Dios y yo. La app me dará 
                      herramientas pero no involucraré a otras personas por ahora.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedMode('community')}
                className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                  selectedMode === 'community'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1">En comunidad</div>
                    <p className="text-muted-foreground">
                      Quiero involucrar a un líder, mentor o persona de confianza en mi proceso. 
                      La app me recordará conectar con ellos.
                    </p>
                  </div>
                </div>
              </button>

              <Button
                onClick={handleContinue}
                disabled={!selectedMode}
                className="w-full"
              >
                Comenzar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
