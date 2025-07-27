import { apiClient } from '@/lib/api-client';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  isApproved: boolean;
  avatar: string | null;
  needsRoleSelection: boolean;
  createdAt: string;
  updatedAt: string;
}

class UserRepository {
  private baseUrl = '/auth';

  async getUserProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(`${this.baseUrl}/me`);
  }

  async registerUser(data: { name: string; role: 'buyer' | 'seller'; avatar?: string }): Promise<UserProfile> {
    return apiClient.post<UserProfile>(`${this.baseUrl}/register`, data);
  }

  async updateUserProfile(data: Partial<{ name: string; avatar: string; role: 'buyer' | 'seller'; needsRoleSelection: boolean }>): Promise<UserProfile> {
    return apiClient.put<UserProfile>(`${this.baseUrl}/profile`, data);
  }
}

export const userRepository = new UserRepository();
