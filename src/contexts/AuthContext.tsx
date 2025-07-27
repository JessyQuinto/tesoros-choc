import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { authService, AuthUser, RegisterData, LoginData, UpdateProfileData } from '../services/auth.service';
import { userRepository, UserProfile } from '../services/UserRepository';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: UserProfile | null;
  authUser: AuthUser | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: UpdateProfileData & { role?: 'buyer' | 'seller', needsRoleSelection?: boolean }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  needsRoleSelection: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const clearError = useCallback(() => setError(null), []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const userProfile = await userRepository.getUserProfile();
      setUser(userProfile);
      if (userProfile.needsRoleSelection) {
        setNeedsRoleSelection(true);
        navigate('/select-role', { replace: true });
      } else {
        setNeedsRoleSelection(false);
      }
      return userProfile;
    } catch (apiError: any) {
      if (apiError.message.includes('Usuario no encontrado')) {
        setNeedsRoleSelection(true);
        setUser(null);
        navigate('/select-role', { replace: true });
      } else {
        setError('No se pudo cargar el perfil del usuario.');
        setUser(null);
      }
      throw apiError;
    }
  }, [navigate]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = authService.onAuthStateChanged(async (currentAuthUser) => {
      setAuthUser(currentAuthUser);
      if (currentAuthUser) {
        try {
          await fetchUserProfile();
        } catch (e) {
            // Error ya manejado en fetchUserProfile
        }
      } else {
        setUser(null);
        setNeedsRoleSelection(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const performAuthAction = async (action: () => Promise<any>, successMessage?: string) => {
    setIsLoading(true);
    clearError();
    try {
      await action();
      // El listener onAuthStateChanged se encargará del resto
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error desconocido.');
      setIsLoading(false); // Detener la carga en caso de error
      throw err; // Relanzar para que el componente que llama pueda manejarlo si es necesario
    }
  };

  const login = (data: LoginData) => performAuthAction(() => authService.login(data));
  const register = (data: RegisterData) => performAuthAction(() => authService.register(data));
  const loginWithGoogle = () => performAuthAction(() => authService.loginWithGoogle());
  
  const logout = async () => {
    setIsLoading(true);
    try {
        await authService.logout();
        setUser(null);
        setAuthUser(null);
        setNeedsRoleSelection(false);
        navigate('/auth');
    } catch(err: any) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: UpdateProfileData & { role?: 'buyer' | 'seller', needsRoleSelection?: boolean }) => {
    await performAuthAction(async () => {
        await userRepository.updateUserProfile(data);
        await fetchUserProfile(); // Refrescar perfil
    });
  };

  const value: AuthContextType = {
    user,
    authUser,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserProfile,
    isLoading,
    error,
    clearError,
    needsRoleSelection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
