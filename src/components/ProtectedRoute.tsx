import { ReactNode } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/Layout/Header';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackMessage?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles, 
  fallbackMessage = "No tienes permisos para acceder a esta página." 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-choco-orange"></div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Debes iniciar sesión para acceder a esta página.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User doesn't have required role
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>{fallbackMessage}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Tu rol actual: {user.role === 'buyer' ? 'Comprador' : 
                               user.role === 'seller' ? 'Vendedor' : 'Administrador'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User has required role - render the protected content
  return <>{children}</>;
};
