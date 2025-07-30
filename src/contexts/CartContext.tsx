import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    sellerName?: string;
    maxStock: number;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar carrito desde el backend cuando el usuario se autentica
  useEffect(() => {
    if (user?.role === 'buyer') {
      refreshCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user || user.role !== 'buyer') return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<CartItem[]>('/buyer/cart', true);
      setItems(response);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!user || user.role !== 'buyer') {
      toast({
        title: "Error",
        description: "Debes iniciar sesión como comprador para agregar productos al carrito",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.post('/buyer/cart/add', { productId, quantity }, true);
      
      toast({
        title: "Producto agregado",
        description: "El producto se ha agregado al carrito exitosamente"
      });
      
      // Refrescar el carrito para obtener los datos actualizados
      await refreshCart();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Error al agregar producto al carrito",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user || user.role !== 'buyer') return;

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.delete(`/buyer/cart/${productId}`, true);
      
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado del carrito"
      });
      
      await refreshCart();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar producto del carrito",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user || user.role !== 'buyer') return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.put(`/buyer/cart/${productId}`, { quantity }, true);
      
      await refreshCart();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Error al actualizar cantidad",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user || user.role !== 'buyer') return;

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.delete('/buyer/cart', true);
      
      toast({
        title: "Carrito vaciado",
        description: "El carrito se ha vaciado exitosamente"
      });
      
      setItems([]);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      toast({
        title: "Error",
        description: error.message || "Error al vaciar el carrito",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const value = {
    items,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};