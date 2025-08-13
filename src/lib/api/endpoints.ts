// src/lib/api/endpoints.ts

/**
 * Complete API Endpoints Map
 * Based on Spring Boot Backend Controllers
 */

export const API_ENDPOINTS = {
  // =============================================================================
  // AUTH ENDPOINTS (/api/auth)
  // =============================================================================
  AUTH: {
    ME: '/auth/me',                           // GET - Get current user
    REFRESH: '/auth/refresh',                 // POST - Refresh JWT token
    LOGOUT: '/auth/logout',                   // POST - Logout user
    GOOGLE: '/auth/google',                   // GET - Redirect to Google OAuth
    GITHUB: '/auth/github',                   // GET - Redirect to GitHub OAuth
    HEALTH: '/auth/health',                   // GET - Auth service health check
    
    // OAuth2 URLs (handled by Spring Security)
    GOOGLE_OAUTH: '/oauth2/authorization/google',
    GITHUB_OAUTH: '/oauth2/authorization/github',
  },

  // =============================================================================
  // QUESTIONS ENDPOINTS (/api/questions)
  // =============================================================================
  QUESTIONS: {
    // Basic CRUD
    LIST: '/questions',                       // GET - Get paginated questions
    CREATE: '/questions',                     // POST - Create question (Admin)
    DETAIL: (id: string) => `/questions/${id}`,  // GET - Get question details
    UPDATE: (id: string) => `/questions/${id}`,  // PUT - Update question (Admin)
    DELETE: (id: string) => `/questions/${id}`,  // DELETE - Delete question (Admin)
    
    // Search & Stats
    SEARCH: '/questions/search',              // GET - Search questions
    STATS: '/questions/stats',                // GET - Questions statistics
    
    // Progress related
    PROGRESS: (id: string) => `/questions/${id}/progress`,  // GET/POST - Question progress
  },

  // =============================================================================
  // CATEGORIES ENDPOINTS (/api/categories)
  // =============================================================================
  CATEGORIES: {
    LIST: '/categories',                      // GET - Get all categories
    CREATE: '/categories',                    // POST - Create category (Admin)
    DETAIL: (id: string) => `/categories/${id}`,     // GET - Get category details
    UPDATE: (id: string) => `/categories/${id}`,     // PUT - Update category (Admin)
    DELETE: (id: string) => `/categories/${id}`,     // DELETE - Delete category (Admin)
    STATS: (id: string) => `/categories/${id}/stats`, // GET - Category statistics
    PROGRESS: (id: string) => `/categories/${id}/progress`, // GET - Category progress
  },

  // =============================================================================
  // SOLUTIONS ENDPOINTS (/api/solutions)
  // =============================================================================
  SOLUTIONS: {
    // Basic CRUD
    LIST: '/solutions',                       // GET - Get all solutions (Admin)
    DETAIL: (id: string) => `/solutions/${id}`,      // GET - Get solution details
    UPDATE: (id: string) => `/solutions/${id}`,      // PUT - Update solution (Admin)
    DELETE: (id: string) => `/solutions/${id}`,      // DELETE - Delete solution (Admin)
    
    // Question-specific
    BY_QUESTION: (questionId: string) => `/solutions/question/${questionId}`,  // GET - Solutions for question
    CREATE_FOR_QUESTION: (questionId: string) => `/solutions/question/${questionId}`,  // POST - Create solution
  },

  // =============================================================================
  // APPROACHES ENDPOINTS (/api/approaches)
  // =============================================================================
  APPROACHES: {
    // Basic CRUD
    DETAIL: (id: string) => `/approaches/${id}`,     // GET - Get approach details
    UPDATE: (id: string) => `/approaches/${id}`,     // PUT - Update approach
    DELETE: (id: string) => `/approaches/${id}`,     // DELETE - Delete approach
    
    // Question-specific
    BY_QUESTION: (questionId: string) => `/approaches/question/${questionId}`,  // GET - User's approaches for question
    CREATE_FOR_QUESTION: (questionId: string) => `/approaches/question/${questionId}`,  // POST - Create approach
    CHECK_SIZE: (questionId: string) => `/approaches/question/${questionId}/check-size`,  // POST - Check size limits
    SIZE_USAGE: (questionId: string) => `/approaches/question/${questionId}/size-usage`,  // GET - Size usage
    
    // User stats
    MY_STATS: '/approaches/my-stats',         // GET - Current user's approach stats
    MY_APPROACHES: '/approaches/my',          // GET - Current user's all approaches
    
    // Admin endpoints
    ADMIN_DELETE_ALL: (questionId: string) => `/approaches/admin/question/${questionId}`,  // DELETE - Delete all approaches (Admin)
  },

  // =============================================================================
  // USER PROGRESS ENDPOINTS (Derived from UserProgressService)
  // =============================================================================
  PROGRESS: {
    // User progress stats
    USER_STATS: '/users/progress',            // GET - Current user's progress statistics
    USER_RECENT: '/users/progress/recent',    // GET - Current user's recent progress
    
    // Question progress
    QUESTION_PROGRESS: (questionId: string) => `/questions/${questionId}/progress`,  // GET/POST - Question progress
    
    // Category progress  
    CATEGORY_PROGRESS: (categoryId: string) => `/categories/${categoryId}/progress`,  // GET - Category progress
  },

  // =============================================================================
  // USERS ENDPOINTS (/api/users)
  // =============================================================================
  USERS: {
    LIST: '/users',                           // GET - Get all users (Admin)
    DETAIL: (id: string) => `/users/${id}`,          // GET - Get user details
    UPDATE: (id: string) => `/users/${id}`,          // PUT - Update user
    DELETE: (id: string) => `/users/${id}`,          // DELETE - Delete user (Admin)
    
    // Role management
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,  // PUT - Update user role (Admin)
    
    // User progress
    PROGRESS: '/users/progress',              // GET - Current user progress
    PROGRESS_BY_USER: (userId: string) => `/users/${userId}/progress`,  // GET - Specific user progress
  },

  // =============================================================================
  // COMPILER ENDPOINTS (/api/compiler)
  // =============================================================================
  COMPILER: {
    EXECUTE: '/compiler/execute',             // POST - Execute code
    LANGUAGES: '/compiler/languages',         // GET - Get supported languages
  },

  // =============================================================================
  // FILE UPLOAD ENDPOINTS (/api/files)
  // =============================================================================
  FILES: {
    UPLOAD_IMAGE: '/files/images',            // POST - Upload image
    UPLOAD_VISUALIZER: '/files/visualizer',   // POST - Upload HTML visualizer
    DELETE: (fileId: string) => `/files/${fileId}`,  // DELETE - Delete file
  },

  // =============================================================================
  // ADMIN ENDPOINTS (/api/admin)
  // =============================================================================
  ADMIN: {
    // Dashboard stats
    STATS: '/admin/stats',                    // GET - Admin dashboard statistics
    
    // System management
    SETTINGS: '/admin/settings',              // GET/PUT - System settings
    
    // User management
    USERS: '/admin/users',                    // GET - All users with pagination
    USER_DETAIL: (id: string) => `/admin/users/${id}`,  // GET - User details
    UPDATE_USER: (id: string) => `/admin/users/${id}`,  // PUT - Update user
    DELETE_USER: (id: string) => `/admin/users/${id}`,  // DELETE - Delete user
    
    // Content management
    QUESTIONS: '/admin/questions',            // GET - All questions with pagination
    SOLUTIONS: '/admin/solutions',            // GET - All solutions with pagination
    CATEGORIES: '/admin/categories',          // GET - All categories
  },

  // =============================================================================
  // HEALTH & MONITORING (/api/actuator)
  // =============================================================================
  ACTUATOR: {
    HEALTH: '/actuator/health',               // GET - Application health
    INFO: '/actuator/info',                   // GET - Application info
  },
} as const;

