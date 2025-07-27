import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-skeleton';

// Componente para estados de carga de datos
export const DataLoadingState = ({ 
  message = "Cargando...",
  size = "default" 
}: { 
  message?: string;
  size?: "sm" | "default" | "lg";
}) => {
  const sizeClasses = {
    sm: "h-20",
    default: "h-32",
    lg: "h-48"
  };

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} space-y-4`}>
      <LoadingSpinner size={size} />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
};

// Componente para estados de error
export const ErrorState = ({
  title = "Error",
  message = "Algo salió mal",
  onRetry,
  showRetry = true
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}) => (
  <Card className="max-w-md mx-auto">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <CardTitle className="text-red-900">{title}</CardTitle>
      <CardDescription>{message}</CardDescription>
    </CardHeader>
    {showRetry && onRetry && (
      <CardContent className="text-center">
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </CardContent>
    )}
  </Card>
);

// Componente para estados sin datos
export const EmptyState = ({
  title = "No hay datos",
  message = "No se encontraron elementos",
  action,
  icon: Icon = Wifi
}: {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="text-center py-12">
    <div className="mx-auto mb-4 w-12 h-12 bg-muted rounded-full flex items-center justify-center">
      <Icon className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-muted-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{message}</p>
    {action}
  </div>
);

// Componente para sin conexión
export const OfflineState = ({
  onRetry
}: {
  onRetry?: () => void;
}) => (
  <Card className="max-w-md mx-auto">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
        <WifiOff className="h-6 w-6 text-orange-600" />
      </div>
      <CardTitle className="text-orange-900">Sin conexión</CardTitle>
      <CardDescription>
        No hay conexión a internet. Verifica tu conexión e intenta nuevamente.
      </CardDescription>
    </CardHeader>
    {onRetry && (
      <CardContent className="text-center">
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Button>
      </CardContent>
    )}
  </Card>
);
