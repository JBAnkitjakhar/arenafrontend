// src/types/index.ts

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

// Solution Types
export interface Solution {
  id: string;
  questionId: string;
  questionTitle?: string;
  content: string;
  driveLink?: string;
  imageUrls?: string[]; // NEW
  visualizerFileIds?: string[]; // NEW
  codeSnippet?: CodeSnippet;
  createdByName: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
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
  imageUrls?: string[];
  visualizerFileIds?: string[];
  codeSnippet?: CodeSnippet;
}

export interface ApproachFormData {
  textContent: string;
  codeContent?: string;
  codeLanguage: string;
}