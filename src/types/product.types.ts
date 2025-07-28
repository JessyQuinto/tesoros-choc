export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  sellerId: string;
  sellerName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

export interface ProductUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  images?: string[];
}
