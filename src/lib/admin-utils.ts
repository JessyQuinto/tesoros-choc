/**
 * Common admin utilities and hooks
 * Shared functionality for admin pages
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface AdminPageProps {
  title: string;
  description?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
  total: number;
}

export interface FilterOptions {
  search: string;
  status: string;
  category: string;
}

// Common admin access control hook
export const useAdminAccess = () => {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const requireAdmin = useCallback(() => {
    if (!isAdmin) {
      throw new Error('Acceso denegado. Esta área está reservada para administradores.');
    }
  }, [isAdmin]);

  return { isAdmin, requireAdmin };
};

// Common data management hook
export const useDataManagement = <T extends { id: string }>(initialData: T[] = []) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item]);
    toast({
      title: "Elemento agregado",
      description: "El elemento se ha agregado correctamente."
    });
  }, [toast]);

  const updateItem = useCallback((id: string, updatedItem: Partial<T>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
    toast({
      title: "Elemento actualizado",
      description: "Los cambios se han guardado correctamente."
    });
  }, [toast]);

  const deleteItem = useCallback((id: string) => {
    setData(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Elemento eliminado",
      description: "El elemento se ha eliminado correctamente."
    });
  }, [toast]);

  return {
    data,
    setData,
    loading,
    setLoading,
    addItem,
    updateItem,
    deleteItem
  };
};

// Common filtering hook
export const useFiltering = <T extends { status?: string; category?: string }>(
  data: T[], 
  searchFields: (keyof T)[]
) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    category: 'all'
  });

  const filteredData = data.filter(item => {
    const matchesSearch = searchFields.some(field => 
      String(item[field]).toLowerCase().includes(filters.search.toLowerCase())
    );
    
    const matchesStatus = filters.status === 'all' || 
      item.status === filters.status;
    
    const matchesCategory = filters.category === 'all' || 
      item.category === filters.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return {
    filters,
    setFilters,
    filteredData,
    updateFilter: (key: keyof FilterOptions, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
};

// Common pagination hook
export const usePagination = <T>(data: T[], pageSize: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    pagination: {
      page: currentPage,
      pageSize,
      total: data.length
    }
  };
};

// Common status badge colors
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    suspended: 'bg-red-100 text-red-800',
    open: 'bg-blue-100 text-blue-800',
    closed: 'bg-gray-100 text-gray-800',
    resolved: 'bg-green-100 text-green-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

// Common role badge colors
export const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-800',
    seller: 'bg-blue-100 text-blue-800',
    buyer: 'bg-green-100 text-green-800'
  };
  
  return colors[role] || 'bg-gray-100 text-gray-800';
};

// Format currency helper
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date helper
export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-CO');
};

// Format datetime helper
export const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleString('es-CO');
};
