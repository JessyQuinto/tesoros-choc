import { createContext, useContext, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'pending_vendor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
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
  const logout = () => {
    // Mock logout functionality
    console.log('Logout called');
  };

  const updateUser = (user: UserProfile) => {
    // Mock update user functionality
    console.log('Update user called:', user);
  };

  const value: AuthContextType = {
    user: {
      id: '1',
      email: 'demo@example.com',
      name: 'Usuario Demo',
      role: 'buyer',
      isApproved: true,
    },
    isLoading: false,
    error: null,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};