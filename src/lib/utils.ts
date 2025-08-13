// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { QuestionLevel, User, UserRole } from "@/types";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date
export function formatDate(date: string | Date): string {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(d);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

// Get difficulty color classes
export function getDifficultyColor(level: QuestionLevel): string {
  switch (level) {
    case QuestionLevel.EASY:
      return 'text-green-600 bg-green-50';
    case QuestionLevel.MEDIUM:
      return 'text-yellow-600 bg-yellow-50';
    case QuestionLevel.HARD:
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

// Format content size (bytes to KB)
export function formatContentSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// Calculate remaining size for approaches (15KB limit)
export function calculateRemainingSize(usedBytes: number): {
  remaining: number;
  percentage: number;
  isNearLimit: boolean;
} {
  const maxSize = 15 * 1024; // 15KB
  const remaining = Math.max(0, maxSize - usedBytes);
  const percentage = (usedBytes / maxSize) * 100;
  const isNearLimit = percentage >= 80;
  
  return {
    remaining,
    percentage: Math.min(100, percentage),
    isNearLimit
  };
}

// Truncate text
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Validate image file
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'Image size must be less than 2MB'
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPEG, PNG, GIF and WebP images are allowed'
    };
  }
  
  return { isValid: true };
}

// Validate HTML file
export function validateHtmlFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 500 * 1024; // 500KB
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'HTML file size must be less than 500KB'
    };
  }
  
  if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
    return {
      isValid: false,
      error: 'Only HTML files are allowed'
    };
  }
  
  return { isValid: true };
}

// API Error interface for consistent error handling
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

// Extract error message from API response
export function getErrorMessage(error: ApiError | string | unknown): string {
  if (typeof error === 'string') return error;
  
  const apiError = error as ApiError;
  if (apiError?.response?.data?.message) return apiError.response.data.message;
  if (apiError?.response?.data?.error) return apiError.response.data.error;
  if (apiError?.message) return apiError.message;
  
  return 'An unexpected error occurred';
}

// Check if user has admin role
export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
}

// Check if user has superadmin role
export function isSuperAdmin(user: User | null | undefined): boolean {
  return user?.role === UserRole.SUPERADMIN;
}

// Generate random ID (for temporary use)
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Debounce function with proper typing
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}