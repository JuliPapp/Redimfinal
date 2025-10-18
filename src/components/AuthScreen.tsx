import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { AlertCircle, Heart, Loader2 } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { publicAnonKey } from '../utils/supabase/info';
import { API_URLS } from '../utils/api';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  gender?: string | null;
  age?: number | null;
  role: string;
  leader_id: string | null;
};

type Props = {
  onAuthSuccess: (user: any, profile: UserProfile) => void;
};

export function AuthScreen({ onAuthSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupGender, setSignupGender] = useState('');
  const [signupAge, setSignupAge] = useState('');

  const supabase = createClient();

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('saved_email');
    const savedPassword = localStorage.getItem('saved_password');
    if (savedEmail && savedPassword) {
      setLoginEmail(savedEmail);
      setLoginPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setError('Por favor ingresa tu email primero');
      return;
    }

    setError(null);
    setResetSuccess(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo: window.location.origin,
      });

      if (resetError) {
        throw resetError;
      }

      setResetSuccess('Te enviamos un email con instrucciones para restablecer tu contraseña');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Error al enviar el email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (authError) {
        if (authError.message.includes('Invalid login')) {
          throw new Error('Email o contraseña incorrectos');
        }
        throw new Error(authError.message);
      }
      
      if (!data.session) {
        throw new Error('No se pudo crear la sesión');
      }

      // Save credentials if "Remember me" is checked
      if (rememberMe) {
        localStorage.setItem('saved_email', loginEmail);
        localStorage.setItem('saved_password', loginPassword);
      } else {
        localStorage.removeItem('saved_email');
        localStorage.removeItem('saved_password');
      }

      // Get profile
      console.log('📡 Fetching profile from:', API_URLS.profile());
      const response = await fetch(API_URLS.profile(), {
        headers: {
          'Authorization': `Bearer ${data.session.access_token}`
        }
      });

      console.log('📡 Profile response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Profile fetch failed:', errorData);
        
        // More helpful error messages
        if (response.status === 404) {
          throw new Error('🚨 URGENTE: El código en Supabase es VIEJO. Abre el archivo: URGENTE_REDESPLEGAR_AHORA.md y sigue las instrucciones para REDESPLEGAR en 3 minutos.');
        } else if (response.status === 500) {
          const helpMessage = errorData.help || '';
          throw new Error(`🔧 Error del servidor: ${errorData.error || 'Error desconocido'}. ${helpMessage ? 'Lee: ' + helpMessage : 'Lee: CREAR_TABLA_KV_EN_SUPABASE.md'}`);
        } else {
          throw new Error(`Error al cargar el perfil (${response.status}). Revisa la consola para más detalles.`);
        }
      }

      const profileData = await response.json();
      console.log('✅ Profile loaded:', profileData.profile?.email, profileData.profile?.role);
      
      if (!profileData.profile) {
        throw new Error('No se encontró el perfil en la respuesta del servidor');
      }

      // Check for special admin access: role='admin' AND name='ADMIN' AND password='30093009'
      const isSpecialAdmin = 
        profileData.profile.role === 'admin' && 
        profileData.profile.name.toUpperCase() === 'ADMIN' && 
        loginPassword === '30093009';

      // Show a brief message if logging in as leader
      if (profileData.profile.role === 'leader' || profileData.profile.role === 'admin') {
        console.log('✅ Iniciando sesión como LÍDER');
        console.log('📋 Rol:', profileData.profile.role);
        console.log('👤 ID de líder:', data.user.id);
        console.log('📖 Revisa SETUP_ROLES.md para asignar discípulos');
      }

      // Show special message if special admin
      if (isSpecialAdmin) {
        console.log('🔐 Acceso especial de ADMINISTRADOR detectado');
        console.log('📁 Panel de PDFs disponible');
        console.log('💡 Nombre del perfil:', profileData.profile.name);
      }

      onAuthSuccess(data.user, profileData.profile, isSpecialAdmin);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!signupEmail || !signupPassword || !signupName || !signupGender || !signupAge) {
        throw new Error('Por favor completa todos los campos');
      }

      if (signupPassword.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const age = parseInt(signupAge);
      if (isNaN(age) || age < 1 || age > 120) {
        throw new Error('Por favor ingresa una edad válida');
      }

      // Create account via server
      const response = await fetch(API_URLS.signup(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          name: signupName,
          gender: signupGender,
          age: age,
          leaderId: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = errorData.error || 'Error al crear la cuenta';
        
        if (errorMessage.includes('already been registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
        } else if (errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
          errorMessage = 'La base de datos no está configurada. Ejecuta el script SQL primero.';
        }
        
        throw new Error(errorMessage);
      }

      // Login
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: signupEmail,
        password: signupPassword,
      });

      if (authError || !data.session) {
        throw new Error('Cuenta creada. Por favor inicia sesión manualmente.');
      }

      // Get profile
      const profileResponse = await fetch(API_URLS.profile(), {
        headers: {
          'Authorization': `Bearer ${data.session.access_token}`
        }
      });

      if (!profileResponse.ok) {
        throw new Error('Cuenta creada. Por favor inicia sesión manualmente.');
      }

      const profileData = await profileResponse.json();
      
      if (!profileData.profile) {
        throw new Error('Cuenta creada. Por favor inicia sesión manualmente.');
      }

      onAuthSuccess(data.user, profileData.profile);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1>Proyecto Redim</h1>
          <p className="text-muted-foreground">
            Un espacio seguro para tu sanidad y crecimiento espiritual
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bienvenido/a</CardTitle>
            <CardDescription>
              Inicia sesión o crea tu cuenta para comenzar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
                <TabsTrigger value="signup">Registrarse</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="text-sm text-primary hover:underline"
                    >
                      Olvidé mi contraseña
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember-me" className="cursor-pointer">
                      Recordar contraseña
                    </Label>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {resetSuccess && (
                    <Alert>
                      <AlertDescription className="text-primary">
                        {resetSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Iniciar sesión
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nombre</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Tu nombre"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Contraseña</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="signup-gender">Género</Label>
                      <select
                        id="signup-gender"
                        value={signupGender}
                        onChange={(e) => setSignupGender(e.target.value)}
                        required
                        disabled={isLoading}
                        className="flex h-10 w-full rounded-lg border border-input bg-input-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-[rgb(0,0,0)]"
                      >
                        <option value="">Selecciona...</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-age">Edad</Label>
                      <Input
                        id="signup-age"
                        type="number"
                        placeholder="18"
                        value={signupAge}
                        onChange={(e) => setSignupAge(e.target.value)}
                        required
                        disabled={isLoading}
                        min={1}
                        max={120}
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Crear cuenta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Importante:</strong> Esta aplicación es una herramienta de acompañamiento 
                  espiritual y no sustituye atención médica o psicológica profesional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
