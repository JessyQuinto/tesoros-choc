import { useState, useEffect, useCallback } from 'react';
import { orderService } from '@/services/order.service';
import { Order, AddToCartRequest, CheckoutRequest } from '@/types/order.types';

export const useOrders = (type: 'buyer' | 'seller') => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = type === 'buyer' 
        ? await orderService.getBuyerOrders()
        : await orderService.getSellerOrders();
      setOrders(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders
  };
};

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = async (item: AddToCartRequest) => {
    try {
      setLoading(true);
      setError(null);
      await orderService.addToCart(item);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (request: CheckoutRequest): Promise<Order> => {
    try {
      setLoading(true);
      setError(null);
      return await orderService.checkout(request);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToCart,
    checkout,
    loading,
    error
  };
};
