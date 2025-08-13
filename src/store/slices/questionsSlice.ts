// src/store/slices/questionsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionDetail, Category, QuestionLevel } from '@/types';

// Extended Question interface to include progress information
interface QuestionWithProgress extends Question {
  solved?: boolean;
  solvedAt?: string;
}

interface QuestionsState {
  categories: Category[];
  questions: QuestionWithProgress[];
  currentQuestion: QuestionDetail | null;
  filters: {
    category: string;
    level: QuestionLevel | '';
    search: string;
  };
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  loading: {
    categories: boolean;
    questions: boolean;
    currentQuestion: boolean;
  };
  error: string | null;
}

const initialState: QuestionsState = {
  categories: [],
  questions: [],
  currentQuestion: null,
  filters: {
    category: '',
    level: '',
    search: '',
  },
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  },
  loading: {
    categories: false,
    questions: false,
    currentQuestion: false,
  },
  error: null,
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    // Categories
    setCategoriesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.categories = action.payload;
    },
    
    setCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading.categories = false;
      state.error = null;
    },
    
    setCategoriesError: (state, action: PayloadAction<string>) => {
      state.loading.categories = false;
      state.error = action.payload;
    },
    
    // Questions
    setQuestionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.questions = action.payload;
    },
    
    setQuestionsSuccess: (state, action: PayloadAction<{
      content: Question[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>) => {
      state.questions = action.payload.content;
      state.pagination = {
        page: action.payload.number,
        size: action.payload.size,
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
      };
      state.loading.questions = false;
      state.error = null;
    },
    
    setQuestionsError: (state, action: PayloadAction<string>) => {
      state.loading.questions = false;
      state.error = action.payload;
    },
    
    // Current Question
    setCurrentQuestionLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.currentQuestion = action.payload;
    },
    
    setCurrentQuestionSuccess: (state, action: PayloadAction<QuestionDetail>) => {
      state.currentQuestion = action.payload;
      state.loading.currentQuestion = false;
      state.error = null;
    },
    
    setCurrentQuestionError: (state, action: PayloadAction<string>) => {
      state.loading.currentQuestion = false;
      state.error = action.payload;
    },
    
    // Update question solved status
    updateQuestionProgress: (state, action: PayloadAction<{
      questionId: string;
      solved: boolean;
      solvedAt?: string;
    }>) => {
      // Update in current question
      if (state.currentQuestion?.id === action.payload.questionId) {
        state.currentQuestion.solved = action.payload.solved;
        state.currentQuestion.solvedAt = action.payload.solvedAt;
      }
      
      // Update in questions list
      const questionIndex = state.questions.findIndex(q => q.id === action.payload.questionId);
      if (questionIndex !== -1) {
        // Type-safe update with progress information
        state.questions[questionIndex] = {
          ...state.questions[questionIndex],
          solved: action.payload.solved,
          solvedAt: action.payload.solvedAt,
        };
      }
    },
    
    // Filters
    setFilter: (state, action: PayloadAction<{
      key: keyof QuestionsState['filters'];
      value: string;
    }>) => {
      const { key, value } = action.payload;
      
      // Type-safe filter update
      if (key === 'level') {
        state.filters[key] = value as QuestionLevel | '';
      } else {
        state.filters[key] = value;
      }
      
      // Reset pagination when filters change
      state.pagination.page = 0;
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: '',
        level: '',
        search: '',
      };
      state.pagination.page = 0;
    },
    
    // Pagination
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.size = action.payload;
      state.pagination.page = 0; // Reset to first page
    },
    
    // Add new question (for admin)
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload);
      state.pagination.totalElements += 1;
    },
    
    // Update question (for admin)
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = {
          ...state.questions[index],
          ...action.payload,
        };
      }
      
      // Update current question if it matches
      if (state.currentQuestion?.id === action.payload.id) {
        state.currentQuestion = {
          ...state.currentQuestion,
          ...action.payload,
        };
      }
    },
    
    // Remove question (for admin)
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(q => q.id !== action.payload);
      state.pagination.totalElements -= 1;
      
      // Clear current question if it matches
      if (state.currentQuestion?.id === action.payload) {
        state.currentQuestion = null;
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetQuestions: (state) => {
      state.questions = [];
      state.currentQuestion = null;
      state.pagination = initialState.pagination;
      state.error = null;
    },
  },
});

export const {
  setCategoriesLoading,
  setCategoriesSuccess,
  setCategoriesError,
  setQuestionsLoading,
  setQuestionsSuccess,
  setQuestionsError,
  setCurrentQuestionLoading,
  setCurrentQuestionSuccess,
  setCurrentQuestionError,
  updateQuestionProgress,
  setFilter,
  clearFilters,
  setPage,
  setPageSize,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearError,
  resetQuestions,
} = questionsSlice.actions;

export default questionsSlice.reducer;