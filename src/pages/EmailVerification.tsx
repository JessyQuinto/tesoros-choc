import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Mountain,
  ArrowRight,
  Clock
} from 'lucide-react';
import EmailService from '@/services/EmailService';
import { auth } from '@/config/firebase';

export const EmailVerification = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'error'>('pending');
  const [countdown, setCountdown] = useState(60);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Verificar estado de verificación
  const checkVerificationStatus = async () => {
    setIsChecking(true);
    try {
      // Recargar el usuario para obtener el estado actualizado
      await auth.currentUser?.reload();
      const currentUser = auth.currentUser;
      
      if (currentUser?.emailVerified) {
        setVerificationStatus('verified');
        // Intentar hacer login automáticamente
        try {
          // Aquí necesitarías las credenciales del usuario
          // Por ahora solo redirigimos
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } catch (error) {
          console.error('Error en login automático:', error);
        }
      } else {
        setVerificationStatus('pending');
      }
    } catch (error) {
      console.error('Error verificando estado:', error);
      setVerificationStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  // Reenviar email de verificación
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await EmailService.sendCustomEmailVerification();
      setCountdown(60);
      // Iniciar countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error reenviando verificación:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Verificar automáticamente cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (verificationStatus === 'pending') {
        checkVerificationStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [verificationStatus]);

  // Countdown para reenvío
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

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
              Verifica tu email
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Estás a un paso de descubrir los tesoros del Chocó
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {verificationStatus === 'verified' && (
            <Alert className="border-green-500/50 bg-green-500/5">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-700 font-medium">
                ¡Email verificado exitosamente! Redirigiendo...
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === 'error' && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription>
                Error verificando el email. Intenta de nuevo.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Revisa tu correo</h3>
              <p className="text-muted-foreground">
                Hemos enviado un enlace de verificación a tu correo electrónico. 
                Haz clic en el enlace para verificar tu cuenta.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Verificación automática en progreso...</span>
              </div>
              
              <Button
                onClick={checkVerificationStatus}
                disabled={isChecking}
                variant="outline"
                className="w-full"
              >
                {isChecking ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                {isChecking ? 'Verificando...' : 'Verificar manualmente'}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-semibold mb-2">¿No recibiste el correo?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Revisa tu carpeta de spam o solicita un nuevo enlace
              </p>
              
              <Button
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : countdown > 0 ? (
                  <Clock className="w-4 h-4 mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isResending 
                  ? 'Enviando...' 
                  : countdown > 0 
                    ? `Reenviar en ${countdown}s` 
                    : 'Reenviar correo'
                }
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                ¿Ya verificaste tu email?
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <span>Ir al login</span>
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Consejos importantes
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Revisa tu carpeta de spam o correo no deseado</li>
              <li>• Asegúrate de que el correo esté escrito correctamente</li>
              <li>• El enlace expira en 1 hora por seguridad</li>
              <li>• Si tienes problemas, contacta soporte</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
