/**
 * Shared Admin Layout Component
 * Provides consistent layout for all admin pages
 */

import React from 'react';
import { Header, Footer, Card, CardContent } from '@/lib/shared-imports';
import { useAdminAccess } from '@/lib/admin-utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Panel Administrativo",
  description 
}) => {
  const { isAdmin } = useAdminAccess();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para administradores.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {(title || description) && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        
        {children}
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLayout;
