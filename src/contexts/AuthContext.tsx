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
  const value: AuthContextType = {
    user: null,
    isLoading: false,
    error: null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};