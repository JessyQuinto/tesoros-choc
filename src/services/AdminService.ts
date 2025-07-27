import { apiClient } from '@/lib/api-client';
import { UserProfile } from './UserRepository';

export type AdminUserView = Pick<UserProfile, 'id' | 'name' | 'email' | 'role' | 'isApproved'>;

class AdminService {
  private baseUrl = '/admin';

  async getAllUsers(): Promise<AdminUserView[]> {
    return apiClient.get<AdminUserView[]>(`${this.baseUrl}/users`);
  }

  async updateUser(userId: string, data: { role?: 'buyer' | 'seller' | 'admin'; isApproved?: boolean }): Promise<AdminUserView> {
    return apiClient.put<AdminUserView>(`${this.baseUrl}/users/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/users/${userId}`);
  }
}

export const adminService = new AdminService();
