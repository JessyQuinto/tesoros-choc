import { auth } from '@/config/firebase';
import { API_CONFIG } from '@/config/api.config';

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

// API client with Firebase authentication integration
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get authentication headers with Firebase token
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const user = auth.currentUser;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (user) {
      const token = await user.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Handle API responses consistently
  private async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();
    
    console.log('📄 API Response Data:', data);
    
    if (!response.ok) {
      console.error('❌ API Error:', { status: response.status, error: data.error });
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    if (!data.success) {
      console.error('❌ API Request Failed:', data.error);
      throw new Error(data.error || 'Request failed');
    }

    console.log('✅ API Success:', data.data);
    return data.data as T;
  }

  // Public endpoints (no auth required)
  async get<T>(endpoint: string, requireAuth: boolean = false): Promise<T> {
    const headers = requireAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    const fullUrl = `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 API GET Request:', { url: fullUrl, requireAuth, headers });
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers
    });
    
    console.log('📡 API Response:', { status: response.status, ok: response.ok });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data: Record<string, unknown> | unknown[], requireAuth: boolean = true): Promise<T> {
    const headers = requireAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: Record<string, unknown> | unknown[], requireAuth: boolean = true): Promise<T> {
    const headers = requireAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    const headers = requireAuth ? await this.getAuthHeaders() : { 'Content-Type': 'application/json' };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();