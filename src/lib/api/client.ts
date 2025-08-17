// src/lib/api/client.ts

import axios, { 
  AxiosInstance, 
  AxiosRequestConfig, 
  AxiosResponse, 
  InternalAxiosRequestConfig,
  AxiosProgressEvent 
} from 'axios';
import { toast } from 'react-hot-toast';

// Backend DTO interfaces that match Java DTOs exactly
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
  first: boolean;
  last: boolean;
}

// Generic types for request/response data
type RequestData = Record<string, unknown> | FormData | undefined;
type QueryParams = Record<string, string | number | boolean> | undefined;

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token if available
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // Add request timestamp for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
          });
        }

        return config;
      },
      (error: unknown) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const { response, request, message } = error;

          if (process.env.NODE_ENV === 'development') {
            console.error('❌ API Error:', {
              url: error.config?.url,
              method: error.config?.method,
              status: response?.status,
              message: response?.data?.message || message,
            });
          }

          // Handle different error scenarios
          if (response) {
            // Server responded with error status
            const { status, data } = response;
            
            switch (status) {
              case 401:
                this.handleUnauthorized();
                break;
              case 403:
                toast.error('Access denied. You don\'t have permission to perform this action.');
                break;
              case 404:
                toast.error('Resource not found.');
                break;
              case 429:
                toast.error('Too many requests. Please try again later.');
                break;
              case 500:
                toast.error('Server error. Please try again later.');
                break;
              default:
                if (data?.message) {
                  toast.error(data.message);
                } else {
                  toast.error('An unexpected error occurred.');
                }
            }
          } else if (request) {
            // Network error
            toast.error('Network error. Please check your connection.');
          } else {
            // Request setup error
            toast.error('Request failed. Please try again.');
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private handleUnauthorized() {
    // Clear token and redirect to login
    this.token = null;
    localStorage.removeItem('token');
    
    toast.error('Session expired. Please log in again.');
    
    // Only redirect if we're not already on the auth page
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
      window.location.href = '/auth/login';
    }
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Initialize token from localStorage
  initializeToken() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        this.token = savedToken;
      }
    }
  }

  // Generic request methods with proper typing
  async get<T = unknown>(url: string, params?: QueryParams): Promise<T> {
    const response = await this.instance.get<T>(url, { params });
    return response.data;
  }

  async post<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = unknown>(url: string, data?: RequestData, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // File upload helper with proper typing
  async uploadFile<T = unknown>(
    url: string, 
    file: File, 
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  }

  // Multi-file upload helper with proper typing
  async uploadFiles<T = unknown>(
    url: string, 
    files: File[], 
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<T> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const response = await this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get('/actuator/health');
  }

  // Get instance for advanced usage
  getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export singleton instance
export const api = new ApiClient();
export default api;