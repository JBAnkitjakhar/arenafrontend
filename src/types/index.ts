// src/types/index.ts
// Single source of truth for all types - matches backend DTOs exactly

// ===== ENUMS =====
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export enum QuestionLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// ===== AUTH TYPES =====
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: string; // ISO date string
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface AuthUser {
  token: string;
  refreshToken?: string;
  user: User;
}

// ===== CODE SNIPPET =====
export interface CodeSnippet {
  language: string;
  code: string;
  description?: string;
}

// ===== CATEGORY =====
export interface Category {
  id: string;
  name: string;
  createdByName: string;
  createdById: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ===== QUESTION =====
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface QuestionDetail extends Question {
  solutions: Solution[];
  solved: boolean;
  solvedAt?: string; // ISO date string
}

// ===== SOLUTION =====
export interface Solution {
  id: string;
  questionId: string;
  questionTitle?: string;
  content: string;
  driveLink?: string;
  youtubeLink?: string;
  imageUrls?: string[];
  visualizerFileIds?: string[];
  codeSnippet?: CodeSnippet;
  createdByName: string;
  createdById: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  
  // Helper methods (match Java DTO)
  hasValidDriveLink?: () => boolean;
  hasValidYoutubeLink?: () => boolean;
  getYoutubeVideoId?: () => string | null;
  getYoutubeEmbedUrl?: () => string | null;
}

// ===== APPROACH =====
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
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// ===== USER PROGRESS =====
export interface UserProgressEntry {
  id: string;
  userId: string;
  userName: string;
  questionId: string;
  questionTitle: string;
  solved: boolean;
  level: QuestionLevel;
  solvedAt?: string; // ISO date string
}

export interface UserProgress {
  questionsProgress: {
    total: number;
    solved: number;
    byDifficulty: {
      easy: { total: number; solved: number };
      medium: { total: number; solved: number };
      hard: { total: number; solved: number };
    };
    byCategory: Record<string, {
      name: string;
      total: number;
      solved: number;
    }>;
  };
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastSolvedDate?: string;
  };
  activityData: {
    totalHours: number;
    avgSessionTime: number;
    mostActiveDay: string;
    weeklyActivity: number[];
  };
}

// ===== DASHBOARD STATS =====
export interface DashboardStats {
  totalQuestions: number;
  solvedQuestions: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  streakDays: number;
  totalUsers: number;
  weeklyProgress: {
    day: string;
    solved: number;
    attempts: number;
  }[];
  recentActivity: {
    id: string;
    type: 'solved' | 'attempted' | 'approach_added' | 'solution_viewed';
    questionTitle: string;
    questionId: string;
    timestamp: string;
    difficulty: QuestionLevel;
  }[];
  leaderboard: {
    id: string;
    name: string;
    image?: string;
    solvedCount: number;
    rank: number;
    streak: number;
  }[];
}

// ===== FORM DATA TYPES =====
export interface LoginFormData {
  provider: 'google' | 'github';
  redirectUrl?: string;
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
  youtubeLink?: string;
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

// ===== REQUEST TYPES =====
export interface CreateQuestionRequest {
  title: string;
  statement: string;
  categoryId: string;
  level: QuestionLevel;
  imageUrls?: string[];
  codeSnippets?: CodeSnippet[];
}

export interface UpdateQuestionRequest extends CreateQuestionRequest {
  id: string;
}

export interface CreateSolutionRequest {
  content: string;
  driveLink?: string;
  youtubeLink?: string;
  imageUrls?: string[];
  visualizerFileIds?: string[];
  codeSnippet?: CodeSnippet;
}

export interface UpdateSolutionRequest extends CreateSolutionRequest {
  id: string;
}

export interface CreateApproachRequest {
  textContent: string;
  codeContent?: string;
  codeLanguage: string;
}

export interface UpdateApproachRequest extends CreateApproachRequest {
  id: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}

// ===== API RESPONSE TYPES =====
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

// ===== VALIDATION RESPONSES =====
export interface LinkValidationResponse {
  valid: boolean;
  originalUrl?: string;
  videoId?: string; // For YouTube
  embedUrl?: string; // For YouTube
  error?: string;
}

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

// ===== STATISTICS RESPONSES =====
export interface CategoryStatsResponse {
  totalQuestions: number;
  questionsByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalSolutions: number;
}

export interface SolutionStatsResponse {
  totalSolutions: number;
  solutionsWithImages: number;
  solutionsWithVisualizers: number;
  solutionsWithYoutubeVideos: number;
  solutionsWithDriveLinks: number;
  solutionsWithBothLinks: number;
}

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

// ===== QUERY PARAMS =====
export interface QuestionQueryParams {
  page?: number;
  size?: number;
  categoryId?: string;
  level?: QuestionLevel;
  search?: string;
}

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

export interface SolutionQueryParams {
  page?: number;
  size?: number;
  creatorId?: string;
}

export interface ApproachQueryParams {
  questionId: string;
  userId: string;
  page?: number;
  size?: number;
}

// ===== APPROACH SIZE CHECKING =====
export interface ApproachSizeUsage {
  canAdd: boolean;
  currentSize: number;
  newSize: number;
  totalSizeAfterUpdate: number;
  maxAllowedSize: number;
  remainingBytes: number;
}

export interface ApproachStats {
  totalApproaches: number;
  totalContentSize: number;
  totalContentSizeKB: number;
  approachesByQuestion: Record<string, number>;
  averageContentSize: number;
  recentApproaches: Approach[];
}

// ===== COMPILER TYPES =====
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

// ===== FILE UPLOAD TYPES =====
export interface FileUploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface MultiFileUploadResponse {
  success: boolean;
  files: FileUploadResponse[];
  totalSize: number;
}

// ===== ADMIN TYPES =====
export interface UserRegisteredActivity {
  type: 'user_registered';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  timestamp: string;
}

export interface QuestionAddedActivity {
  type: 'question_added';
  data: {
    questionId: string;
    questionTitle: string;
    createdBy: string;
  };
  timestamp: string;
}

export interface SolutionAddedActivity {
  type: 'solution_added';
  data: {
    solutionId: string;
    questionId: string;
    questionTitle: string;
    createdBy: string;
  };
  timestamp: string;
}

export type AdminActivity = UserRegisteredActivity | QuestionAddedActivity | SolutionAddedActivity;

export interface AdminStats {
  totalUsers: number;
  totalQuestions: number;
  totalSolutions: number;
  totalApproaches: number;
  usersByRole: {
    [role: string]: number;
  };
  recentActivity: AdminActivity[];
}

// ===== UI STATE TYPES =====
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

// ===== ERROR TYPES =====
export interface ApiError {
  status: number;
  message: string;
  error?: string;
  timestamp: string;
  path: string;
}

// ===== PAGINATION =====
export interface PaginationInfo {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ===== GENERIC MAP RESPONSE =====
export interface MapResponse<T = unknown> {
  [key: string]: T;
}