export interface CartItem {
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sellerId: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface CheckoutRequest {
  shippingAddress: string;
}
