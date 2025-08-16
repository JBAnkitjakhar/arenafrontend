// src/hooks/useCompiler.ts - FIXED VERSION

import { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store';
import { 
  setCode, 
  setLanguage, 
  setVersion, 
  setStdin,
  setExecuting,
  setExecutionSuccess,
  setExecutionError,
  setRuntimesLoading,
  setRuntimesSuccess,
  clearHistory,
  removeHistoryItem
} from '@/store/slices/compilerSlice';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { ExecutionRequest, ExecutionResponse } from '@/types';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

interface RuntimeData {
  language: string;
  version: string;
  aliases: string[];
}

// Fallback languages when API is down
const FALLBACK_LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust', 'csharp', 'php', 'ruby', 'kotlin', 'typescript'
];

// Fallback runtimes when API is down
const FALLBACK_RUNTIMES: RuntimeData[] = [
  { language: 'javascript', version: '18.15.0', aliases: ['js', 'node'] },
  { language: 'python', version: '3.10.0', aliases: ['py'] },
  { language: 'java', version: '15.0.2', aliases: [] },
  { language: 'cpp', version: '10.2.0', aliases: ['c++'] },
  { language: 'c', version: '10.2.0', aliases: [] },
  { language: 'go', version: '1.16.2', aliases: ['golang'] },
  { language: 'rust', version: '1.56.0', aliases: ['rs'] },
  { language: 'csharp', version: '6.12.0', aliases: ['cs', 'c#'] },
  { language: 'php', version: '8.1.0', aliases: [] },
  { language: 'ruby', version: '3.0.1', aliases: ['rb'] },
  { language: 'kotlin', version: '1.5.31', aliases: ['kt'] },
  { language: 'typescript', version: '4.4.4', aliases: ['ts'] },
];

// Get compiler state
export function useCompilerState() {
  return useAppSelector(state => state.compiler);
}

