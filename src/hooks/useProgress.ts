// src/hooks/useProgress.ts - Updated to match backend endpoints

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { updateQuestionProgress } from '@/store/slices/questionsSlice';
import { progressApi } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { UserProgress } from '@/types';
import { useCurrentUser } from './useAuth';

// Get user's progress for a specific question
export function useQuestionProgress(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byQuestion(questionId, user?.id || ''),
    queryFn: () => progressApi.getQuestionProgress(questionId),
    enabled: !!questionId && !!user?.id,
  });
}

// Get user's overall progress statistics
export function useProgressStats() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.stats(user?.id || ''),
    queryFn: () => progressApi.getUserStats(),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get user's recent progress
export function useRecentProgress() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.recent(user?.id || ''),
    queryFn: () => progressApi.getUserRecent(),
    enabled: !!user?.id,
  });
}

// Get user's progress in a specific category
export function useCategoryProgress(categoryId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byCategory(categoryId, user?.id || ''),
    queryFn: () => progressApi.getCategoryProgress(categoryId),
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
      progressApi.updateQuestionProgress(questionId, { solved }),
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