import { apiClient } from '@/lib/api-client';
import { CartItem, AddToCartRequest, Order, CheckoutRequest } from '@/types/order.types';

export class OrderService {
  // Agregar producto al carrito
  async addToCart(item: AddToCartRequest): Promise<void> {
    await apiClient.post<void>('/buyer/cart/add', item as unknown as Record<string, unknown>, true);
  }

  // Procesar compra (checkout)
  async checkout(request: CheckoutRequest): Promise<Order> {
    return await apiClient.post<Order>('/buyer/checkout', request as unknown as Record<string, unknown>, true);
  }

  // Obtener historial de órdenes del comprador
  async getBuyerOrders(): Promise<Order[]> {
    return await apiClient.get<Order[]>('/buyer/orders', true);
  }

  // Obtener órdenes del vendedor (productos vendidos)
  async getSellerOrders(): Promise<Order[]> {
    return await apiClient.get<Order[]>('/seller/orders', true);
  }
}

export const orderService = new OrderService();
