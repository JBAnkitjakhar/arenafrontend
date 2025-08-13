// src/types/index.ts - Complete Types File

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string;
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN', 
  SUPERADMIN = 'SUPERADMIN'
}

// Question Types
export interface Question {
  id: string;
  title: string;
  statement: string;
  imageUrls?: string[];
  imageFolderUrl?: string; // Backward compatibility
  codeSnippets?: CodeSnippet[];
  categoryId: string;
  categoryName: string;
  level: QuestionLevel;
  createdByName: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionDetail extends Question {
  solutions: Solution[];
  solved: boolean;
  solvedAt?: string;
}

export enum QuestionLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface CodeSnippet {
  language: string;
  code: string;
  description?: string;
}

// Solution Types (ENHANCED with YouTube support)
export interface Solution {
  id: string;
  questionId: string;
  questionTitle?: string;
  content: string;
  driveLink?: string;
  youtubeLink?: string; // NEW: YouTube video link
  imageUrls?: string[];
  visualizerFileIds?: string[];
  codeSnippet?: CodeSnippet;
  createdByName: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  
  // Helper methods (will be added by utils)
  hasValidDriveLink?: boolean;
  hasValidYoutubeLink?: boolean;
  youtubeVideoId?: string;
  youtubeEmbedUrl?: string;
}

// Approach Types  
export interface Approach {
  id: string;
  questionId: string;
  questionTitle?: string;
  userId: string;
  userName: string;
  textContent: string;
  codeContent?: string;
  codeLanguage: string;
  contentSize: number;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  createdByName: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

// User Progress Types
export interface UserProgress {
  solved: boolean;
  solvedAt?: string;
}

// Compiler Types
export interface ExecutionRequest {
  language: string;
  version: string;
  code: string;
  stdin?: string;
  args?: string[];
}

export interface ExecutionResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    output: string;
  };
  compile?: {
    stdout: string;
    stderr: string;
    code: number;
    output: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
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

// Auth Types
export interface AuthUser {
  token: string;
  refreshToken?: string;
  user: User;
}

// Form Types
export interface LoginFormData {
  // OAuth only - no traditional login
}

export interface QuestionFormData {
  title: string;
  statement: string;
  categoryId: string;
  level: QuestionLevel;
  imageUrls?: string[];
  codeSnippets?: CodeSnippet[];
}

export interface SolutionFormData {
  content: string;
  driveLink?: string;
  youtubeLink?: string; // NEW: YouTube video link
  imageUrls?: string[];
  visualizerFileIds?: string[];
  codeSnippet?: CodeSnippet;
}

export interface ApproachFormData {
  textContent: string;
  codeContent?: string;
  codeLanguage: string;
}

export interface CategoryFormData {
  name: string;
}

// YouTube specific types
export interface YouTubeValidationResponse {
  valid: boolean;
  videoId?: string;
  embedUrl?: string;
  error?: string;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title?: string;
  thumbnail?: string;
  duration?: string;
  embedUrl: string;
}

// Progress and Statistics Types
export interface ProgressStats {
  totalQuestions: number;
  solvedQuestions: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentActivity: {
    questionId: string;
    questionTitle: string;
    solvedAt: string;
  }[];
  streakDays: number;
  progressPercentage: number;
}

export interface CategoryProgress {
  categoryId: string;
  categoryName: string;
  totalQuestions: number;
  solvedQuestions: number;
  progressPercentage: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// Question listing and filtering types
export interface QuestionFilters {
  page?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
  solved?: boolean;
}

export interface QuestionCounts {
  total: number;
  byLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  byCategory: {
    [categoryId: string]: number;
  };
  solved: number;
  unsolved: number;
}

// Admin specific types
export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalSolutions: number;
  totalApproaches: number;
  usersByRole: {
    [role: string]: number;
  };
  recentActivity: {
    type: 'user_registered' | 'question_added' | 'solution_added';
    data: any;
    timestamp: string;
  }[];
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  toasts: Toast[];
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// File upload types
export interface FileUploadResponse {
  url: string;
  publicId?: string;
  size: number;
  format: string;
}

// Pagination helper type
export interface PaginationInfo {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}