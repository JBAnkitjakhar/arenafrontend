// src/hooks/useProgress.ts - Updated to match backend endpoints

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { updateQuestionProgress } from '@/store/slices/questionsSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { UserProgress } from '@/types';
import { useCurrentUser } from './useAuth';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

interface ProgressResponse {
  solved: boolean;
  solvedAt?: string;
}

// Get user's progress for a specific question
export function useQuestionProgress(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byQuestion(questionId, user?.id || ''),
    queryFn: async (): Promise<UserProgress> => {
      const response = await api.get<UserProgress>(`/dsa/progress/question/${questionId}`);
      return response;
    },
    enabled: !!questionId && !!user?.id,
  });
}

// Get user's overall progress statistics
export function useProgressStats() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.stats(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{
        totalSolved: number;
        totalQuestions: number;
        solvedByLevel: {
          easy: number;
          medium: number;
          hard: number;
        };
        recentSolved: number;
        streak: number;
      }>('/dsa/progress/stats');
      return response;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get user's recent progress
export function useRecentProgress() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.recent(user?.id || ''),
    queryFn: async () => {
      const response = await api.get<Array<{
        questionId: string;
        questionTitle: string;
        solved: boolean;
        solvedAt: string;
      }>>('/dsa/progress/recent');
      return response;
    },
    enabled: !!user?.id,
  });
}

// Get user's progress in a specific category
export function useCategoryProgress(categoryId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byCategory(categoryId, user?.id || ''),
    queryFn: async () => {
      const response = await api.get<{
        totalQuestions: number;
        solvedQuestions: number;
        progressPercentage: number;
        solvedByLevel: {
          easy: number;
          medium: number;
          hard: number;
        };
      }>(`/dsa/progress/category/${categoryId}`);
      return response;
    },
    enabled: !!categoryId && !!user?.id,
  });
}

// Update question progress (mark as solved/unsolved)
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ questionId, solved }: { questionId: string; solved: boolean }): Promise<ProgressResponse> => {
      const response = await api.post<ProgressResponse>(`/dsa/progress/question/${questionId}`, { solved });
      return response;
    },
    onSuccess: (progressData: ProgressResponse, { questionId, solved }) => {
      // Update progress cache
      if (user?.id) {
        queryClient.setQueryData(
          queryKeys.progress.byQuestion(questionId, user.id),
          progressData
        );
      }
      
      // Update Redux store
      dispatch(updateQuestionProgress({
        questionId,
        solved,
        solvedAt: progressData?.solvedAt || undefined,
      }));
      
      // Invalidate related caches
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.stats(user?.id || '')
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.recent(user?.id || '')
      });
      
      dispatch(addToast({
        title: solved ? 'Question Solved!' : 'Progress Updated',
        description: solved 
          ? 'Great job! Keep up the momentum.' 
          : 'Question marked as unsolved.',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || 'Failed to update progress';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}