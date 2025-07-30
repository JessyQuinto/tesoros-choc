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
  isAuthenticated: boolean;
  isEmailVerified: boolean;
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
      console.log('🔄 AuthContext: Cambio de estado de autenticación:', firebaseUser?.email);
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          // Verificar si el email está verificado
          if (!firebaseUser.emailVerified) {
            console.log('⚠️ AuthContext: Usuario no verificado');
            setUser(null);
            setIsLoading(false);
            return;
          }

          console.log('✅ AuthContext: Usuario verificado, obteniendo perfil');
          // Usuario autenticado - verificar token con backend y obtener perfil
          const userProfile = await authService.verifyTokenAndGetProfile();
          
          if (userProfile) {
            console.log('✅ AuthContext: Perfil obtenido:', userProfile.email);
            setUser(userProfile);
          } else {
            console.log('⚠️ AuthContext: No se pudo obtener perfil, creando básico');
            // Crear perfil básico si no existe en backend
            const basicProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuario',
              role: 'buyer',
              isApproved: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setUser(basicProfile);
          }
        } catch (err) {
          console.error('❌ AuthContext: Error obteniendo perfil del backend:', err);
          setUser(null);
        }
      } else {
        console.log('❌ AuthContext: No hay usuario autenticado');
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 AuthContext: Iniciando login para:', email);
      setIsLoading(true);
      setError(null);
      
      const userProfile = await authService.login(email, password);
      console.log('✅ AuthContext: Login exitoso:', userProfile.email);
      setUser(userProfile);
    } catch (err: unknown) {
      console.error('❌ AuthContext: Error en login:', err);
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
      
      // No establecer el usuario aquí porque necesita verificar email primero
      console.log('ℹ️ AuthContext: Usuario registrado pero requiere verificación de email');
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
      console.log('🚀 AuthContext: Iniciando logout');
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      console.log('✅ AuthContext: Logout exitoso');
    } catch (err: unknown) {
      console.error('❌ AuthContext: Error en logout:', err);
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
    isAuthenticated: authService.isAuthenticated(),
    isEmailVerified: authService.isEmailVerified(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};