// =============================================================================
// QUERY PARAMETER INTERFACES
// =============================================================================

export interface QuestionsQueryParams {
  page?: number;
  size?: number;
  categoryId?: string;
  level?: string;
  search?: string;
}

export interface UsersQueryParams {
  page?: number;
  size?: number;
  role?: string;
  search?: string;
}

export interface SolutionsQueryParams {
  page?: number;
  size?: number;
  questionId?: string;
}

export interface CategoryQueryParams {
  search?: string;
  page?: number;
  size?: number;
}

export interface ApproachQueryParams {
  questionId?: string;
  userId?: string;
  page?: number;
  size?: number;
}

export interface ProgressQueryParams {
  userId?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AdminQueryParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  status?: string;
}

// =============================================================================
// REQUEST/RESPONSE INTERFACES
// =============================================================================

export interface ProgressUpdateRequest {
  solved: boolean;
}

export interface ApproachSizeCheckRequest {
  textContent: string;
  codeContent?: string;
}

export interface CodeExecutionRequest {
  language: string;
  version: string;
  code: string;
  stdin?: string;
  args?: string[];
}

export interface CategoryCreateRequest {
  name: string;
}

export interface CategoryUpdateRequest {
  name: string;
}

export interface UserRoleUpdateRequest {
  role: string;
}

// Type-safe query parameter union
export type QueryParams = 
  | QuestionsQueryParams
  | UsersQueryParams 
  | SolutionsQueryParams
  | CategoryQueryParams
  | ApproachQueryParams
  | ProgressQueryParams
  | AdminQueryParams
  | Record<string, string | number | boolean | undefined>;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Build query string from parameters
 */
export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Build full URL with query parameters
 */
export function buildApiUrl(endpoint: string, params?: QueryParams): string {
  const baseUrl = endpoint;
  const queryString = params ? buildQueryString(params) : '';
  return `${baseUrl}${queryString}`;
}