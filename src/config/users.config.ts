export type UserRole = 'buyer' | 'seller' | 'admin' | 'pending_vendor';

export interface PredefinedAccount {
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
}

export const USER_CONFIG = {
  // Cuentas predefinidas del sistema
  PREDEFINED_ACCOUNTS: [
    {
      email: 'admin@tesoroschoco.com',
      name: 'Administrador Principal',
      role: 'admin' as UserRole,
      isApproved: true
    },
    {
      email: 'quintojessy@gmail.com',
      name: 'Jessy Quinto',
      role: 'admin' as UserRole,
      isApproved: true
    },
    {
      email: 'vendedor@test.com',
      name: 'Usuario Vendedor',
      role: 'seller' as UserRole,
      isApproved: true
    },
    {
      email: 'comprador@test.com',
      name: 'Usuario Comprador',
      role: 'buyer' as UserRole,
      isApproved: true
    }
  ] as const,

  // Configuración por defecto para nuevos usuarios
  DEFAULT_NEW_USER_ROLE: 'buyer' as UserRole,
  SELLER_REQUIRES_APPROVAL: true, // Los sellers nuevos requieren aprobación
  BUYER_AUTO_APPROVED: true,       // Los buyers se aprueban automáticamente

  // Configuración de backend
  BACKEND_ENDPOINTS: {
    USER_PROFILE: '/api/auth/me',
    USER_REGISTER: '/api/auth/register',
    USER_UPDATE: '/api/auth/profile'
  }
} as const;

// Helper para buscar cuenta predefinida
export const findPredefinedAccount = (email: string): PredefinedAccount | null => {
  const normalizedEmail = email.toLowerCase().trim();
  return USER_CONFIG.PREDEFINED_ACCOUNTS.find(
    account => account.email.toLowerCase() === normalizedEmail
  ) || null;
};

// Helper para verificar si es cuenta predefinida
export const isPredefinedAccount = (email: string): boolean => {
  return findPredefinedAccount(email) !== null;
};
