import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { authService, RegisterData } from '@/services/auth.service';
import { UserProfile } from '@/types/user.types';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          // Usuario autenticado - verificar token con backend y obtener perfil
          const userProfile = await authService.verifyTokenAndGetProfile();
          setUser(userProfile);
        } catch (err) {
          console.error('Error obteniendo perfil del backend:', err);
          setUser(null);
        }
      } else {
        // Usuario no autenticado o email no verificado
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userProfile = await authService.login(email, password);
      setUser(userProfile);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      console.log('🚀 AuthContext: Iniciando registro con datos:', data);
      setIsLoading(true);
      setError(null);
      
      const userProfile = await authService.register(data);
      console.log('✅ AuthContext: Registro exitoso, perfil recibido:', userProfile);
      
      setUser(userProfile);
    } catch (err: unknown) {
      console.error('❌ AuthContext: Error en registro:', err);
      const error = err as { message?: string };
      setError(error.message || 'Error desconocido en registro');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};