// src/hooks/useQuestions.ts  

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Question, QuestionDetail, PaginatedResponse, QuestionFormData } from '@/types';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

interface QuestionsParams {
  page?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
}

interface QuestionCounts {
  total: number;
  byLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  byCategory: Record<string, {
    name: string;
    count: number;
  }>;
}

// Get paginated questions
export function useQuestions(params: QuestionsParams = {}) {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: async (): Promise<PaginatedResponse<Question>> => {
      const response = await api.get<PaginatedResponse<Question>>('/dsa/questions', params);
      return response;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get question detail with solutions and user progress
export function useQuestionDetail(questionId: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(questionId),
    queryFn: async (): Promise<QuestionDetail> => {
      const response = await api.get<QuestionDetail>(`/dsa/questions/${questionId}`);
      return response;
    },
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get question counts/statistics
export function useQuestionCounts() {
  return useQuery({
    queryKey: queryKeys.questions.counts,
    queryFn: async (): Promise<QuestionCounts> => {
      const response = await api.get<QuestionCounts>('/dsa/questions/counts');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Search questions
export function useSearchQuestions(query: string) {
  return useQuery({
    queryKey: queryKeys.questions.search(query),
    queryFn: async (): Promise<Question[]> => {
      const response = await api.get<Question[]>(`/dsa/questions/search?q=${encodeURIComponent(query)}`);
      return response;
    },
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Create question (Admin only)
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (data: QuestionFormData): Promise<Question> => {
      const response = await api.post<Question>('/dsa/questions', data);
      return response;
    },
    onSuccess: (newQuestion: Question) => {
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      dispatch(addToast({
        title: 'Question Created',
        description: `"${newQuestion.title}" has been created successfully.`,
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update question (Admin only)
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({ questionId, data }: { questionId: string; data: QuestionFormData }): Promise<Question> => {
      const response = await api.put<Question>(`/dsa/questions/${questionId}`, data);
      return response;
    },
    onSuccess: (updatedQuestion: Question, { questionId }) => {
      // Update specific question cache
      queryClient.setQueryData(
        queryKeys.questions.detail(questionId),
        updatedQuestion
      );
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      dispatch(addToast({
        title: 'Question Updated',
        description: `"${updatedQuestion.title}" has been updated successfully.`,
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete question (Admin only)
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (questionId: string): Promise<void> => {
      await api.delete(`/dsa/questions/${questionId}`);
    },
    onSuccess: (_, questionId) => {
      // Remove from question detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.questions.detail(questionId)
      });
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      // Invalidate progress data (since question is deleted)
      queryClient.invalidateQueries({
        queryKey: ['progress']
      });
      
      dispatch(addToast({
        title: 'Question Deleted',
        description: 'Question has been deleted successfully.',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}