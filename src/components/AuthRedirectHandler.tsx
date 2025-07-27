import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthRedirectHandlerProps {
  children: React.ReactNode;
}

export const AuthRedirectHandler = ({ children }: AuthRedirectHandlerProps) => {
  const { user, firebaseUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // No hacer nada si aún está cargando
    if (isLoading) return;

    // Si el usuario está autenticado con Firebase pero necesita seleccionar rol
    if (firebaseUser && user?.needsRoleSelection) {
      // Solo redireccionar si no está ya en la página de completar perfil
      if (location.pathname !== '/complete-profile') {
        navigate('/complete-profile', { replace: true });
      }
    }
  }, [user, firebaseUser, isLoading, navigate, location.pathname]);

  return <>{children}</>;
};
