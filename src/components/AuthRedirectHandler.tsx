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
      return;
    }

    // Si el usuario está autenticado y tiene un rol, redirigir según el rol
    if (user && !user.needsRoleSelection) {
      const publicRoutes = ['/', '/products', '/about', '/auth', '/login', '/register'];
      const isOnPublicRoute = publicRoutes.includes(location.pathname);
      
      // Si está en una ruta pública o ya en su dashboard correcto, no redirigir
      if (isOnPublicRoute) return;
      
      // Redireccionar según el rol después del login/registro exitoso
      if (location.pathname === '/auth' || location.pathname === '/login' || location.pathname === '/register') {
        switch (user.role) {
          case 'buyer':
            navigate('/buyer-dashboard', { replace: true });
            break;
          case 'seller':
            navigate('/seller-dashboard', { replace: true });
            break;
          case 'pending_vendor':
            navigate('/pending-approval', { replace: true });
            break;
          case 'admin':
            navigate('/admin-dashboard', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }
    }
  }, [user, firebaseUser, isLoading, navigate, location.pathname]);

  return <>{children}</>;
};
