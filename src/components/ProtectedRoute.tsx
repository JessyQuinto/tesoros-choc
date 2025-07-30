import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireApproval?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireApproval = false,
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated, isEmailVerified } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log('🛡️ ProtectedRoute: Usuario no autenticado, redirigiendo a login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Si el email no está verificado, redirigir a verificación
  if (!isEmailVerified) {
    console.log('🛡️ ProtectedRoute: Email no verificado, redirigiendo a verificación');
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Si no hay usuario (aunque esté autenticado), redirigir al login
  if (!user) {
    console.log('🛡️ ProtectedRoute: No hay perfil de usuario, redirigiendo a login');
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Verificar rol requerido
  if (requiredRole && user.role !== requiredRole) {
    console.log(`🛡️ ProtectedRoute: Rol requerido ${requiredRole}, usuario tiene ${user.role}`);
    
    // Redirigir según el rol del usuario
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'seller':
        if (!user.isApproved) {
          return <Navigate to="/pending-approval" replace />;
        }
        return <Navigate to="/seller-dashboard" replace />;
      case 'buyer':
        return <Navigate to="/" replace />;
      default:
        return <Navigate to={fallbackPath} replace />;
    }
  }

  // Verificar aprobación si es requerida
  if (requireApproval && !user.isApproved) {
    console.log('🛡️ ProtectedRoute: Usuario no aprobado, redirigiendo a pending-approval');
    return <Navigate to="/pending-approval" replace />;
  }

  // Si es vendedor no aprobado, redirigir a pending-approval
  if (user.role === 'seller' && !user.isApproved) {
    console.log('🛡️ ProtectedRoute: Vendedor no aprobado, redirigiendo a pending-approval');
    return <Navigate to="/pending-approval" replace />;
  }

  // Todo está bien, mostrar el contenido
  console.log('🛡️ ProtectedRoute: Acceso permitido para', user.role);
  return <>{children}</>;
};

// Componentes específicos para diferentes tipos de rutas
export const AdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requiredRole="admin" fallbackPath="/login">
    {children}
  </ProtectedRoute>
);

export const SellerRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requiredRole="seller" requireApproval={true} fallbackPath="/login">
    {children}
  </ProtectedRoute>
);

export const BuyerRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute requiredRole="buyer" fallbackPath="/login">
    {children}
  </ProtectedRoute>
);

export const AuthenticatedRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute fallbackPath="/login">
    {children}
  </ProtectedRoute>
);