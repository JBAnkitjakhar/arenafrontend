// src/lib/api/client.ts  

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINTS, buildApiUrl, QueryParams } from './endpoints';
import type { 
  Question, 
  QuestionFormData, 
  QuestionDetail, 
  PaginatedResponse,
  Category,
  Solution,
  SolutionFormData,
  Approach,
  ApproachFormData,
  User,
  UserProgress,
  ExecutionRequest,
  ExecutionResponse
} from '@/types';

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
        localStorage.removeItem('token'); 
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
  get: <T>(url: string, params?: QueryParams): Promise<T> => {
    const fullUrl = params ? buildApiUrl(url, params) : url;
    return apiClient.get(fullUrl).then(res => res.data);
  },

  // POST request  
  post: <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient.post(url, data).then(res => res.data);
  },

  // PUT request
  put: <T>(url: string, data?: unknown): Promise<T> => {
    return apiClient.put(url, data).then(res => res.data);
  },

  // DELETE request
  delete: <T = void>(url: string): Promise<T> => {
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
    files.forEach((file) => {
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
  getCurrentUser: (): Promise<{ user: User }> => api.get(API_ENDPOINTS.AUTH.ME),
  refreshToken: (refreshToken: string): Promise<{ token: string; refreshToken: string; user: User }> => 
    apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    }).then(res => res.data),
  logout: (): Promise<void> => api.post(API_ENDPOINTS.AUTH.LOGOUT),
};

// Questions API
export const questionsApi = {
  getAll: (params: QueryParams): Promise<PaginatedResponse<Question>> => 
    api.get(API_ENDPOINTS.QUESTIONS.LIST, params),
  getById: (id: string): Promise<QuestionDetail> => 
    api.get(API_ENDPOINTS.QUESTIONS.DETAIL(id)),
  create: (data: QuestionFormData): Promise<Question> => 
    api.post(API_ENDPOINTS.QUESTIONS.CREATE, data),
  update: (id: string, data: QuestionFormData): Promise<Question> => 
    api.put(API_ENDPOINTS.QUESTIONS.UPDATE(id), data),
  delete: (id: string): Promise<void> => 
    api.delete(API_ENDPOINTS.QUESTIONS.DELETE(id)),
  search: (query: string): Promise<Question[]> => 
    api.get(API_ENDPOINTS.QUESTIONS.SEARCH, { q: query }),
  getStats: (): Promise<{
    total: number;
    byLevel: { easy: number; medium: number; hard: number };
    byCategory: Record<string, { name: string; count: number }>;
  }> => api.get(API_ENDPOINTS.QUESTIONS.STATS),
};

// Categories API
export const categoriesApi = {
  getAll: (): Promise<Category[]> => api.get(API_ENDPOINTS.CATEGORIES.LIST),
  getById: (id: string): Promise<Category> => api.get(API_ENDPOINTS.CATEGORIES.DETAIL(id)),
  create: (data: { name: string }): Promise<Category> => 
    api.post(API_ENDPOINTS.CATEGORIES.CREATE, data),
  update: (id: string, data: { name: string }): Promise<Category> => 
    api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data),
  delete: (id: string): Promise<{ deletedQuestions: number }> => 
    api.delete(API_ENDPOINTS.CATEGORIES.DELETE(id)),
  getStats: (id: string): Promise<{
    totalQuestions: number;
    questionsByLevel: { easy: number; medium: number; hard: number };
    totalSolved: number;
    solvedByLevel: { easy: number; medium: number; hard: number };
  }> => api.get(API_ENDPOINTS.CATEGORIES.STATS(id)),
  getProgress: (id: string): Promise<{
    totalQuestions: number;
    solvedQuestions: number;
    progressPercentage: number;
    solvedByLevel: { easy: number; medium: number; hard: number };
  }> => api.get(API_ENDPOINTS.CATEGORIES.PROGRESS(id)),
};

// Solutions API
export const solutionsApi = {
  getByQuestion: (questionId: string): Promise<Solution[]> => 
    api.get(API_ENDPOINTS.SOLUTIONS.BY_QUESTION(questionId)),
  getById: (id: string): Promise<Solution> => 
    api.get(API_ENDPOINTS.SOLUTIONS.DETAIL(id)),
  create: (questionId: string, data: SolutionFormData): Promise<Solution> => 
    api.post(API_ENDPOINTS.SOLUTIONS.CREATE_FOR_QUESTION(questionId), data),
  update: (id: string, data: SolutionFormData): Promise<Solution> => 
    api.put(API_ENDPOINTS.SOLUTIONS.UPDATE(id), data),
  delete: (id: string): Promise<void> => 
    api.delete(API_ENDPOINTS.SOLUTIONS.DELETE(id)),
};

// Approaches API
export const approachesApi = {
  getByQuestion: (questionId: string): Promise<Approach[]> => 
    api.get(API_ENDPOINTS.APPROACHES.BY_QUESTION(questionId)),
  getById: (id: string): Promise<Approach> => 
    api.get(API_ENDPOINTS.APPROACHES.DETAIL(id)),
  create: (questionId: string, data: ApproachFormData): Promise<Approach> => 
    api.post(API_ENDPOINTS.APPROACHES.CREATE_FOR_QUESTION(questionId), data),
  update: (id: string, data: ApproachFormData): Promise<Approach> => 
    api.put(API_ENDPOINTS.APPROACHES.UPDATE(id), data),
  delete: (id: string): Promise<void> => 
    api.delete(API_ENDPOINTS.APPROACHES.DELETE(id)),
  checkSize: (questionId: string, data: { textContent: string; codeContent?: string }): Promise<{
    isValid: boolean;
    currentSize: number;
    maxSize: number;
    message: string;
  }> => api.post(API_ENDPOINTS.APPROACHES.CHECK_SIZE(questionId), data),
  getSizeUsage: (questionId: string): Promise<{
    totalUsed: number;
    totalUsedKB: number;
    remaining: number;
    remainingKB: number;
    maxAllowed: number;
    maxAllowedKB: number;
    usagePercentage: number;
    approachCount: number;
    maxApproaches: number;
  }> => api.get(API_ENDPOINTS.APPROACHES.SIZE_USAGE(questionId)),
  getMyStats: (): Promise<{
    totalApproaches: number;
    totalSizeUsed: number;
    averageSize: number;
  }> => api.get(API_ENDPOINTS.APPROACHES.MY_STATS),
  getMy: (): Promise<Approach[]> => api.get(API_ENDPOINTS.APPROACHES.MY_APPROACHES),
};

