import { apiClient } from '@/lib/api-client';
import { UserProfile } from '@/types/user.types';
import { Product } from '@/types/product.types';

export interface SystemStats {
  totalUsers: number;
  totalProducts: number;
  pendingSellers: number;
  reportedProducts: number;
  activeProducts: number;
  suspendedUsers: number;
}

export class AdminService {
  // ===== ENDPOINTS DE GESTIÓN DE USUARIOS =====

  // Obtener todos los usuarios
  async getUsers(): Promise<UserProfile[]> {
    return await apiClient.get<UserProfile[]>('/admin/users', true);
  }

  // Obtener vendedores pendientes de aprobación
  async getPendingSellers(): Promise<UserProfile[]> {
    return await apiClient.get<UserProfile[]>('/admin/pending-sellers', true);
  }

  // Aprobar vendedor
  async approveSeller(sellerId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/sellers/${sellerId}/approve`, { reason }, true);
  }

  // Rechazar vendedor
  async rejectSeller(sellerId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/sellers/${sellerId}/reject`, { reason }, true);
  }

  // Suspender usuario
  async suspendUser(userId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/suspend`, { reason }, true);
  }

  // Reactivar usuario
  async reactivateUser(userId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/users/${userId}/reactivate`, { reason }, true);
  }

  // ===== ENDPOINTS DE MODERACIÓN DE PRODUCTOS =====

  // Obtener productos reportados
  async getReportedProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>('/admin/reported-products', true);
  }

  // Aprobar producto
  async approveProduct(productId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/products/${productId}/approve`, { reason }, true);
  }

  // Rechazar producto
  async rejectProduct(productId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/products/${productId}/reject`, { reason }, true);
  }

  // Suspender producto
  async suspendProduct(productId: string, reason?: string): Promise<void> {
    await apiClient.put<void>(`/admin/products/${productId}/suspend`, { reason }, true);
  }

  // ===== ENDPOINTS DE ESTADÍSTICAS =====

  // Obtener estadísticas del sistema
  async getSystemStats(): Promise<SystemStats> {
    return await apiClient.get<SystemStats>('/admin/stats', true);
  }
}

export const adminService = new AdminService();
