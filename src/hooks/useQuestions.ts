// src/hooks/useQuestions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Question, QuestionDetail, PaginatedResponse, QuestionFormData } from '@/types';

// Get paginated questions with filters
export function useQuestions(params: {
  page?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () => 
      api.get<PaginatedResponse<Question>>('/dsa/questions', params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get question detail with solutions and progress
export function useQuestionDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(id),
    queryFn: () => api.get<QuestionDetail>(`/dsa/questions/${id}`),
    enabled: !!id,
  });
}

// Get questions by category
export function useQuestionsByCategory(categoryId: string, params: {
  page?: number;
  size?: number;
} = {}) {
  return useQuery({
    queryKey: queryKeys.questions.byCategory(categoryId),
    queryFn: () => 
      api.get<PaginatedResponse<Question>>(`/dsa/questions/category/${categoryId}`, params),
    enabled: !!categoryId,
  });
}

// Get question counts
export function useQuestionCounts() {
  return useQuery({
    queryKey: queryKeys.questions.counts,
    queryFn: () => api.get<{
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
    }>('/dsa/questions/counts'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Search questions
export function useSearchQuestions(searchTerm: string) {
  return useQuery({
    queryKey: queryKeys.questions.search(searchTerm),
    queryFn: () => api.get<Question[]>(`/dsa/questions/search?q=${encodeURIComponent(searchTerm)}`),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Create question mutation (Admin only)
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: QuestionFormData) => 
      api.post<Question>('/dsa/questions', data),
    onSuccess: (newQuestion) => {
      // Invalidate questions lists to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.all
      });
      
      // Invalidate counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      dispatch(addToast({
        title: 'Success',
        description: `Question "${newQuestion.title}" created successfully`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to create question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update question mutation (Admin only)
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionFormData }) =>
      api.put<Question>(`/dsa/questions/${id}`, data),
    onSuccess: (updatedQuestion) => {
      // Update question detail cache
      queryClient.setQueryData(
        queryKeys.questions.detail(updatedQuestion.id),
        (old: QuestionDetail | undefined) => 
          old ? { ...old, question: updatedQuestion } : undefined
      );
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.all
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Question updated successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to update question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete question mutation (Admin only)
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/questions/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove question detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.questions.detail(deletedId)
      });
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.all
      });
      
      // Invalidate counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Question and all related data deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to delete question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}