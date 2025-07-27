import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner'; // Suponiendo que tienes un spinner

export function RoleSelectionRoute({ children }: { children: JSX.Element }) {
  const { firebaseUser, user, isLoading, needsRoleSelection } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Si el usuario ya tiene un rol (incluso si needsRoleSelection es true temporalmente)
  // lo redirigimos. Esto evita que un usuario existente acceda a la selección de rol.
  if (user && !needsRoleSelection) {
     return <Navigate to="/" replace />;
  }

  // Permite el acceso solo si el usuario está autenticado y necesita seleccionar un rol
  return children;
}
