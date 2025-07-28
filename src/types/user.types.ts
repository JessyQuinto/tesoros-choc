export type UserRole = 'buyer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  avatar?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  bio?: string;
  createdAt: string;
  updatedAt?: string;
}

// Re-export for backward compatibility
export type { UserRole as UserRoleType };