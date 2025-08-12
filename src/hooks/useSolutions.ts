// src/hooks/useSolutions.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Solution, SolutionFormData } from '@/types';

// Get solutions for a question
export function useSolutions(questionId: string) {
  return useQuery({
    queryKey: queryKeys.solutions.byQuestion(questionId),
    queryFn: () => api.get<Solution[]>(`/dsa/questions/${questionId}/solutions`),
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get solution by ID
export function useSolution(id: string) {
  return useQuery({
    queryKey: queryKeys.solutions.detail(id),
    queryFn: () => api.get<Solution>(`/dsa/solutions/${id}`),
    enabled: !!id,
  });
}

// Create solution (Admin only)
export function useCreateSolution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: SolutionFormData }) =>
      api.post<Solution>(`/dsa/questions/${questionId}/solutions`, data),
    onSuccess: (newSolution, { questionId }) => {
      // Update solutions cache
      queryClient.setQueryData<Solution[]>(
        queryKeys.solutions.byQuestion(questionId),
        (old) => old ? [...old, newSolution] : [newSolution]
      );
      
      // Invalidate question detail to refresh solution count
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.detail(questionId)
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Solution created successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to create solution';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update solution (Admin only)
export function useUpdateSolution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SolutionFormData }) =>
      api.put<Solution>(`/dsa/solutions/${id}`, data),
    onSuccess: (updatedSolution) => {
      // Update solution detail cache
      queryClient.setQueryData(
        queryKeys.solutions.detail(updatedSolution.id),
        updatedSolution
      );
      
      // Update solutions list cache
      if (updatedSolution.questionId) {
        queryClient.setQueryData<Solution[]>(
          queryKeys.solutions.byQuestion(updatedSolution.questionId),
          (old) => 
            old?.map(sol => 
              sol.id === updatedSolution.id ? updatedSolution : sol
            ) || []
        );
      }
      
      dispatch(addToast({
        title: 'Success',
        description: 'Solution updated successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to update solution';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete solution (Admin only)
export function useDeleteSolution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/solutions/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from all relevant caches
      queryClient.removeQueries({
        queryKey: queryKeys.solutions.detail(deletedId)
      });
      
      // Remove from solutions lists
      queryClient.setQueriesData<Solution[]>(
        { queryKey: queryKeys.solutions.byQuestion('') },
        (old) => old?.filter(sol => sol.id !== deletedId) || []
      );
      
      dispatch(addToast({
        title: 'Success',
        description: 'Solution deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to delete solution';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}