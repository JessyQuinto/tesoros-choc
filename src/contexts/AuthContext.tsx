import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users database
  const mockUsers = [
    {
      id: '1',
      email: 'admin@tesoroschoco.com',
      password: 'admin123',
      name: 'Administrator',
      role: 'admin' as UserRole,
      isApproved: true
    },
    {
      id: '2',
      email: 'comprador@test.com',
      password: 'buyer123',
      name: 'María González',
      role: 'buyer' as UserRole,
      isApproved: true
    },
    {
      id: '3',
      email: 'vendedor@test.com',
      password: 'seller123',
      name: 'Carlos Mosquera',
      role: 'seller' as UserRole,
      isApproved: true
    }
  ];

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('tesorosChoco_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        isApproved: foundUser.isApproved
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('tesorosChoco_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      name,
      role,
      isApproved: role === 'buyer' // Buyers are auto-approved, sellers need approval
    };
    
    mockUsers.push({ ...newUser, password });
    
    setUser(newUser);
    localStorage.setItem('tesorosChoco_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tesorosChoco_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};