// src/lib/query-client.ts - Updated queryKeys section

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
    list: (filters: Record<string, any>) => ['questions', 'list', filters] as const,
    detail: (id: string) => ['questions', 'detail', id] as const,
    counts: ['questions', 'counts'] as const,
    search: (query: string) => ['questions', 'search', query] as const,
  },

  // Categories related queries
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
    stats: (id: string) => ['categories', 'stats', id] as const,
  },

  // Solutions related queries
  solutions: {
    all: ['solutions'] as const,
    byQuestion: (questionId: string) => ['solutions', 'question', questionId] as const,
    detail: (id: string) => ['solutions', 'detail', id] as const,
  },

  // Approaches related queries
  approaches: {
    all: ['approaches'] as const,
    byQuestion: (questionId: string) => ['approaches', 'question', questionId] as const,
    byUser: (userId: string) => ['approaches', 'user', userId] as const,
    detail: (id: string) => ['approaches', 'detail', id] as const,
  },

  // Progress related queries
  progress: {
    all: ['progress'] as const,
    stats: (userId: string) => ['progress', 'stats', userId] as const,
    recent: (userId: string) => ['progress', 'recent', userId] as const,
    byQuestion: (questionId: string, userId: string) => ['progress', 'question', questionId, userId] as const,
    byCategory: (categoryId: string, userId: string) => ['progress', 'category', categoryId, userId] as const,
    byUser: (userId: string) => ['progress', 'user', userId] as const,
  },

  // Users related queries
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters: Record<string, any>) => ['users', 'list', filters] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    profile: (id: string) => ['users', 'profile', id] as const,
  },

  // Compiler related queries
  compiler: {
    execute: ['compiler', 'execute'] as const,
    languages: ['compiler', 'languages'] as const,
  },

  // Admin related queries
  admin: {
    stats: ['admin', 'stats'] as const,
    settings: ['admin', 'settings'] as const,
    logs: ['admin', 'logs'] as const,
  },
} as const;