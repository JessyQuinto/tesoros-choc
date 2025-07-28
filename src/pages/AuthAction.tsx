import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  applyActionCode, 
  checkActionCode, 
  confirmPasswordReset, 
  verifyPasswordResetCode 
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface ActionData {
  email: string;
}

const AuthAction: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionData, setActionData] = useState<ActionData | null>(null);
  
  // For password reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  const handleEmailVerification = useCallback(async () => {
    if (!oobCode) throw new Error('Código de verificación faltante');
    
    await applyActionCode(auth, oobCode);
    setSuccess('¡Email verificado exitosamente! Ahora puedes iniciar sesión.');
    
    toast({
      title: "Email verificado",
      description: "Tu dirección de email ha sido verificada exitosamente.",
    });

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  }, [oobCode, toast, navigate]);

  const handlePasswordResetVerification = useCallback(async () => {
    if (!oobCode) throw new Error('Código de restablecimiento faltante');
    
    // Verify the code is valid and get the email
    const email = await verifyPasswordResetCode(auth, oobCode);
    setActionData({ email });
    setSuccess('Código válido. Ahora puedes establecer tu nueva contraseña.');
  }, [oobCode]);

  const handleEmailRecovery = useCallback(async () => {
    if (!oobCode) throw new Error('Código de recuperación faltante');
    
    const info = await checkActionCode(auth, oobCode);
    await applyActionCode(auth, oobCode);
    
    setSuccess(`Email recuperado exitosamente. Tu email ha sido restaurado a: ${info.data.email}`);
    
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  }, [oobCode, navigate]);

  const handleAuthAction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      switch (mode) {
        case 'verifyEmail':
          await handleEmailVerification();
          break;
        case 'resetPassword':
          await handlePasswordResetVerification();
          break;
        case 'recoverEmail':
          await handleEmailRecovery();
          break;
        default:
          throw new Error('Modo de acción no reconocido.');
      }
    } catch (err: unknown) {
      console.error('Error handling auth action:', err);
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
    } finally {
      setLoading(false);
    }
  }, [mode, handleEmailVerification, handlePasswordResetVerification, handleEmailRecovery]);

  useEffect(() => {
    if (!mode || !oobCode) {
      setError('Enlace de acción inválido o incompleto.');
      setLoading(false);
      return;
    }

    handleAuthAction();
  }, [mode, oobCode, handleAuthAction]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setResetLoading(true);
      setError(null);

      if (!oobCode) throw new Error('Código de restablecimiento faltante');
      
      await confirmPasswordReset(auth, oobCode, newPassword);
      
      setSuccess('¡Contraseña restablecida exitosamente! Redirigiendo al inicio de sesión...');
      
      toast({
        title: "Contraseña restablecida",
        description: "Tu contraseña ha sido actualizada exitosamente.",
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: unknown) {
      console.error('Error resetting password:', err);
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
    } finally {
      setResetLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/expired-action-code':
        return 'El enlace ha expirado. Por favor, solicita uno nuevo.';
      case 'auth/invalid-action-code':
        return 'El enlace es inválido o ya ha sido utilizado.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/user-not-found':
        return 'No se encontró una cuenta asociada con este email.';
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.';
      default:
        return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Procesando solicitud...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/login')} className="w-full">
            Ir al inicio de sesión
          </Button>
        </div>
      );
    }

    if (success) {
      return (
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
          {mode === 'resetPassword' && actionData && !newPassword && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={actionData.email}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ingresa tu nueva contraseña"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={resetLoading || !newPassword || !confirmPassword}
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando contraseña...
                  </>
                ) : (
                  'Actualizar contraseña'
                )}
              </Button>
            </form>
          )}
        </div>
      );
    }

    return null;
  };

  const getTitle = () => {
    switch (mode) {
      case 'verifyEmail':
        return 'Verificación de Email';
      case 'resetPassword':
        return 'Restablecer Contraseña';
      case 'recoverEmail':
        return 'Recuperación de Email';
      default:
        return 'Acción de Autenticación';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'verifyEmail':
        return 'Verificando tu dirección de email...';
      case 'resetPassword':
        return 'Establece tu nueva contraseña';
      case 'recoverEmail':
        return 'Recuperando tu dirección de email...';
      default:
        return 'Procesando acción de autenticación...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {getTitle()}
            </CardTitle>
            <CardDescription>
              {getDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthAction;
