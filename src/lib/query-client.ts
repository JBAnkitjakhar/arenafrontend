// src/lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

// Filter type interfaces
export interface QuestionFilters {
  category?: string;
  difficulty?: string;
  status?: string;
  search?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CategoryFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface SolutionFilters {
  language?: string;
  difficulty?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
}

export interface ProgressFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const queryKeys = {
  // Auth related queries
  auth: {
    user: ['auth', 'user'] as const,
    refreshToken: ['auth', 'refresh'] as const,
  },

  // Questions related queries
  questions: {
    all: ['questions'] as const,
    lists: () => ['questions', 'list'] as const,
    list: (filters: QuestionFilters) => ['questions', 'list', filters] as const,
    detail: (id: string) => ['questions', 'detail', id] as const,
    counts: ['questions', 'counts'] as const,
    search: (query: string) => ['questions', 'search', query] as const,
  },

  // Categories related queries
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    list: (filters: CategoryFilters) => ['categories', 'list', filters] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
    stats: (id: string) => ['categories', 'stats', id] as const,
  },

  // Solutions related queries
  solutions: {
    all: ['solutions'] as const,
    byQuestion: (questionId: string) => ['solutions', 'question', questionId] as const,
    detail: (id: string) => ['solutions', 'detail', id] as const,
    list: (filters: SolutionFilters) => ['solutions', 'list', filters] as const,
  },

  // Approaches related queries
  approaches: {
    all: ['approaches'] as const,
    byQuestion: (questionId: string, userId: string) => ['approaches', 'question', questionId, userId] as const,
    byUser: (userId: string) => ['approaches', 'user', userId] as const,
    detail: (id: string) => ['approaches', 'detail', id] as const,
    sizeUsage: (questionId: string, userId: string) => ['approaches', 'sizeUsage', questionId, userId] as const,
  },

  // Progress related queries
  progress: {
    all: ['progress'] as const,
    stats: (userId: string) => ['progress', 'stats', userId] as const,
    recent: (userId: string) => ['progress', 'recent', userId] as const,
    byQuestion: (questionId: string, userId: string) => ['progress', 'question', questionId, userId] as const,
    byCategory: (categoryId: string, userId: string) => ['progress', 'category', categoryId, userId] as const,
    byUser: (userId: string) => ['progress', 'user', userId] as const,
    list: (filters: ProgressFilters) => ['progress', 'list', filters] as const,
  },

  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters: UserFilters) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    profile: (id: string) => ['users', 'profile', id] as const,
  },

  // Compiler related queries
  compiler: {
    execute: ['compiler', 'execute'] as const,
    languages: ['compiler', 'languages'] as const,
    runtimes: ['compiler', 'runtimes'] as const,
    health: ['compiler', 'health'] as const,
  },

  // Admin related queries
  admin: {
    stats: ['admin', 'stats'] as const,
    settings: ['admin', 'settings'] as const,
    logs: ['admin', 'logs'] as const,
  },
} as const;

// Create and export the query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});