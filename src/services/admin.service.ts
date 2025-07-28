import { apiClient } from '@/lib/api-client';
import { UserProfile } from '@/types/user.types';

export class AdminService {
  // Obtener todos los usuarios
  async getAllUsers(): Promise<UserProfile[]> {
    return await apiClient.get<UserProfile[]>('/admin/users', true);
  }

  // Aprobar solicitud de vendedor
  async approveUser(userId: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/approve`, {}, true);
  }

  // Rechazar solicitud de vendedor
  async rejectUser(userId: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/reject`, {}, true);
  }

  // Suspender usuario
  async suspendUser(userId: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/suspend`, {}, true);
  }

  // Reactivar usuario suspendido
  async reactivateUser(userId: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/reactivate`, {}, true);
  }

  // Obtener usuarios pendientes de aprobación
  async getPendingUsers(): Promise<UserProfile[]> {
    const users = await this.getAllUsers();
    return users.filter(user => user.role === 'seller' && !user.isApproved);
  }

  // Obtener estadísticas del sistema
  async getSystemStats(): Promise<{
    totalUsers: number;
    totalBuyers: number;
    totalSellers: number;
    pendingApprovals: number;
  }> {
    const users = await this.getAllUsers();
    
    return {
      totalUsers: users.length,
      totalBuyers: users.filter(u => u.role === 'buyer').length,
      totalSellers: users.filter(u => u.role === 'seller' && u.isApproved).length,
      pendingApprovals: users.filter(u => u.role === 'seller' && !u.isApproved).length
    };
  }
}

export const adminService = new AdminService();
