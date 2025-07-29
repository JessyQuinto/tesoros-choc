import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Countdown from '@/components/ui/Countdown';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { auth } from '@/config/firebase';
import EmailService from '@/services/EmailService';
import { Mail, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Hook personalizado para manejar la verificación automática (2 minutos)
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
    totalDuration: 120, // 2 minutos
    userData: user && (user.role === 'buyer' || user.role === 'seller') ? {
      name: user.name || 'Usuario',
      email: user.email,
      role: user.role,
      isApproved: user.isApproved
    } : undefined,
    onVerificationSuccess: () => {
      setMessage('¡Email verificado exitosamente! 🎉 Te hemos enviado un correo de bienvenida. Redirigiendo...');
      
      // Redireccionar después de 3 segundos
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
      }, 3000);
    },
    onTimeout: () => {
      setMessage('⏰ Tiempo de verificación automática agotado. Puedes verificar manualmente o reenviar el correo.');
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
      await EmailService.sendCustomEmailVerification();
      setLastSent(new Date());
      setMessage('Correo de verificación reenviado exitosamente con plantilla personalizada.');
      
      // Reiniciar el contador y la verificación automática
      restartAutoCheck();
      
    } catch (error) {
      console.error('Error reenviando correo:', error);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] via-[#414345] to-[#232526] p-4">
      <div className="relative w-full max-w-lg rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden animate-fade-in">
        {/* Glow decor */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-amber-400/40 to-orange-500/30 rounded-full blur-2xl z-0" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-500/20 rounded-full blur-2xl z-0" />
        <div className="relative z-10 p-10 flex flex-col items-center">
          {/* Icono principal */}
          <div className={`w-20 h-20 flex items-center justify-center rounded-full shadow-xl mb-6 transition-all duration-500 ${isVerified ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
            {isVerified ? (
              <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
            ) : (
              <Mail className="w-12 h-12 text-white drop-shadow-lg animate-bounce-slow" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 font-display">
            {isVerified ? '¡Email Verificado!' : 'Verificación de Email'}
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-200 mb-6">
            {isVerified ?
              'Tu cuenta ha sido verificada exitosamente.' :
              <>Enviamos un correo de verificación a <br /><span className="font-semibold text-amber-700 dark:text-amber-400">{userEmail}</span></>
            }
          </p>

          {/* Contador y barra de progreso */}
          {!isVerified && isAutoChecking && (
            <div className="w-full bg-gradient-to-br from-blue-50/80 to-blue-100/60 border border-blue-200/60 rounded-2xl p-6 mb-8 flex flex-col items-center shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-7 h-7 text-blue-600" />
                <span className="font-semibold text-blue-800 text-lg">Tiempo restante</span>
              </div>
              <Countdown initialSeconds={120} />
              <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Mensaje de status */}
          {message && (
            <Alert className={`mb-6 w-full ${isVerified ? 'border-green-200 bg-green-50/80' : message.includes('Error') ? 'border-red-200 bg-red-50/80' : 'border-blue-200 bg-blue-50/80'}`}>
              {isVerified ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-blue-600" />
              )}
              <AlertDescription className={isVerified ? 'text-green-700 font-semibold' : 'text-blue-700'}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Instrucciones y acción */}
          {!isVerified && (
            <>
              <div className="w-full bg-gradient-to-br from-amber-50/80 to-orange-100/60 border border-amber-200/60 rounded-2xl p-5 mb-6 text-left shadow-sm">
                <h4 className="font-bold text-amber-800 mb-2 text-lg flex items-center gap-2"><Mail className="w-5 h-5" /> ¿Qué hacer ahora?</h4>
                <ul className="text-base text-amber-700 space-y-1 pl-2">
                  <li>• Revisa tu bandeja de entrada</li>
                  <li>• Busca el correo de "Tesoros del Chocó"</li>
                  <li>• Haz clic en el enlace de verificación</li>
                  <li>• La página se actualizará automáticamente</li>
                </ul>
              </div>
              <div className="w-full flex flex-col gap-3">
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending || (lastSent && Date.now() - lastSent.getTime() < 30000)}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-800 hover:bg-amber-100/80 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-md"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      Reenviar correo
                    </>
                  )}
                </Button>
              </div>
              <div className="mt-6 text-xs text-gray-500 bg-gray-50/80 p-3 rounded-lg w-full text-center">
                <p className="mb-1">💡 <strong>Tip:</strong> Revisa tu carpeta de spam si no ves el correo</p>
                <p>⏱️ <strong>Tiempo límite:</strong> 2 minutos</p>
              </div>
            </>
          )}

          {/* Mensaje de éxito */}
          {isVerified && (
            <div className="w-full space-y-4">
              <div className="bg-gradient-to-br from-green-50/80 to-green-100/60 border border-green-200/60 rounded-2xl p-5 text-center">
                <p className="text-green-700 font-bold text-lg">
                  ¡Perfecto! Tu email ha sido verificado exitosamente.
                </p>
                <p className="text-green-600 text-base mt-1">
                  Serás redirigido automáticamente en unos segundos...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
