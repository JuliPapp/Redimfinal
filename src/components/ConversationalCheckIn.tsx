import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Send, Sparkles, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { API_URLS } from '../utils/api';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

type Analysis = {
  struggles: Array<{
    name: string;
    intensity: number;
  }>;
  identified_roots: string[];
  biblical_verses: Array<{
    reference: string;
    text: string;
    application: string;
  }>;
  guided_prayers: string[];
  practical_actions: string[];
  summary: string;
};

type Props = {
  accessToken: string;
  projectId: string;
  onComplete: (checkIn: any) => void;
  onBack: () => void;
};

export function ConversationalCheckIn({ accessToken, projectId, onComplete, onBack }: Props) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    setIsStarting(true);
    try {
      console.log('=== STARTING CONVERSATION ===');
      console.log('Project ID:', projectId);
      
      const url = API_URLS.startConversation();
      console.log('Calling:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Server error:', errorData);
        
        // Log details for debugging
        if (errorData.details) {
          console.error('Error details:', errorData.details);
        }
        
        // Show specific error messages
        if (errorData.error === 'OpenAI API key not configured') {
          toast.error('⚠️ La API key de OpenAI no está configurada. Ve a Supabase Dashboard → Edge Functions → Settings → Secrets y agrega OPENAI_API_KEY');
          throw new Error('OpenAI API key no configurada en Supabase');
        } else if (errorData.error === 'API key inválida o expirada') {
          toast.error('❌ La API key de OpenAI es inválida. Verifica tu key en platform.openai.com/api-keys');
          throw new Error('API key inválida');
        } else if (errorData.error === 'Sin crédito en OpenAI') {
          toast.error('💳 Tu cuenta de OpenAI no tiene crédito. Agrega fondos en platform.openai.com/settings/organization/billing');
          throw new Error('Sin crédito en OpenAI');
        } else if (errorData.error === 'Límite de uso excedido') {
          toast.error('⏱️ Has excedido el límite de uso. Espera unos minutos e intenta nuevamente.');
          throw new Error('Rate limit excedido');
        } else if (errorData.error === 'Failed to generate AI response') {
          // Generic OpenAI error - show details
          const detailsMsg = errorData.details ? `\nDetalles: ${errorData.details}` : '';
          toast.error(`Error de OpenAI${detailsMsg}. Revisa los logs del servidor.`);
          throw new Error('Error al generar respuesta de IA');
        } else if (response.status === 401) {
          toast.error('No autorizado. Por favor inicia sesión nuevamente.');
          throw new Error('No autorizado');
        } else {
          toast.error(`Error del servidor: ${errorData.error || 'Error desconocido'}`);
          throw new Error(errorData.error || 'Error del servidor');
        }
      }

      const data = await response.json();
      console.log('✅ Conversation started successfully');
      console.log('Response data:', data);
      
      setConversationId(data.conversationId);
      setMessages([{
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      }]);
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      
      // If error wasn't already handled with a specific toast, show generic message
      if (!error.message?.includes('OpenAI') && !error.message?.includes('autorizado')) {
        toast.error('No se pudo iniciar la conversación. Verifica tu conexión e intenta nuevamente.');
      }
    } finally {
      setIsStarting(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setMessageCount(prev => prev + 1);
    
    setIsLoading(true);

    try {
      const url = API_URLS.sendMessage(conversationId!);
      console.log('Sending message to:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      console.log('Send message response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Send message failed:', response.status, errorData);
        toast.error('Error al enviar el mensaje. Intenta nuevamente.');
        throw new Error(`Failed to send message: ${response.status}`);
      }

      const data = await response.json();
      
      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const finishCheckIn = async () => {
    if (!conversationId) return;

    setIsAnalyzing(true);

    try {
      const url = API_URLS.analyzeConversation(conversationId);
      console.log('Analyzing conversation at:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Analyze conversation response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Analyze conversation failed:', response.status, errorData);
        toast.error('Error al analizar la conversación. Intenta nuevamente.');
        throw new Error(`Failed to analyze conversation: ${response.status}`);
      }

      const data = await response.json();
      console.log('Analysis data received:', data.checkIn);
      
      // Ensure struggles is an array of objects, not strings
      if (data.checkIn.struggles && Array.isArray(data.checkIn.struggles)) {
        data.checkIn.struggles = data.checkIn.struggles.map((struggle: any) => {
          // If it's already an object with name and intensity, keep it
          if (typeof struggle === 'object' && struggle.name && struggle.intensity !== undefined) {
            return struggle;
          }
          // If it's a string, convert it to object format
          if (typeof struggle === 'string') {
            return { name: struggle, intensity: 5 };
          }
          // Otherwise, return a default
          return { name: 'Unknown', intensity: 5 };
        });
      } else {
        data.checkIn.struggles = [];
      }
      
      setAnalysis(data.checkIn);
      toast.success('¡Check-in completado!');
    } catch (error) {
      console.error('Error analyzing conversation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isStarting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div>
                <h3 className="mb-2">Preparando tu espacio seguro...</h3>
                <p className="text-muted-foreground">
                  En un momento comenzaremos una conversación donde podrás compartir 
                  lo que hay en tu corazón
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (analysis) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-3xl mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Check-in completado
              </h1>
              <p className="text-muted-foreground">
                Tu plan personalizado de restauración
              </p>
            </div>
          </div>

          {/* Summary */}
          <Alert className="border-primary/50 bg-primary/5">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div>
                {analysis.summary}
              </div>
            </AlertDescription>
          </Alert>

          {/* Struggles and Intensity */}
          {analysis.struggles && analysis.struggles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Luchas identificadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.struggles.map((struggle, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span>{struggle.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Intensidad:</span>
                      <Badge 
                        variant={struggle.intensity >= 7 ? "destructive" : struggle.intensity >= 4 ? "secondary" : "default"}
                        className="min-w-[40px] justify-center"
                      >
                        {struggle.intensity}/10
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Identified Roots */}
          <Card>
            <CardHeader>
              <CardTitle>Raíces identificadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.identified_roots.map((root, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Badge variant="secondary" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <p>{root}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Biblical Verses */}
          <Card>
            <CardHeader>
              <CardTitle>Versículos para ti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.biblical_verses.map((verse, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card">
                  <div className="mb-2">
                    <Badge>{verse.reference}</Badge>
                  </div>
                  <p className="mb-3 italic">"{verse.text}"</p>
                  <p className="text-muted-foreground">
                    {verse.application}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Guided Prayers */}
          <Card>
            <CardHeader>
              <CardTitle>Oraciones guiadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.guided_prayers.map((prayer, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/50">
                  <p className="italic">{prayer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Practical Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones para esta semana</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.practical_actions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {index + 1}
                  </div>
                  <p>{action}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={() => onComplete(analysis)} className="flex-1">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Check-in conversacional
              </h2>
              <p className="text-muted-foreground">
                Comparte lo que hay en tu corazón
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl mx-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-lg">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="container max-w-3xl mx-auto p-4">
          {messageCount >= 3 && (
            <Alert className="mb-4 border-primary/50 bg-primary/5">
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>
                  ¿Listo para terminar? Haz clic en "Finalizar" para recibir tu plan personalizado de restauración.
                </span>
                <Button 
                  onClick={finishCheckIn}
                  disabled={isAnalyzing}
                  size="sm"
                  className="shrink-0"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    'Finalizar'
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1 min-h-[60px] max-h-[120px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Presiona Enter para enviar • Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
}
