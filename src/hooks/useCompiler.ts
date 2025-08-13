// src/hooks/useCompiler.ts

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
  setRuntimesError,
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

// Get compiler state
export function useCompilerState() {
  return useAppSelector(state => state.compiler);
}

// Get supported languages and runtimes
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
        
        if (response.success) {
          // Ensure aliases is always an array
          const runtimesData: RuntimeData[] = response.data.map(runtime => ({
            ...runtime,
            aliases: runtime.aliases || []
          }));
          
          dispatch(setRuntimesSuccess(runtimesData));
          return runtimesData;
        } else {
          throw new Error('Failed to fetch runtimes');
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        const message = apiError?.response?.data?.message || 'Failed to fetch runtimes';
        dispatch(setRuntimesError(message));
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Get supported languages only
export function useLanguages() {
  return useQuery({
    queryKey: queryKeys.compiler.languages,
    queryFn: async (): Promise<string[]> => {
      try {
        const response = await api.get<{
          success: boolean;
          data: string[];
        }>('/compiler/languages');
        
        return response.success ? response.data : [];
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        // Return fallback languages
        return ['javascript', 'python', 'java', 'cpp', 'c', 'go', 'rust'];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Check compiler health
export function useCompilerHealth() {
  return useQuery({
    queryKey: queryKeys.compiler.health,
    queryFn: async () => {
      const response = await api.get<{
        status: string;
        message: string;
        timestamp: string;
      }>('/compiler/health');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// Execute code mutation
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
        
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Execution failed');
        }
      } catch (error: unknown) {
        const apiError = error as ApiError;
        // Handle different types of errors
        if (apiError?.response?.status === 408) {
          throw new Error('Code execution timed out (30s limit exceeded)');
        } else if (apiError?.response?.status === 429) {
          throw new Error('Too many requests. Please wait before executing again.');
        } else if (apiError?.response?.data?.message) {
          throw new Error(apiError.response.data.message);
        } else {
          throw new Error('Code execution failed. Please try again.');
        }
      }
    },
    onSuccess: (result) => {
      dispatch(setExecutionSuccess(result));
      
      // Show success toast for successful execution
      if (result.run.code === 0) {
        dispatch(addToast({
          title: 'Execution Successful',
          description: `Code executed successfully in ${result.language} ${result.version}`,
          type: 'success',
        }));
      } else {
        // Show warning for non-zero exit codes
        dispatch(addToast({
          title: 'Execution Completed',
          description: `Code finished with exit code ${result.run.code}`,
          type: 'warning',
        }));
      }
    },
    onError: (error: unknown) => {
      const apiError = error as ApiError;
      const message = apiError?.message || 'Code execution failed';
      dispatch(setExecutionError(message));
      
      dispatch(addToast({
        title: 'Execution Failed',
        description: message,
        type: 'error',
      }));
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
  
  return {
    versions: runtimes?.filter(r => r.language === language).map(r => r.version) || [],
    defaultVersion: runtimes?.find(r => r.language === language)?.version || '',
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

// Keyboard shortcuts hook
export function useCompilerShortcuts(onExecute: () => void, onSave: () => void) {
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      // Ctrl+Enter or Cmd+Enter to execute
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        onExecute();
      }
      
      // Ctrl+S or Cmd+S to save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        onSave();
      }
    };
    
    document.addEventListener('keydown', handleKeyboard);
    
    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [onExecute, onSave]);
}

// Auto-save functionality
export function useAutoSave(code: string, language: string, delay: number = 2000) {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Save to localStorage as backup
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