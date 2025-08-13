// src/hooks/useApproaches.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Approach, ApproachFormData } from '@/types';
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

// Get approaches for a question by current user
export function useApproaches(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.approaches.byQuestion(questionId, user?.id || ''),
    queryFn: () => api.get<Approach[]>(`/dsa/questions/${questionId}/approaches`),
    enabled: !!questionId && !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get approach by ID
export function useApproach(id: string) {
  return useQuery({
    queryKey: queryKeys.approaches.detail(id),
    queryFn: () => api.get<Approach>(`/dsa/approaches/${id}`),
    enabled: !!id,
  });
}

// Get approaches size usage for a question
export function useApproachesSizeUsage(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.approaches.sizeUsage(questionId, user?.id || ''),
    queryFn: () => api.get<{
      totalApproaches: number;
      totalSize: number;
      averageSize: number;
      largestApproach: {
        id: string;
        size: number;
      };
    }>(`/dsa/questions/${questionId}/approaches/size-usage`),
    enabled: !!questionId && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create approach
export function useCreateApproach() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: ApproachFormData }) =>
      api.post<Approach>(`/dsa/questions/${questionId}/approaches`, data),
    onSuccess: (newApproach, { questionId }) => {
      // Update approaches cache
      if (user?.id) {
        queryClient.setQueryData<Approach[]>(
          queryKeys.approaches.byQuestion(questionId, user.id),
          (old) => old ? [...old, newApproach] : [newApproach]
        );
        
        // Invalidate size usage cache
        queryClient.invalidateQueries({
          queryKey: queryKeys.approaches.sizeUsage(questionId, user.id)
        });
      }
      
      dispatch(addToast({
        title: 'Success',
        description: 'Your approach has been saved successfully',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || 'Failed to save approach';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update approach
export function useUpdateApproach() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproachFormData }) =>
      api.put<Approach>(`/dsa/approaches/${id}`, data),
    onSuccess: (updatedApproach) => {
      // Update approach detail cache
      queryClient.setQueryData(
        queryKeys.approaches.detail(updatedApproach.id),
        updatedApproach
      );
      
      // Update approaches list cache
      if (user?.id && updatedApproach.questionId) {
        queryClient.setQueryData<Approach[]>(
          queryKeys.approaches.byQuestion(updatedApproach.questionId, user.id),
          (old) => 
            old?.map(approach => 
              approach.id === updatedApproach.id ? updatedApproach : approach
            )
        );
        
        // Invalidate size usage cache
        queryClient.invalidateQueries({
          queryKey: queryKeys.approaches.sizeUsage(updatedApproach.questionId, user.id)
        });
      }
      
      dispatch(addToast({
        title: 'Success',
        description: 'Approach updated successfully',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || 'Failed to update approach';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete approach
export function useDeleteApproach() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/approaches/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.approaches.detail(deletedId)
      });
      
      // Invalidate all approaches queries to refresh lists
      queryClient.invalidateQueries({
        queryKey: ['approaches']
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Approach deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || 'Failed to delete approach';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Get all approaches by user (for profile/progress tracking)
export function useUserApproaches(userId?: string) {
  const { user: currentUser } = useCurrentUser();
  const targetUserId = userId || currentUser?.id;
  
  return useQuery({
    queryKey: ['approaches', 'user', targetUserId],
    queryFn: () => api.get<Approach[]>(`/dsa/users/${targetUserId}/approaches`),
    enabled: !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}