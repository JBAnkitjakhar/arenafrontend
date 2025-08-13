// src/lib/api/client.ts - Updated API Client

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINTS, buildApiUrl } from './endpoints';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Redirect to login (will be handled by auth store)
        window.location.href = '/auth/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Enhanced API helper methods
export const api = {
  // GET request
  get: <T>(url: string, params?: object): Promise<T> => {
    const fullUrl = params ? buildApiUrl(url, params) : url;
    return apiClient.get(fullUrl).then(res => res.data);
  },

  // POST request  
  post: <T>(url: string, data?: object): Promise<T> => {
    return apiClient.post(url, data).then(res => res.data);
  },

  // PUT request
  put: <T>(url: string, data?: object): Promise<T> => {
    return apiClient.put(url, data).then(res => res.data);
  },

  // DELETE request
  delete: <T>(url: string): Promise<T> => {
    return apiClient.delete(url).then(res => res.data);
  },

  // File upload
  upload: <T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then(res => res.data);
  },

  // Multiple file upload
  uploadMultiple: <T>(url: string, files: File[], onProgress?: (progress: number) => void): Promise<T> => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    }).then(res => res.data);
  },
};

// =============================================================================
// SPECIFIC API FUNCTIONS (Using correct backend endpoints)
// =============================================================================

// Auth API
export const authApi = {
  getCurrentUser: () => api.get(API_ENDPOINTS.AUTH.ME),
  refreshToken: (refreshToken: string) => 
    apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).then(res => res.data),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
};

// Questions API
export const questionsApi = {
  getAll: (params: any) => api.get(API_ENDPOINTS.QUESTIONS.LIST, params),
  getById: (id: string) => api.get(API_ENDPOINTS.QUESTIONS.DETAIL(id)),
  create: (data: any) => api.post(API_ENDPOINTS.QUESTIONS.CREATE, data),
  update: (id: string, data: any) => api.put(API_ENDPOINTS.QUESTIONS.UPDATE(id), data),
  delete: (id: string) => api.delete(API_ENDPOINTS.QUESTIONS.DELETE(id)),
  search: (query: string) => api.get(API_ENDPOINTS.QUESTIONS.SEARCH, { q: query }),
  getStats: () => api.get(API_ENDPOINTS.QUESTIONS.STATS),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get(API_ENDPOINTS.CATEGORIES.LIST),
  getById: (id: string) => api.get(API_ENDPOINTS.CATEGORIES.DETAIL(id)),
  create: (data: any) => api.post(API_ENDPOINTS.CATEGORIES.CREATE, data),
  update: (id: string, data: any) => api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data),
  delete: (id: string) => api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id)),
  getStats: (id: string) => api.get(API_ENDPOINTS.CATEGORIES.STATS(id)),
  getProgress: (id: string) => api.get(API_ENDPOINTS.CATEGORIES.PROGRESS(id)),
};

// Solutions API
export const solutionsApi = {
  getByQuestion: (questionId: string) => api.get(API_ENDPOINTS.SOLUTIONS.BY_QUESTION(questionId)),
  getById: (id: string) => api.get(API_ENDPOINTS.SOLUTIONS.DETAIL(id)),
  create: (questionId: string, data: any) => api.post(API_ENDPOINTS.SOLUTIONS.CREATE_FOR_QUESTION(questionId), data),
  update: (id: string, data: any) => api.put(API_ENDPOINTS.SOLUTIONS.UPDATE(id), data),
  delete: (id: string) => api.delete(API_ENDPOINTS.SOLUTIONS.DELETE(id)),
};

