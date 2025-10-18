import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, Phone, Users, Heart, Shield } from 'lucide-react';

type Props = {
  onComplete: () => void;
};

export function CrisisScreen({ onComplete }: Props) {
  const handleEmergencyCall = () => {
    // In a real app, this would dial emergency services
    window.open('tel:911', '_self');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-destructive/5">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-destructive">No estás solo/a</h1>
          <p className="text-muted-foreground">
            Detectamos que estás pasando por un momento muy difícil. 
            Tu vida tiene un valor infinito. Por favor, busca ayuda ahora.
          </p>
        </div>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Líneas de ayuda inmediata
            </CardTitle>
            <CardDescription>
              Hay personas capacitadas esperando tu llamada, 24/7
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="mb-1">Línea Nacional de Prevención del Suicidio (USA)</div>
              <a href="tel:988" className="text-primary hover:underline">
                988
              </a>
              <p className="text-muted-foreground mt-1">También puedes enviar mensaje de texto</p>
            </div>
            
            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="mb-1">Crisis Text Line</div>
              <p className="text-muted-foreground">
                Envía un mensaje de texto con HOME al{' '}
                <a href="sms:741741" className="text-primary hover:underline">
                  741741
                </a>
              </p>
            </div>

            <div className="p-4 bg-card border border-border rounded-lg">
              <div className="mb-1">Servicios de emergencia</div>
              <Button 
                onClick={handleEmergencyCall}
                variant="destructive"
                className="w-full mt-2"
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamar a emergencias
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contacta a alguien de confianza
            </CardTitle>
            <CardDescription>
              No enfrentes esto solo/a
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Si tienes un pastor, líder, mentor, familiar o amigo cercano, 
              este es el momento de llamarlos. La vulnerabilidad salva vidas.
            </p>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>No importa la hora. Las personas que te aman querrán saber.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>No tienes que explicar todo. Solo di "estoy en crisis, necesito ayuda".</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Si no tienes a nadie, llama a una de las líneas de arriba. Ellos están para ti.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Verdades que necesitas recordar ahora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p>
                <strong>Este dolor es temporal.</strong> Aunque no lo sientas, esta tormenta pasará. 
                Hay esperanza del otro lado.
              </p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p>
                <strong>Tu vida tiene propósito.</strong> Fuiste creado/a con intención. 
                Dios tiene planes para tu futuro.
              </p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p>
                <strong>No estás solo/a.</strong> Jesús conoce el dolor profundo. 
                Él está contigo en este valle oscuro.
              </p>
            </div>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="italic">
                "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, 
                pensamientos de paz, y no de mal, para daros el fin que esperáis." 
                — Jeremías 29:11
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <p className="text-center text-muted-foreground">
            Cuando estés en un lugar más seguro, puedes volver a la app
          </p>
          <Button 
            onClick={onComplete}
            variant="outline"
            className="w-full"
          >
            Estoy en un lugar seguro, continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
