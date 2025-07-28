import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/config/firebase';
import { sendEmailVerification, reload } from 'firebase/auth';
import { Mail, RefreshCw, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const EmailVerification = () => {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already verified
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
    } catch (error) {
      setMessage('Error al reenviar el correo. Intenta más tarde.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!auth.currentUser) return;

    setIsChecking(true);
    setMessage('');

    try {
      await reload(auth.currentUser);
      
      if (auth.currentUser.emailVerified) {
        setMessage('¡Email verificado exitosamente! Redirigiendo...');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setMessage('Email aún no verificado. Revisa tu bandeja de entrada y spam.');
      }
    } catch (error) {
      setMessage('Error al verificar el estado. Intenta más tarde.');
    } finally {
      setIsChecking(false);
    }
  };

  const userEmail = auth.currentUser?.email || user?.email || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-primary rounded-2xl flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-blue-600">Verifica tu Email</CardTitle>
            <CardDescription>Confirma tu dirección de correo electrónico</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Email de verificación enviado</h3>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              Hemos enviado un correo de verificación a:
            </p>
            <p className="font-medium text-blue-800 mt-1">{userEmail}</p>
          </div>

          {message && (
            <Alert variant={message.includes('Error') ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h4 className="font-medium text-sm">Pasos a seguir:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <span>Revisa tu bandeja de entrada</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <span>Busca el correo de "Tesoros del Chocó"</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <span>Haz clic en el enlace de verificación</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-medium text-primary">4</span>
                </div>
                <span>Regresa aquí y verifica tu estado</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleCheckVerification}
              disabled={isChecking}
              className="w-full"
            >
              {isChecking && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              {isChecking ? 'Verificando...' : 'Ya verifiqué mi email'}
            </Button>

            <Button 
              onClick={handleResendEmail}
              disabled={isResending || (lastSent && Date.now() - lastSent.getTime() < 30000)}
              variant="outline"
              className="w-full"
            >
              {isResending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              {isResending ? 'Reenviando...' : 'Reenviar correo'}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            ¿No recibes el correo? Revisa tu carpeta de spam o correo no deseado.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