// Approaches API
export const approachesApi = {
  getByQuestion: (questionId: string) => api.get(API_ENDPOINTS.APPROACHES.BY_QUESTION(questionId)),
  getById: (id: string) => api.get(API_ENDPOINTS.APPROACHES.DETAIL(id)),
  create: (questionId: string, data: any) => api.post(API_ENDPOINTS.APPROACHES.CREATE_FOR_QUESTION(questionId), data),
  update: (id: string, data: any) => api.put(API_ENDPOINTS.APPROACHES.UPDATE(id), data),
  delete: (id: string) => api.delete(API_ENDPOINTS.APPROACHES.DELETE(id)),
  checkSize: (questionId: string, data: any) => api.post(API_ENDPOINTS.APPROACHES.CHECK_SIZE(questionId), data),
  getSizeUsage: (questionId: string) => api.get(API_ENDPOINTS.APPROACHES.SIZE_USAGE(questionId)),
  getMyStats: () => api.get(API_ENDPOINTS.APPROACHES.MY_STATS),
  getMy: () => api.get(API_ENDPOINTS.APPROACHES.MY_APPROACHES),
};

// Progress API
export const progressApi = {
  getUserStats: () => api.get(API_ENDPOINTS.PROGRESS.USER_STATS),
  getUserRecent: () => api.get(API_ENDPOINTS.PROGRESS.USER_RECENT),
  getQuestionProgress: (questionId: string) => api.get(API_ENDPOINTS.PROGRESS.QUESTION_PROGRESS(questionId)),
  updateQuestionProgress: (questionId: string, data: { solved: boolean }) => 
    api.post(API_ENDPOINTS.PROGRESS.QUESTION_PROGRESS(questionId), data),
  getCategoryProgress: (categoryId: string) => api.get(API_ENDPOINTS.PROGRESS.CATEGORY_PROGRESS(categoryId)),
};

// Users API
export const usersApi = {
  getAll: (params: any) => api.get(API_ENDPOINTS.USERS.LIST, params),
  getById: (id: string) => api.get(API_ENDPOINTS.USERS.DETAIL(id)),
  update: (id: string, data: any) => api.put(API_ENDPOINTS.USERS.UPDATE(id), data),
  delete: (id: string) => api.delete(API_ENDPOINTS.USERS.DELETE(id)),
  updateRole: (id: string, role: string) => api.put(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role }),
  getProgress: () => api.get(API_ENDPOINTS.USERS.PROGRESS),
};

// Compiler API
export const compilerApi = {
  execute: (data: any) => api.post(API_ENDPOINTS.COMPILER.EXECUTE, data),
  getLanguages: () => api.get(API_ENDPOINTS.COMPILER.LANGUAGES),
};

// Files API
export const filesApi = {
  uploadImage: (file: File, onProgress?: (progress: number) => void) => 
    api.upload(API_ENDPOINTS.FILES.UPLOAD_IMAGE, file, onProgress),
  uploadVisualizer: (file: File, onProgress?: (progress: number) => void) => 
    api.upload(API_ENDPOINTS.FILES.UPLOAD_VISUALIZER, file, onProgress),
  delete: (fileId: string) => api.delete(API_ENDPOINTS.FILES.DELETE(fileId)),
};

// Admin API
export const adminApi = {
  getStats: () => api.get(API_ENDPOINTS.ADMIN.STATS),
  getSettings: () => api.get(API_ENDPOINTS.ADMIN.SETTINGS),
  updateSettings: (data: any) => api.put(API_ENDPOINTS.ADMIN.SETTINGS, data),
  getUsers: (params: any) => api.get(API_ENDPOINTS.ADMIN.USERS, params),
  getUserDetail: (id: string) => api.get(API_ENDPOINTS.ADMIN.USER_DETAIL(id)),
  updateUser: (id: string, data: any) => api.put(API_ENDPOINTS.ADMIN.UPDATE_USER(id), data),
  deleteUser: (id: string) => api.delete(API_ENDPOINTS.ADMIN.DELETE_USER(id)),
  getQuestions: (params: any) => api.get(API_ENDPOINTS.ADMIN.QUESTIONS, params),
  getSolutions: (params: any) => api.get(API_ENDPOINTS.ADMIN.SOLUTIONS, params),
  getCategories: () => api.get(API_ENDPOINTS.ADMIN.CATEGORIES),
};