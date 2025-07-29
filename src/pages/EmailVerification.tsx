import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md border border-amber-200/50">
        <div className="text-center">
          {/* Logo/Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            {isVerified ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Mail className="w-8 h-8 text-white" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isVerified ? '¡Email Verificado!' : 'Verificación de Email'}
          </h1>

          <p className="text-gray-600 mb-6">
            {isVerified ? 
              'Tu cuenta ha sido verificada exitosamente' :
              <>Enviamos un correo de verificación a <br /><span className="font-semibold text-amber-700">{userEmail}</span></>
            }
          </p>

          {/* Contador regresivo claro */}
          {!isVerified && isAutoChecking && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Verificación automática</h3>
              </div>
              
              {/* Contador regresivo grande y claro */}
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-700 mb-2 font-mono">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-blue-600 mb-4">
                  Tiempo restante para verificación automática
                </p>
                
                {/* Barra de progreso */}
                <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-blue-500">
                  Revisando automáticamente tu email
                </p>
              </div>
            </div>
          )}

          {/* Mensaje de status */}
          {message && (
            <Alert className={`mb-6 ${isVerified ? 'border-green-200 bg-green-50' : message.includes('Error') ? 'border-red-200 bg-red-50' : ''}`}>
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
              {/* Información del email */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-semibold text-amber-800 mb-2">📧 ¿Qué hacer ahora?</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Revisa tu bandeja de entrada</li>
                  <li>• Busca el correo de "Tesoros del Chocó"</li>
                  <li>• Haz clic en el enlace de verificación</li>
                  <li>• La página se actualizará automáticamente</li>
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button 
                  onClick={handleManualCheck}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Verificar ahora
                </Button>

                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending || (lastSent && Date.now() - lastSent.getTime() < 30000)}
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Reenviar correo
                    </>
                  )}
                </Button>
              </div>

              {/* Ayuda */}
              <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p className="mb-1">💡 <strong>Tip:</strong> Revisa tu carpeta de spam si no ves el correo</p>
                <p>⏱️ <strong>Tiempo límite:</strong> 2 minutos de verificación automática</p>
              </div>
            </>
          )}

          {isVerified && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700 font-medium">
                  ¡Perfecto! Tu email ha sido verificado exitosamente.
                </p>
                <p className="text-green-600 text-sm mt-1">
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
