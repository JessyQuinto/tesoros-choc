import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight, Mountain, MailCheck } from 'lucide-react';
import { useRef } from 'react';
import { setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from '@/config/firebase';
import EmailService from '@/services/EmailService';
import { UserRole } from '@/types/user.types';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState<string|null>(null);
  const { login, error, clearError, user } = useAuth();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Handle navigation after successful login
  useEffect(() => {
    if (user) {
      if (user.role === 'vendedor' && !user.isApproved) {
        navigate('/pending-approval');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'vendedor' && user.isApproved) {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    setIsLoading(true);
    clearError();
    setVerificationSent(false);
    setVerificationError(null);
    setPendingVerification(false);
    try {
      // Cambiar persistencia según el checkbox
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await login(email, password);
      // Navigation will be handled by useEffect when user state changes
    } catch (err) {
      // Si el error es de verificación de email, redirigir a /verify-email
      if (err instanceof Error && err.message && err.message.toLowerCase().includes('verifica tu email')) {
        setPendingVerification(true);
        setTimeout(() => {
          navigate('/verify-email');
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationSent(false);
    setVerificationError(null);
    try {
      await EmailService.sendCustomEmailVerification();
      setVerificationSent(true);
    } catch (err) {
      setVerificationError('No se pudo reenviar el correo. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo con animación mejorada */}
          <div className="mx-auto relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform duration-500 hover:rotate-6 hover:scale-110">
              <Mountain className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse shadow-lg">
              <Sparkles className="w-4 h-4 text-white m-1" />
            </div>
          </div>
          
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ¡Bienvenido de vuelta!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Descubre los tesoros artesanales del Chocó
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">

          {/* Mostrar error de email no verificado y botón para reenviar */}
          {error && error.toLowerCase().includes('verifica tu email') ? (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <MailCheck className="h-5 w-5 text-destructive" />
                <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-fit self-start mt-2"
                onClick={handleResendVerification}
                disabled={verificationSent}
              >
                {verificationSent ? 'Correo reenviado' : 'Reenviar correo de verificación'}
              </Button>
              {verificationError && <span className="text-xs text-destructive">{verificationError}</span>}
            </Alert>
          ) : error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                Correo electrónico
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                Contraseña
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((v) => !v)}
                className="accent-primary h-4 w-4 rounded border border-border focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer select-none">
                Recordarme
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              )}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>


          <div className="text-center space-y-2">
            <Link 
              to="/forgot-password" 
              className="text-sm text-primary hover:text-primary/80 font-medium hover:underline transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div>
              <span className="text-xs text-muted-foreground">¿No recibiste el correo de verificación?</span>
              <Button
                type="button"
                variant="link"
                className="text-xs px-1 h-auto"
                onClick={handleResendVerification}
                disabled={verificationSent}
              >
                {verificationSent ? 'Correo reenviado' : 'Reenviar verificación'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground font-medium">
                ¿Nuevo en Tesoros del Chocó?
              </span>
            </div>
          </div>
          
          <Link to="/register">
            <Button variant="outline" className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-semibold transition-all duration-300 hover:border-primary/40">
              Crear cuenta nueva
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}