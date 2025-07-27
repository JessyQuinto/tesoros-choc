import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface UseErrorHandlerReturn {
  error: ApiError | null;
  isError: boolean;
  clearError: () => void;
  handleError: (error: unknown) => void;
  withErrorHandling: <T>(asyncFn: () => Promise<T>) => Promise<T | null>;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setError] = useState<ApiError | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((error: unknown) => {
    let apiError: ApiError;

    if (error instanceof Error) {
      apiError = {
        message: error.message,
        code: 'CLIENT_ERROR'
      };
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      apiError = error as ApiError;
    } else if (typeof error === 'string') {
      apiError = {
        message: error,
        code: 'UNKNOWN_ERROR'
      };
    } else {
      apiError = {
        message: 'Ocurrió un error inesperado',
        code: 'UNKNOWN_ERROR'
      };
    }

    // Mensajes de error más amigables según el tipo
    switch (apiError.status) {
      case 400:
        apiError.message = 'Los datos enviados no son válidos';
        break;
      case 401:
        apiError.message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
        break;
      case 403:
        apiError.message = 'No tienes permisos para realizar esta acción';
        break;
      case 404:
        apiError.message = 'El recurso solicitado no fue encontrado';
        break;
      case 500:
        apiError.message = 'Error del servidor. Por favor, intenta más tarde';
        break;
      case 503:
        apiError.message = 'El servicio no está disponible temporalmente';
        break;
    }

    setError(apiError);
    
    // Mostrar toast para errores críticos
    if (apiError.status && apiError.status >= 400) {
      toast({
        title: "Error",
        description: apiError.message,
        variant: "destructive",
      });
    }

    console.error('Error handled:', apiError);
  }, [toast]);

  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T | null> => {
    try {
      clearError();
      return await asyncFn();
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [clearError, handleError]);

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
    withErrorHandling
  };
};

// Hook específico para operaciones de API
export const useApiCall = () => {
  const errorHandler = useErrorHandler();
  const [isLoading, setIsLoading] = useState(false);

  const apiCall = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options?: {
      showSuccessToast?: boolean;
      successMessage?: string;
      loadingMessage?: string;
    }
  ): Promise<T | null> => {
    setIsLoading(true);
    
    try {
      const result = await errorHandler.withErrorHandling(asyncFn);
      
      if (result && options?.showSuccessToast) {
        // Implementar toast de éxito si es necesario
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  }, [errorHandler]);

  return {
    ...errorHandler,
    isLoading,
    apiCall
  };
};