// Get supported languages and runtimes with fallback
export function useRuntimes() {
  const dispatch = useAppDispatch();
  
  return useQuery({
    queryKey: queryKeys.compiler.runtimes,
    queryFn: async (): Promise<RuntimeData[]> => {
      dispatch(setRuntimesLoading(true));
      try {
        const response = await api.get<{
          success: boolean;
          data: Array<{
            language: string;
            version: string;
            aliases?: string[];
          }>;
        }>('/compiler/runtimes');
        
        if (response.success && response.data) {
          // Ensure aliases is always an array
          const runtimesData: RuntimeData[] = response.data.map(runtime => ({
            ...runtime,
            aliases: runtime.aliases || []
          }));
          
          dispatch(setRuntimesSuccess(runtimesData));
          return runtimesData;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error: unknown) {
        console.warn('Failed to fetch runtimes from API, using fallback:', error);
        
        // Use fallback runtimes
        dispatch(setRuntimesSuccess(FALLBACK_RUNTIMES));
        return FALLBACK_RUNTIMES;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry, just use fallback
      return false;
    },
  });
}

// Get supported languages only with fallback
export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.compiler.languages,
    queryFn: async (): Promise<string[]> => {
      try {
        const response = await api.get<{
          success: boolean;
          data: string[];
        }>('/compiler/languages');
        
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.warn('Failed to fetch languages from API, using fallback:', error);
        // Return fallback languages
        return FALLBACK_LANGUAGES;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry, use fallback immediately
  });
}

// Check compiler health with fallback
export function useCompilerHealth() {
  return useQuery({
    queryKey: queryKeys.compiler.health,
    queryFn: async () => {
      try {
        const response = await api.get<{
          status: string;
          message: string;
          timestamp: string;
        }>('/compiler/health');
        return response;
      } catch (error) {
        console.warn('Compiler health check failed:', error);
        // Return offline status
        return {
          status: 'failed',
          message: 'Compiler service is currently unavailable',
          timestamp: new Date().toISOString()
        };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Don't retry health checks
  });
}

// Execute code mutation with better error handling
export function useExecuteCode() {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: async (request: ExecutionRequest): Promise<ExecutionResponse> => {
      dispatch(setExecuting(true));
      
      try {
        const response = await api.post<{
          success: boolean;
          data: ExecutionResponse;
          message?: string;
        }>('/compiler/execute', request);
        
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.message || 'Execution failed');
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        
        // Handle different types of errors with user-friendly messages
        if (apiError?.response?.status === 408) {
          throw new Error('Code execution timed out (30s limit exceeded)');
        } else if (apiError?.response?.status === 429) {
          throw new Error('Too many requests. Please wait before executing again.');
        } else if (apiError?.response?.status === 503) {
          throw new Error('Compiler service is currently unavailable. Please try again later.');
        } else if (apiError?.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else if (apiError?.message) {
          throw new Error(apiError.message);
        } else {
          throw new Error('Code execution failed. Please check your code and try again.');
        }
      }
    },
    onSuccess: (result) => {
      dispatch(setExecutionSuccess(result));
      
      // Show appropriate toast based on exit code
      if (result.run.code === 0) {
        dispatch(addToast({
          title: 'Execution Successful! 🎉',
          description: `Code executed successfully in ${result.language} ${result.version}`,
          type: 'success',
        }));
      } else {
        dispatch(addToast({
          title: 'Execution Completed ⚠️',
          description: `Code finished with exit code ${result.run.code}. Check the output for details.`,
          type: 'warning',
        }));
      }
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError?.message || 'Code execution failed';
      dispatch(setExecutionError(message));
      
      dispatch(addToast({
        title: 'Execution Failed ❌',
        description: message,
        type: 'error',
      }));
    },
    onSettled: () => {
      dispatch(setExecuting(false));
    },
  });
}

// Compiler actions
export function useCompilerActions() {
  const dispatch = useAppDispatch();
  
  return {
    // Code management
    updateCode: (code: string) => dispatch(setCode(code)),
    changeLanguage: (language: string) => dispatch(setLanguage(language)),
    changeVersion: (version: string) => dispatch(setVersion(version)),
    updateStdin: (stdin: string) => dispatch(setStdin(stdin)),
    
    // History management
    clearExecutionHistory: () => dispatch(clearHistory()),
    removeHistoryItem: (id: string) => dispatch(removeHistoryItem(id)),
    
    // Reset compiler state
    resetCompiler: () => {
      dispatch(setCode(''));
      dispatch(setStdin(''));
      dispatch(setExecutionError(''));
      dispatch(clearHistory());
    },
  };
}

// Get available versions for a specific language
export function useLanguageVersions(language: string) {
  const { data: runtimes } = useRuntimes();
  
  const versions = runtimes?.filter(r => r.language === language).map(r => r.version) || [];
  const defaultVersion = runtimes?.find(r => r.language === language)?.version || '';
  
  return {
    versions,
    defaultVersion,
  };
}

// Template code management
export function useCodeTemplates() {
  const dispatch = useAppDispatch();
  
  const templates = {
    javascript: 'console.log("Hello, World!");',
    python: 'print("Hello, World!")',
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    rust: `fn main() {
    println!("Hello, World!");
}`,
    csharp: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    php: '<?php\necho "Hello, World!\\n";\n?>',
    ruby: 'puts "Hello, World!"',
    kotlin: `fun main() {
    println("Hello, World!")
}`,
    typescript: 'console.log("Hello, World!");',
  };
  
  const loadTemplate = (language: string) => {
    const template = templates[language as keyof typeof templates] || templates.javascript;
    dispatch(setCode(template));
  };
  
  return {
    templates,
    loadTemplate,
    hasTemplate: (language: string) => language in templates,
  };
}

// Auto-save functionality
export function useAutoSave(code: string, language: string, delay: number = 2000) {
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saveData = {
          code,
          language,
          timestamp: Date.now(),
        };
        localStorage.setItem('compiler_autosave', JSON.stringify(saveData));
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [code, language, delay]);
}

// Load auto-saved code
export function useLoadAutoSave() {
  const dispatch = useAppDispatch();
  
  const loadAutoSave = () => {
    try {
      const saved = localStorage.getItem('compiler_autosave');
      if (saved) {
        const saveData = JSON.parse(saved);
        const timeDiff = Date.now() - saveData.timestamp;
        
        // Only load if saved within last 24 hours
        if (timeDiff < 24 * 60 * 60 * 1000) {
          dispatch(setCode(saveData.code));
          dispatch(setLanguage(saveData.language));
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load auto-save:', error);
    }
    return false;
  };
  
  const clearAutoSave = () => {
    try {
      localStorage.removeItem('compiler_autosave');
    } catch (error) {
      console.error('Failed to clear auto-save:', error);
    }
  };
  
  return {
    loadAutoSave,
    clearAutoSave,
  };
}