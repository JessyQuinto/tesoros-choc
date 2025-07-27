import { auth } from '@/config/firebase';
import { ApiError } from './errors';

const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError('Usuario no autenticado. Por favor, inicie sesión.', 401);
  }
  return user.getIdToken();
};

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  },

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>('PUT', endpoint, body);
  },

  async delete(endpoint: string): Promise<void> {
    await this.request<void>('DELETE', endpoint);
  },

  async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, body: any = null): Promise<T> {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    };
    
    const options: RequestInit = {
      method,
      headers,
    };
    
    if (body) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`/api${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error de servidor sin cuerpo JSON' }));
      throw new ApiError(errorData.message || 'Ocurrió un error inesperado', response.status);
    }

    if (method === 'DELETE') {
      return Promise.resolve() as Promise<T>;
    }
    
    return response.json() as Promise<T>;
  },
};
