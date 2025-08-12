// src/store/slices/compilerSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecutionResponse } from '@/types';

interface CompilerState {
  code: string;
  language: string;
  version: string;
  stdin: string;
  output: ExecutionResponse | null;
  isExecuting: boolean;
  isLoadingRuntimes: boolean;
  runtimes: Array<{
    language: string;
    version: string;
    aliases: string[];
  }>;
  supportedLanguages: string[];
  error: string | null;
  history: Array<{
    id: string;
    code: string;
    language: string;
    output: ExecutionResponse;
    timestamp: string;
  }>;
}

const initialState: CompilerState = {
  code: '// Write your code here\nconsole.log("Hello, World!");',
  language: 'javascript',
  version: '18.15.0',
  stdin: '',
  output: null,
  isExecuting: false,
  isLoadingRuntimes: false,
  runtimes: [],
  supportedLanguages: [],
  error: null,
  history: [],
};

const compilerSlice = createSlice({
  name: 'compiler',
  initialState,
  reducers: {
    // Code management
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      // Find version for this language
      const runtime = state.runtimes.find(r => r.language === action.payload);
      if (runtime) {
        state.version = runtime.version;
      }
      
      // Set default code template based on language
      switch (action.payload) {
        case 'javascript':
          state.code = '// Write your JavaScript code here\nconsole.log("Hello, World!");';
          break;
        case 'python':
          state.code = '# Write your Python code here\nprint("Hello, World!")';
          break;
        case 'java':
          state.code = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
          break;
        case 'cpp':
          state.code = `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`;
          break;
        default:
          state.code = '// Write your code here';
      }
    },
    
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
    },
    
    setStdin: (state, action: PayloadAction<string>) => {
      state.stdin = action.payload;
    },
    
    // Execution management
    setExecuting: (state, action: PayloadAction<boolean>) => {
      state.isExecuting = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    
    setExecutionSuccess: (state, action: PayloadAction<ExecutionResponse>) => {
      state.output = action.payload;
      state.isExecuting = false;
      state.error = null;
      
      // Add to history
      const historyItem = {
        id: Math.random().toString(36).substring(2, 15),
        code: state.code,
        language: state.language,
        output: action.payload,
        timestamp: new Date().toISOString(),
      };
      
      state.history.unshift(historyItem);
      
      // Keep only last 10 executions
      if (state.history.length > 10) {
        state.history = state.history.slice(0, 10);
      }
    },
    
    setExecutionError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isExecuting = false;
      state.output = null;
    },
    
    // Runtimes management
    setRuntimesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingRuntimes = action.payload;
    },
    
    setRuntimesSuccess: (state, action: PayloadAction<Array<{
      language: string;
      version: string;
      aliases: string[];
    }>>) => {
      state.runtimes = action.payload;
      state.supportedLanguages = [...new Set(action.payload.map(r => r.language))];
      state.isLoadingRuntimes = false;
      state.error = null;
    },
    
    setRuntimesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoadingRuntimes = false;
    },
    
    // History management
    clearHistory: (state) => {
      state.history = [];
    },
    
    removeHistoryItem: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    
    loadFromHistory: (state, action: PayloadAction<string>) => {
      const historyItem = state.history.find(item => item.id === action.payload);
      if (historyItem) {
        state.code = historyItem.code;
        state.language = historyItem.language;
        state.output = historyItem.output;
      }
    },
    
    // Reset
    resetCompiler: (state) => {
      state.code = initialState.code;
      state.stdin = '';
      state.output = null;
      state.error = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    clearOutput: (state) => {
      state.output = null;
    },
  },
});

export const {
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
  removeHistoryItem,
  loadFromHistory,
  resetCompiler,
  clearError,
  clearOutput,
} = compilerSlice.actions;

export default compilerSlice.reducer;