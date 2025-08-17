// src/lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: unknown) => {
        // Don't retry on 401/403 errors
        if (error && typeof error === 'object' && 'response' in error) {
          const response = (error as { response?: { status?: number } }).response;
          if (response?.status === 401 || response?.status === 403) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: false,
    },
  },
});

// Query Keys - organized by feature
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
  },
  
  // Dashboard
  dashboard: {
    stats: (userId: string) => ['dashboard', 'stats', userId] as const,
    overview: ['dashboard', 'overview'] as const,
  },
  
  // Progress
  progress: {
    byQuestion: (questionId: string, userId: string) => 
      ['progress', 'question', questionId, 'user', userId] as const,
    stats: (userId: string) => ['progress', 'stats', userId] as const,
    details: (userId: string) => ['progress', 'details', userId] as const,
    recent: (userId: string) => ['progress', 'recent', userId] as const,
    byCategory: (categoryId: string, userId: string) => 
      ['progress', 'category', categoryId, 'user', userId] as const,
  },
  
  // Activity
  activity: {
    recent: (userId: string, limit: number) => ['activity', 'recent', userId, limit] as const,
    feed: ['activity', 'feed'] as const,
  },
  
  // Leaderboard
  leaderboard: {
    top: (limit: number) => ['leaderboard', 'top', limit] as const,
    category: (categoryId: string) => ['leaderboard', 'category', categoryId] as const,
  },
  
  // Categories
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', id] as const,
    stats: (id: string) => ['categories', id, 'stats'] as const,
  },
  
  // Questions
  questions: {
    all: ['questions'] as const,
    list: (filters: Record<string, unknown>) => ['questions', 'list', filters] as const,
    detail: (id: string) => ['questions', id] as const,
    byCategory: (categoryId: string) => ['questions', 'category', categoryId] as const,
    counts: ['questions', 'counts'] as const,
    search: (term: string) => ['questions', 'search', term] as const,
  },
  
  // Solutions
  solutions: {
    all: ['solutions'] as const,
    detail: (id: string) => ['solutions', id] as const,
    byQuestion: (questionId: string) => ['solutions', 'question', questionId] as const,
  },
  
  // Approaches
  approaches: {
    byQuestion: (questionId: string, userId: string) => 
      ['approaches', 'question', questionId, 'user', userId] as const,
    detail: (id: string) => ['approaches', id] as const,
    sizeUsage: (questionId: string, userId: string) => 
      ['approaches', 'size-usage', questionId, userId] as const,
  },
  
  // Compiler
  compiler: {
    runtimes: ['compiler', 'runtimes'] as const,
    languages: ['compiler', 'languages'] as const,
    health: ['compiler', 'health'] as const,
  },
  
  // Admin
  admin: {
    systemStats: ['admin', 'system', 'stats'] as const,
    users: (filters: Record<string, unknown>) => ['admin', 'users', filters] as const,
    userDetail: (userId: string) => ['admin', 'users', userId] as const,
  },
} as const;