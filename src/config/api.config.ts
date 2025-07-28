// Configuración del backend
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://tu-backend-url.com/api' // Cambia esto por tu URL de producción
    : 'http://localhost:3000/api',
  
  TIMEOUT: 10000, // 10 segundos
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
};

// URLs de endpoints específicos
export const ENDPOINTS = {
  // Autenticación
  AUTH: {
    VERIFY_TOKEN: '/auth/verify-token'
  },
  
  // Usuarios
  USERS: {
    PROFILE: '/users/profile',
    REGISTER_SELLER: '/users/register-seller'
  },
  
  // Productos (públicos)
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: (query: string) => `/products?search=${encodeURIComponent(query)}`,
    BY_CATEGORY: (category: string) => `/products?category=${encodeURIComponent(category)}`
  },
  
  // Comprador
  BUYER: {
    CART_ADD: '/buyer/cart/add',
    CHECKOUT: '/buyer/checkout',
    ORDERS: '/buyer/orders'
  },
  
  // Vendedor
  SELLER: {
    PRODUCTS: '/seller/products',
    PRODUCT_DETAIL: (id: string) => `/seller/products/${id}`,
    ORDERS: '/seller/orders'
  },
  
  // Administrador
  ADMIN: {
    USERS: '/admin/users',
    APPROVE_USER: (id: string) => `/admin/users/${id}/approve`,
    REJECT_USER: (id: string) => `/admin/users/${id}/reject`,
    SUSPEND_USER: (id: string) => `/admin/users/${id}/suspend`,
    REACTIVATE_USER: (id: string) => `/admin/users/${id}/reactivate`
  }
};

// Tipos de errores de la API
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
} as const;

export type ApiErrorType = typeof API_ERRORS[keyof typeof API_ERRORS];
