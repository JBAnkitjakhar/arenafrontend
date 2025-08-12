// src/hooks/useApproaches.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Approach, ApproachFormData } from '@/types';
import { useCurrentUser } from './useAuth';

// Get user's approaches for a question
export function useApproaches(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.approaches.byQuestion(questionId, user?.id || ''),
    queryFn: () => api.get<Approach[]>(`/dsa/questions/${questionId}/approaches`),
    enabled: !!questionId && !!user?.id,
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

// Get size usage for user on a question
export function useApproachSizeUsage(questionId: string) {
  const { user } = useCurrentUser();
  
  return useQuery({
    queryKey: queryKeys.approaches.sizeUsage(questionId, user?.id || ''),
    queryFn: () => api.get<{
      totalUsed: number;
      totalUsedKB: number;
      remaining: number;
      remainingKB: number;
      maxAllowed: number;
      maxAllowedKB: number;
      usagePercentage: number;
      approachCount: number;
      maxApproaches: number;
    }>(`/dsa/approaches/size-usage/${questionId}`),
    enabled: !!questionId && !!user?.id,
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
        
        // Invalidate size usage
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
    onError: (error: any) => {
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
            old?.map(app => 
              app.id === updatedApproach.id ? updatedApproach : app
            ) || []
        );
        
        // Invalidate size usage
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
    onError: (error: any) => {
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
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/approaches/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from approach detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.approaches.detail(deletedId)
      });
      
      // Remove from approaches lists
      if (user?.id) {
        queryClient.setQueriesData<Approach[]>(
          { queryKey: queryKeys.approaches.byQuestion('', user.id) },
          (old) => old?.filter(app => app.id !== deletedId) || []
        );
        
        // Invalidate size usage for all questions
        queryClient.invalidateQueries({
          queryKey: ['approaches', 'size-usage']
        });
      }
      
      dispatch(addToast({
        title: 'Success',
        description: 'Approach deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to delete approach';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}