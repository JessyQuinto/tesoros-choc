import { createContext, useContext, useState, ReactNode } from 'react';
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
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    // Sin autenticación, usar localStorage
    try {
      setLoading(true);
      setError(null);
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      console.error('Error cargando carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToStorage = (cartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar si el producto ya existe en el carrito
      const existingItemIndex = items.findIndex(item => item.productId === productId);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Actualizar cantidad del producto existente
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Agregar nuevo producto
        const newItem: CartItem = {
          productId,
          quantity,
          addedAt: new Date().toISOString()
        };
        newItems = [...items, newItem];
      }
      
      setItems(newItems);
      saveCartToStorage(newItems);
      
      toast({
        title: "Producto agregado",
        description: "El producto se ha agregado al carrito exitosamente"
      });
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
    try {
      setLoading(true);
      setError(null);
      
      const newItems = items.filter(item => item.productId !== productId);
      setItems(newItems);
      saveCartToStorage(newItems);
      
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado del carrito"
      });
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
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const newItems = items.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      );
      
      setItems(newItems);
      saveCartToStorage(newItems);
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
    try {
      setLoading(true);
      setError(null);
      
      setItems([]);
      localStorage.removeItem('cart');
      
      toast({
        title: "Carrito vaciado",
        description: "El carrito se ha vaciado exitosamente"
      });
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