import { API_CONFIG } from '@/config/api.config';

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
}

// API client without Firebase authentication
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Get basic headers
  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json'
    };
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
    const headers = this.getHeaders();
    const fullUrl = `${this.baseUrl}${endpoint}`;
    
    console.log('🌐 API GET Request:', { url: fullUrl, requireAuth, headers });
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers
    });
    
    console.log('📡 API Response:', { status: response.status, ok: response.ok });
    
    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string, 
    data: Record<string, unknown> | unknown[], 
    requireAuth: boolean = true,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const baseHeaders = this.getHeaders();
    const headers = { ...baseHeaders, ...customHeaders };
    
    console.log('🌐 ApiClient: POST Request:', { 
      endpoint, 
      requireAuth, 
      hasCustomHeaders: !!customHeaders,
      headers: Object.keys(headers)
    });
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    console.log('📡 ApiClient: Response status:', response.status);
    
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data: Record<string, unknown> | unknown[], requireAuth: boolean = true): Promise<T> {
    const headers = this.getHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, requireAuth: boolean = true): Promise<T> {
    const headers = this.getHeaders();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();