// src/hooks/useProgress.ts - FIXED TO MATCH BACKEND

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

interface ProgressStats {
  totalSolved: number;
  totalQuestions: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
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
  streak: number;
  recentSolved: number;
}

interface RecentProgressItem {
  id: string;
  questionId: string;
  questionTitle: string;
  level: string;
  solved: boolean;
  solvedAt: string;
}

// Get user's progress for a specific question
export function useQuestionProgress(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byQuestion(questionId, user?.id || ''),
    queryFn: async (): Promise<UserProgress | null> => {
      try {
        const response = await api.get<UserProgress>(`/questions/${questionId}/progress`);
        return response;
      } catch (error) {
        // Return null if no progress exists yet
        return null;
      }
    },
    enabled: !!questionId && !!user?.id,
    retry: false, // Don't retry if progress doesn't exist
  });
}

// Get user's overall progress statistics
export function useProgressStats() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.stats(user?.id || ''),
    queryFn: async (): Promise<ProgressStats> => {
      try {
        const response = await api.get<ProgressStats>('/users/progress');
        return response;
      } catch (error) {
        console.error('Failed to fetch progress stats:', error);
        // Return default stats if API fails
        return {
          totalSolved: 0,
          totalQuestions: 0,
          solvedByLevel: { easy: 0, medium: 0, hard: 0 },
          totalByLevel: { easy: 0, medium: 0, hard: 0 },
          progressPercentage: 0,
          progressByLevel: { easy: 0, medium: 0, hard: 0 },
          streak: 0,
          recentSolved: 0,
        };
      }
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false, // Use fallback instead of retrying
  });
}

// Get user's recent progress
export function useRecentProgress() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.recent(user?.id || ''),
    queryFn: async (): Promise<RecentProgressItem[]> => {
      try {
        const response = await api.get<RecentProgressItem[]>('/users/progress/recent');
        return response || [];
      } catch (error) {
        console.error('Failed to fetch recent progress:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    retry: false, // Return empty array instead of retrying
  });
}

// Get user's progress in a specific category
export function useCategoryProgress(categoryId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.progress.byCategory(categoryId, user?.id || ''),
    queryFn: async () => {
      try {
        const response = await api.get<{
          totalInCategory: number;
          solvedInCategory: number;
          solvedByLevel: {
            easy: number;
            medium: number;
            hard: number;
          };
          categoryProgressPercentage: number;
        }>(`/categories/${categoryId}/progress`);
        return response;
      } catch (error) {
        console.error('Failed to fetch category progress:', error);
        return {
          totalInCategory: 0,
          solvedInCategory: 0,
          solvedByLevel: { easy: 0, medium: 0, hard: 0 },
          categoryProgressPercentage: 0,
        };
      }
    },
    enabled: !!categoryId && !!user?.id,
    retry: false,
  });
}

// Update question progress (mark as solved/unsolved)
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async ({ questionId, solved }: { questionId: string; solved: boolean }): Promise<ProgressResponse> => {
      const response = await api.post<ProgressResponse>(`/questions/${questionId}/progress`, { solved });
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
      
      // Update Redux store (if you have this action)
      try {
        dispatch(updateQuestionProgress({
          questionId,
          solved,
          solvedAt: progressData?.solvedAt || undefined,
        }));
      } catch (error) {
        // Ignore if Redux action doesn't exist
        console.warn('updateQuestionProgress action not found:', error);
      }
      
      // Invalidate related caches
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.stats(user?.id || '')
      });
      
      queryClient.invalidateQueries({
        queryKey: queryKeys.progress.recent(user?.id || '')
      });
      
      dispatch(addToast({
        title: solved ? 'Question Solved! 🎉' : 'Progress Updated',
        description: solved 
          ? 'Great job! Keep up the momentum.' 
          : 'Question marked as unsolved.',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || error?.message || 'Failed to update progress';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Get all solved questions for current user
export function useSolvedQuestions() {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: ['progress', 'solved', user?.id || ''],
    queryFn: async (): Promise<RecentProgressItem[]> => {
      try {
        const response = await api.get<RecentProgressItem[]>('/users/progress/solved');
        return response || [];
      } catch (error) {
        console.error('Failed to fetch solved questions:', error);
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}