// Progress API
export const progressApi = {
  getUserStats: (): Promise<{
    totalSolved: number;
    totalQuestions: number;
    solvedByLevel: { easy: number; medium: number; hard: number };
    recentSolved: number;
    streak: number;
  }> => api.get(API_ENDPOINTS.PROGRESS.USER_STATS),
  getUserRecent: (): Promise<Array<{
    questionId: string;
    questionTitle: string;
    solved: boolean;
    solvedAt: string;
  }>> => api.get(API_ENDPOINTS.PROGRESS.USER_RECENT),
  getQuestionProgress: (questionId: string): Promise<UserProgress> => 
    api.get(API_ENDPOINTS.PROGRESS.QUESTION_PROGRESS(questionId)),
  updateQuestionProgress: (questionId: string, data: { solved: boolean }): Promise<{
    solved: boolean;
    solvedAt?: string;
  }> => api.post(API_ENDPOINTS.PROGRESS.QUESTION_PROGRESS(questionId), data),
  getCategoryProgress: (categoryId: string): Promise<{
    totalQuestions: number;
    solvedQuestions: number;
    progressPercentage: number;
    solvedByLevel: { easy: number; medium: number; hard: number };
  }> => api.get(API_ENDPOINTS.PROGRESS.CATEGORY_PROGRESS(categoryId)),
};

// Users API
export const usersApi = {
  getAll: (params: QueryParams): Promise<PaginatedResponse<User>> => 
    api.get(API_ENDPOINTS.USERS.LIST, params),
  getById: (id: string): Promise<User> => 
    api.get(API_ENDPOINTS.USERS.DETAIL(id)),
  update: (id: string, data: Partial<User>): Promise<User> => 
    api.put(API_ENDPOINTS.USERS.UPDATE(id), data),
  delete: (id: string): Promise<void> => 
    api.delete(API_ENDPOINTS.USERS.DELETE(id)),
  updateRole: (id: string, role: string): Promise<User> => 
    api.put(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role }),
  getProgress: (): Promise<UserProgress> => 
    api.get(API_ENDPOINTS.USERS.PROGRESS),
};

// Compiler API
export const compilerApi = {
  execute: (data: ExecutionRequest): Promise<{
    success: boolean;
    data: ExecutionResponse;
    message?: string;
  }> => api.post(API_ENDPOINTS.COMPILER.EXECUTE, data),
  getLanguages: (): Promise<{
    success: boolean;
    data: string[];
  }> => api.get(API_ENDPOINTS.COMPILER.LANGUAGES),
};

// Files API
export const filesApi = {
  uploadImage: (file: File, onProgress?: (progress: number) => void): Promise<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }> => api.upload(API_ENDPOINTS.FILES.UPLOAD_IMAGE, file, onProgress),
  uploadVisualizer: (file: File, onProgress?: (progress: number) => void): Promise<{
    fileId: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
  }> => api.upload(API_ENDPOINTS.FILES.UPLOAD_VISUALIZER, file, onProgress),
  delete: (fileId: string): Promise<void> => 
    api.delete(API_ENDPOINTS.FILES.DELETE(fileId)),
};

// Admin API
export const adminApi = {
  getStats: (): Promise<{
    totalUsers: number;
    totalQuestions: number;
    totalSolutions: number;
    totalApproaches: number;
    newUsersThisMonth: number;
    activeUsers: number;
  }> => api.get(API_ENDPOINTS.ADMIN.STATS),
  getSettings: (): Promise<Record<string, unknown>> => 
    api.get(API_ENDPOINTS.ADMIN.SETTINGS),
  updateSettings: (data: Record<string, unknown>): Promise<Record<string, unknown>> => 
    api.put(API_ENDPOINTS.ADMIN.SETTINGS, data),
  getUsers: (params: QueryParams): Promise<PaginatedResponse<User>> => 
    api.get(API_ENDPOINTS.ADMIN.USERS, params),
  getUserDetail: (id: string): Promise<User> => 
    api.get(API_ENDPOINTS.ADMIN.USER_DETAIL(id)),
  updateUser: (id: string, data: Partial<User>): Promise<User> => 
    api.put(API_ENDPOINTS.ADMIN.UPDATE_USER(id), data),
  deleteUser: (id: string): Promise<void> => 
    api.delete(API_ENDPOINTS.ADMIN.DELETE_USER(id)),
  getQuestions: (params: QueryParams): Promise<PaginatedResponse<Question>> => 
    api.get(API_ENDPOINTS.ADMIN.QUESTIONS, params),
  getSolutions: (params: QueryParams): Promise<PaginatedResponse<Solution>> => 
    api.get(API_ENDPOINTS.ADMIN.SOLUTIONS, params),
  getCategories: (): Promise<Category[]> => 
    api.get(API_ENDPOINTS.ADMIN.CATEGORIES),
};