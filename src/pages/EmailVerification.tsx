import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { auth } from '@/config/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Timer, Sparkles, Mountain } from 'lucide-react';

export const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hook personalizado para manejar la verificación automática
  const {
    timeLeft,
    isAutoChecking,
    isVerified,
    progress,
    stopAutoCheck,
    restartAutoCheck,
    checkManually,
    formatTime
  } = useEmailVerification({
    totalDuration: 300, // 5 minutos
    checkInterval: 5000, // 5 segundos
    onVerificationSuccess: () => {
      setMessage('¡Email verificado exitosamente! Redirigiendo a tu cuenta...');
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        if (user?.role === 'seller' && !user.isApproved) {
          navigate('/pending-approval');
        } else if (user?.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (user?.role === 'seller' && user.isApproved) {
          navigate('/seller-dashboard');
        } else {
          navigate('/');
        }
      }, 2000);
    },
    onTimeout: () => {
      setMessage('Tiempo de verificación automática agotado. Puedes verificar manualmente o reenviar el correo.');
    }
  });

  // Check if user is already verified on component mount
  useEffect(() => {
    if (user && auth.currentUser?.emailVerified) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;

    // Prevent spam - allow resend only after 30 seconds
    if (lastSent && Date.now() - lastSent.getTime() < 30000) {
      setMessage('Espera 30 segundos antes de reenviar el correo.');
      return;
    }

    setIsResending(true);
    setMessage('');

    try {
      await sendEmailVerification(auth.currentUser);
      setLastSent(new Date());
      setMessage('Correo de verificación reenviado exitosamente.');
      
      // Reiniciar el contador y la verificación automática
      restartAutoCheck();
      
    } catch (error) {
      setMessage('Error al reenviar el correo. Intenta más tarde.');
    } finally {
      setIsResending(false);
    }
  };

  const handleManualCheck = async () => {
    const result = await checkManually();
    if (!result && !isVerified) {
      setMessage('Email aún no verificado. Revisa tu bandeja de entrada y spam.');
    }
  };

  const userEmail = auth.currentUser?.email || user?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo con animación mejorada */}
          <div className="mx-auto relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform duration-500 hover:rotate-6 hover:scale-110">
              {isVerified ? (
                <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
              ) : (
                <Mountain className="w-10 h-10 text-white drop-shadow-lg" />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse shadow-lg">
              <Sparkles className="w-4 h-4 text-white m-1" />
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {isVerified ? '¡Email Verificado!' : 'Verifica tu Email'}
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {isVerified ? 'Tu cuenta ha sido verificada exitosamente' : 'Confirma tu dirección de correo electrónico'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {!isVerified && (
            <>
              {/* Estado de verificación automática */}
              {isAutoChecking && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Timer className="w-6 h-6 text-primary animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">Verificación automática activa</h3>
                        <p className="text-sm text-muted-foreground">Revisando cada 5 segundos</p>
                      </div>
                    </div>
                    <Button
                      onClick={stopAutoCheck}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Detener
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tiempo restante</span>
                      <span className="font-mono font-semibold text-primary text-lg">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      La verificación se detendrá automáticamente cuando se complete o expire
                    </p>
                  </div>
                </div>
              )}

              {/* Información del email enviado */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">Email de verificación enviado</h3>
                </div>
                <p className="text-sm text-blue-700 leading-relaxed mb-3">
                  Hemos enviado un correo de verificación a:
                </p>
                <p className="font-medium text-blue-800 bg-blue-100 px-3 py-2 rounded-lg break-all">
                  {userEmail}
                </p>
              </div>
            </>
          )}

          {message && (
            <Alert variant={isVerified ? 'default' : message.includes('Error') ? 'destructive' : 'default'} 
                   className={isVerified ? 'border-green-200 bg-green-50' : ''}>
              {isVerified ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className={isVerified ? 'text-green-700 font-medium' : ''}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {!isVerified && (
            <>
              {/* Pasos a seguir */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pasos a seguir:</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { step: 1, text: "Revisa tu bandeja de entrada", icon: "📥" },
                    { step: 2, text: 'Busca el correo de "Tesoros del Chocó"', icon: "🔍" },
                    { step: 3, text: "Haz clic en el enlace de verificación", icon: "🔗" },
                    { step: 4, text: "¡Tu cuenta se verificará automáticamente!", icon: "✨" }
                  ].map(({ step, text, icon }) => (
                    <div key={step} className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {step}
                      </div>
                      <span className="text-sm font-medium flex-1">{text}</span>
                      <span className="text-xl">{icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button 
                  onClick={handleManualCheck}
                  className="w-full h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Verificar manualmente
                </Button>

                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending || (lastSent && Date.now() - lastSent.getTime() < 30000)}
                  variant="outline"
                  className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-semibold transition-all duration-300"
                >
                  {isResending && <RefreshCw className="w-5 h-5 mr-2 animate-spin" />}
                  {isResending ? 'Reenviando...' : 'Reenviar correo'}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground text-center bg-muted/30 p-4 rounded-xl">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                ¿No recibes el correo? Revisa tu carpeta de spam o correo no deseado.
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
