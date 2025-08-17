// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format file size
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Format number with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Calculate percentage
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

// Debounce function - properly typed
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function - properly typed
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Generate random ID
export function generateId(length = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Deep clone object - properly typed
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: unknown }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key as keyof T])
      }
    }
    return clonedObj as T
  }
  return obj
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get difficulty color
export function getDifficultyColor(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): string {
  switch (difficulty) {
    case 'EASY':
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    case 'MEDIUM':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
    case 'HARD':
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
  }
}

// Get programming language color
export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    javascript: 'text-yellow-600 bg-yellow-100',
    typescript: 'text-blue-600 bg-blue-100',
    python: 'text-green-600 bg-green-100',
    java: 'text-orange-600 bg-orange-100',
    cpp: 'text-purple-600 bg-purple-100',
    c: 'text-gray-600 bg-gray-100',
    go: 'text-cyan-600 bg-cyan-100',
    rust: 'text-red-600 bg-red-100',
    php: 'text-indigo-600 bg-indigo-100',
    ruby: 'text-rose-600 bg-rose-100',
  }
  
  return colors[language.toLowerCase()] || 'text-gray-600 bg-gray-100'
}

// Calculate reading time
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// Format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

// Local storage helpers
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error(`Error reading from localStorage:`, error)
      return defaultValue || null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage:`, error)
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage:`, error)
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage:`, error)
    }
  }
}

// Session storage helpers
export const sessionStorageUtil = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null
    
    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error(`Error reading from sessionStorage:`, error)
      return defaultValue || null
    }
  },
  
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to sessionStorage:`, error)
    }
  },
  
  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      window.sessionStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from sessionStorage:`, error)
    }
  }
}