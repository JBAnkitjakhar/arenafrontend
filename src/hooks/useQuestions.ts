// src/hooks/useQuestions.ts - Updated to match backend endpoints

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { questionsApi } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Question, QuestionDetail, PaginatedResponse } from '@/types';

interface QuestionsParams {
  page?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
}

// Get paginated questions
export function useQuestions(params: QuestionsParams = {}) {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () => questionsApi.getAll({
      page: params.page || 0,
      size: params.size || 20,
      categoryId: params.category,
      level: params.level,
      search: params.search,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get question detail with solutions and user progress
export function useQuestionDetail(questionId: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(questionId),
    queryFn: () => questionsApi.getById(questionId),
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get question counts/statistics
export function useQuestionCounts() {
  return useQuery({
    queryKey: queryKeys.questions.counts,
    queryFn: () => questionsApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Search questions
export function useSearchQuestions(query: string) {
  return useQuery({
    queryKey: queryKeys.questions.search(query),
    queryFn: () => questionsApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Create question (Admin only)
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: any) => questionsApi.create(data),
    onSuccess: (newQuestion) => {
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
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

// Update question (Admin only)
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: any }) =>
      questionsApi.update(questionId, data),
    onSuccess: (updatedQuestion, { questionId }) => {
      // Update specific question cache
      queryClient.setQueryData(
        queryKeys.questions.detail(questionId),
        updatedQuestion
      );
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      dispatch(addToast({
        title: 'Question Updated',
        description: `"${updatedQuestion.title}" has been updated successfully.`,
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

// Delete question (Admin only)
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (questionId: string) => questionsApi.delete(questionId),
    onSuccess: (_, questionId) => {
      // Remove from question detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.questions.detail(questionId)
      });
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      // Invalidate progress data (since question is deleted)
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.all
      });
      
      dispatch(addToast({
        title: 'Question Deleted',
        description: 'Question has been deleted successfully.',
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