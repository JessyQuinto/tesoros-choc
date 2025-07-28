// Simplified admin service without Firebase dependency
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin' | 'pending_vendor';
  isApproved: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AdminService {
  async getAllUsers(): Promise<UserProfile[]> {
    // Mock data for demonstration
    return [
      {
        id: '1',
        email: 'admin@tesoroschoco.com',
        name: 'Administrador',
        role: 'admin',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        email: 'comprador@test.com',
        name: 'Comprador Prueba',
        role: 'buyer',
        isApproved: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  async approveUser(userId: string): Promise<void> {
    console.log(`Approving user: ${userId}`);
  }

  async rejectUser(userId: string): Promise<void> {
    console.log(`Rejecting user: ${userId}`);
  }

  async updateUserRole(userId: string, role: UserProfile['role']): Promise<void> {
    console.log(`Updating user ${userId} role to: ${role}`);
  }

  async deleteUser(userId: string): Promise<void> {
    console.log(`Deleting user: ${userId}`);
  }
}

export const adminService = new AdminService();