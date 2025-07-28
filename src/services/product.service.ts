import { apiClient } from '@/lib/api-client';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/product.types';

export class ProductService {
  // Endpoints públicos - obtener todos los productos
  async getAllProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>('/products', false);
  }

  // Obtener un producto específico por ID
  async getProductById(id: string): Promise<Product> {
    return await apiClient.get<Product>(`/products/${id}`, false);
  }

  // Endpoints de vendedor - obtener productos del vendedor actual
  async getSellerProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>('/seller/products', true);
  }

  // Crear un nuevo producto (solo vendedores)
  async createProduct(product: ProductCreateRequest): Promise<Product> {
    return await apiClient.post<Product>('/seller/products', product as unknown as Record<string, unknown>, true);
  }

  // Actualizar un producto existente (solo vendedores)
  async updateProduct(id: string, updates: ProductUpdateRequest): Promise<Product> {
    return await apiClient.put<Product>(`/seller/products/${id}`, updates as unknown as Record<string, unknown>, true);
  }

  // Buscar productos por categoría
  async getProductsByCategory(category: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(`/products?category=${encodeURIComponent(category)}`, false);
  }

  // Buscar productos por término de búsqueda
  async searchProducts(query: string): Promise<Product[]> {
    return await apiClient.get<Product[]>(`/products?search=${encodeURIComponent(query)}`, false);
  }
}

export const productService = new ProductService();
