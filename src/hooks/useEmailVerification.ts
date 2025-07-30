import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/config/firebase';
import { reload } from 'firebase/auth';
import EmailService from '@/services/EmailService';

interface UseEmailVerificationOptions {
  /** Duración total de la verificación automática en segundos (default: 120 = 2 minutos) */
  totalDuration?: number;
  /** Intervalo entre verificaciones en milisegundos (default: 5000 = 5 segundos) */
  checkInterval?: number;
  /** Callback ejecutado cuando la verificación es exitosa */
  onVerificationSuccess?: () => void;
  /** Callback ejecutado cuando el tiempo expira */
  onTimeout?: () => void;
  /** Datos del usuario para el correo de bienvenida */
  userData?: {
    name: string;
    email: string;
    role: 'buyer' | 'seller';
    isApproved?: boolean;
  };
}

interface UseEmailVerificationReturn {
  /** Tiempo restante en segundos */
  timeLeft: number;
  /** Si la verificación automática está activa */
  isAutoChecking: boolean;
  /** Si el email ha sido verificado */
  isVerified: boolean;
  /** Progreso de 0 a 100 */
  progress: number;
  /** Función para detener la verificación automática */
  stopAutoCheck: () => void;
  /** Función para reiniciar la verificación automática */
  restartAutoCheck: () => void;
  /** Función para verificar manualmente */
  checkManually: () => Promise<boolean>;
  /** Formatear tiempo en formato MM:SS */
  formatTime: (seconds: number) => string;
}

export const useEmailVerification = (
  options: UseEmailVerificationOptions = {}
): UseEmailVerificationReturn => {
  const {
    totalDuration = 120, // 2 minutos
    checkInterval = 5000, // 5 segundos
    onVerificationSuccess,
    onTimeout,
    userData
  } = options;

  const [timeLeft, setTimeLeft] = useState(totalDuration);
  const [isAutoChecking, setIsAutoChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [checkIntervalId, setCheckIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [countdownIntervalId, setCountdownIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Función para verificar el estado del email - memoizada para evitar re-renders
  const checkEmailVerification = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser || isVerified) return false;

    try {
      await reload(auth.currentUser);
      
      if (auth.currentUser.emailVerified) {
        setIsVerified(true);
        setIsAutoChecking(false);
        
        // Limpiar intervalos
        if (checkIntervalId) clearInterval(checkIntervalId);
        if (countdownIntervalId) clearInterval(countdownIntervalId);
        
        // NO enviar correo de bienvenida automáticamente para evitar bucles
        // El correo de bienvenida se enviará desde el backend cuando se verifique el token
        
        // Ejecutar callback de éxito
        onVerificationSuccess?.();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al verificar email:', error);
      return false;
    }
  }, [isVerified, checkIntervalId, countdownIntervalId, onVerificationSuccess]);

  // Función para limpiar intervalos
  const clearIntervals = useCallback(() => {
    if (checkIntervalId) {
      clearInterval(checkIntervalId);
      setCheckIntervalId(null);
    }
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
      setCountdownIntervalId(null);
    }
  }, [checkIntervalId, countdownIntervalId]);

  // Función para detener la verificación automática
  const stopAutoCheck = useCallback(() => {
    setIsAutoChecking(false);
    clearIntervals();
  }, [clearIntervals]);

  // Función para reiniciar la verificación automática
  const restartAutoCheck = useCallback(() => {
    if (isVerified) return;
    
    setTimeLeft(totalDuration);
    setIsAutoChecking(true);
    clearIntervals();
    
    // Verificar inmediatamente
    checkEmailVerification();
    
    // Configurar nuevo intervalo de verificación
    const newCheckInterval = setInterval(checkEmailVerification, checkInterval);
    setCheckIntervalId(newCheckInterval);
    
    // Configurar nuevo countdown
    const newCountdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsAutoChecking(false);
          clearInterval(newCheckInterval);
          clearInterval(newCountdown);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setCountdownIntervalId(newCountdown);
  }, [isVerified, totalDuration, clearIntervals, checkEmailVerification, checkInterval, onTimeout]);

  // Función para verificar manualmente
  const checkManually = useCallback(async (): Promise<boolean> => {
    return await checkEmailVerification();
  }, [checkEmailVerification]);

  // Función para formatear tiempo
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Inicializar verificación automática - SOLO UNA VEZ al montar el componente
  useEffect(() => {
    if (!auth.currentUser || isVerified || !isAutoChecking) return;

    // Verificar inmediatamente si ya está verificado
    checkEmailVerification();

    // Configurar verificación automática
    const newCheckInterval = setInterval(checkEmailVerification, checkInterval);
    setCheckIntervalId(newCheckInterval);

    // Configurar countdown
    const newCountdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsAutoChecking(false);
          clearInterval(newCheckInterval);
          clearInterval(newCountdown);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setCountdownIntervalId(newCountdown);

    return () => {
      clearInterval(newCheckInterval);
      clearInterval(newCountdown);
    };
  }, []); // Solo se ejecuta al montar el componente

  // Limpiar intervalos al desmontar
  useEffect(() => {
    return () => {
      clearIntervals();
    };
  }, [clearIntervals]);

  // Calcular progreso
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  return {
    timeLeft,
    isAutoChecking,
    isVerified,
    progress,
    stopAutoCheck,
    restartAutoCheck,
    checkManually,
    formatTime
  };
};
