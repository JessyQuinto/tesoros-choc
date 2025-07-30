import { apiClient } from '@/lib/api-client';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/product.types';
import { Order } from '@/types/order.types';

export class SellerService {
  // ===== ENDPOINTS DE PRODUCTOS =====

  // Obtener todos los productos del vendedor
  async getProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>('/seller/products', true);
  }

  // Obtener un producto específico del vendedor
  async getProduct(id: string): Promise<Product> {
    return await apiClient.get<Product>(`/seller/products/${id}`, true);
  }

  // Crear un nuevo producto
  async createProduct(product: ProductCreateRequest): Promise<Product> {
    return await apiClient.post<Product>('/seller/products', product as unknown as Record<string, unknown>, true);
  }

  // Actualizar un producto existente
  async updateProduct(id: string, updates: ProductUpdateRequest): Promise<void> {
    await apiClient.put<void>(`/seller/products/${id}`, updates as unknown as Record<string, unknown>, true);
  }

  // Eliminar un producto
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete<void>(`/seller/products/${id}`, true);
  }

  // Activar/desactivar un producto
  async toggleProductStatus(id: string): Promise<{ isActive: boolean }> {
    return await apiClient.put<{ isActive: boolean }>(`/seller/products/${id}/toggle`, {}, true);
  }

  // ===== ENDPOINTS DE ÓRDENES =====

  // Obtener todas las órdenes del vendedor
  async getOrders(): Promise<Order[]> {
    return await apiClient.get<Order[]>('/seller/orders', true);
  }

  // Obtener una orden específica del vendedor
  async getOrder(id: string): Promise<Order> {
    return await apiClient.get<Order>(`/seller/orders/${id}`, true);
  }

  // Actualizar el estado de una orden
  async updateOrderStatus(
    orderId: string, 
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber?: string,
    notes?: string
  ): Promise<void> {
    await apiClient.put<void>(`/seller/orders/${orderId}/status`, {
      status,
      trackingNumber,
      notes
    }, true);
  }
}

export const sellerService = new SellerService(); 