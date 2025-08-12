// src/hooks/useProgress.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { updateQuestionProgress } from '@/store/slices/questionsSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { UserProgress } from '@/types';
import { useCurrentUser } from './useAuth';

// Get user's progress for a specific question
export function useQuestionProgress(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byQuestion(questionId, user?.id || ''),
    queryFn: () => api.get<UserProgress>(`/dsa/questions/${questionId}/progress`),
    enabled: !!questionId && !!user?.id,
  });
}

// Get user's overall progress statistics
export function useProgressStats() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.stats(user?.id || ''),
    queryFn: () => api.get<{
      totalSolved: number;
      solvedByLevel: {
        easy: number;
        medium: number;
        hard: number;
      };
      totalQuestions: number;
      totalByLevel: {
        easy: number;
        medium: number;
        hard: number;
      };
      progressPercentage: number;
      progressByLevel: {
        easy: number;
        medium: number;
        hard: number;
      };
    }>('/dsa/users/progress'),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get user's recent progress
export function useRecentProgress() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.recent(user?.id || ''),
    queryFn: () => api.get<Array<{
      id: string;
      questionId: string;
      questionTitle: string;
      level: string;
      solvedAt: string;
    }>>('/dsa/users/progress/recent'),
    enabled: !!user?.id,
  });
}

// Get user's progress in a specific category
export function useCategoryProgress(categoryId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byCategory(categoryId, user?.id || ''),
    queryFn: () => api.get<{
      totalInCategory: number;
      solvedInCategory: number;
      solvedByLevel: {
        easy: number;
        medium: number;
        hard: number;
      };
      categoryProgressPercentage: number;
    }>(`/dsa/categories/${categoryId}/progress`),
    enabled: !!categoryId && !!user?.id,
  });
}

// Update question progress (mark as solved/unsolved)
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ questionId, solved }: { questionId: string; solved: boolean }) =>
      api.post<UserProgress>(`/dsa/questions/${questionId}/progress`, { solved }),
    onSuccess: (updatedProgress, { questionId, solved }) => {
      // Update progress cache
      if (user?.id) {
        queryClient.setQueryData(
          queryKeys.progress.byQuestion(questionId, user.id),
          updatedProgress
        );
      }
      
      // Update Redux store
      dispatch(updateQuestionProgress({
        questionId,
        solved,
        solvedAt: updatedProgress.solvedAt,
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
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to update progress';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}