import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/user.types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireApproval?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiredRole,
  requireApproval = false 
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user role matches required role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Check if approval is required and user is not approved
  if (requireApproval && !user.isApproved) {
    if (user.role === 'pending_vendor') {
      return <Navigate to="/pending-approval" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check for pending vendor trying to access seller features
  if (user.role === 'pending_vendor' && requiredRole === 'seller') {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};