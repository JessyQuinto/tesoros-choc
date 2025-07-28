import { useState, useEffect } from 'react';
import { productService } from '@/services/product.service';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/product.types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.searchProducts(query);
      setProducts(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProductsByCategory(category);
      setProducts(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
    getProductsByCategory,
    refetch: fetchProducts
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useSellerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSellerProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getSellerProducts();
      setProducts(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: ProductCreateRequest) => {
    try {
      setError(null);
      const newProduct = await productService.createProduct(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  const updateProduct = async (id: string, updates: ProductUpdateRequest) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    refetch: fetchSellerProducts
  };
};
