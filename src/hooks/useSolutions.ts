// src/hooks/useSolutions.ts - Enhanced with YouTube support

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Solution, SolutionFormData, YouTubeValidationResponse } from '@/types';
import { enhanceSolutionWithYouTube } from '@/lib/youtube-utils';

// Get solutions for a question (enhanced with YouTube helpers)
export function useSolutions(questionId: string) {
  return useQuery({
    queryKey: queryKeys.solutions.byQuestion(questionId),
    queryFn: async () => {
      const solutions = await api.get<Solution[]>(`/dsa/questions/${questionId}/solutions`);
      // Enhance each solution with YouTube helper methods
      return solutions.map(enhanceSolutionWithYouTube);
    },
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get solution by ID (enhanced)
export function useSolution(id: string) {
  return useQuery({
    queryKey: queryKeys.solutions.detail(id),
    queryFn: async () => {
      const solution = await api.get<Solution>(`/dsa/solutions/${id}`);
      return enhanceSolutionWithYouTube(solution);
    },
    enabled: !!id,
  });
}

// NEW: Validate YouTube URL
export function useValidateYouTube() {
  const dispatch = useAppDispatch();
  
  return useMutation({
    mutationFn: (youtubeLink: string) =>
      api.post<YouTubeValidationResponse>('/dsa/solutions/validate-youtube', { youtubeLink }),
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to validate YouTube URL';
      dispatch(addToast({
        title: 'Validation Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// NEW: Get solutions with YouTube videos (Admin)
export function useSolutionsWithYouTube() {
  return useQuery({
    queryKey: ['solutions', 'with-youtube'],
    queryFn: async () => {
      const solutions = await api.get<Solution[]>('/dsa/solutions/with-youtube');
      return solutions.map(enhanceSolutionWithYouTube);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// NEW: Get solution statistics (Admin)
export function useSolutionStats() {
  return useQuery({
    queryKey: ['solutions', 'stats'],
    queryFn: () => api.get<{
      totalSolutions: number;
      solutionsWithImages: number;
      solutionsWithVisualizers: number;
      solutionsWithYoutubeVideos: number;
      solutionsWithDriveLinks: number;
      solutionsWithBothLinks: number;
    }>('/dsa/solutions/stats'),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create solution (Enhanced with YouTube)
export function useCreateSolution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: SolutionFormData }) =>
      api.post<Solution>(`/dsa/questions/${questionId}/solutions`, data),
    onSuccess: (newSolution, { questionId }) => {
      // Enhance the new solution
      const enhancedSolution = enhanceSolutionWithYouTube(newSolution);
      
      // Update solutions cache
      queryClient.setQueryData<Solution[]>(
        queryKeys.solutions.byQuestion(questionId),
        (old) => old ? [...old, enhancedSolution] : [enhancedSolution]
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.detail(questionId)
      });
      
      queryClient.invalidateQueries({
        queryKey: ['solutions', 'stats']
      });
      
      if (enhancedSolution.hasValidYoutubeLink) {
        queryClient.invalidateQueries({
          queryKey: ['solutions', 'with-youtube']
        });
      }
      
      dispatch(addToast({
        title: 'Success',
        description: enhancedSolution.hasValidYoutubeLink 
          ? 'Solution with video created successfully' 
          : 'Solution created successfully',
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

// Update solution (Enhanced with YouTube)
export function useUpdateSolution() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SolutionFormData }) =>
      api.put<Solution>(`/dsa/solutions/${id}`, data),
    onSuccess: (updatedSolution) => {
      // Enhance the updated solution
      const enhancedSolution = enhanceSolutionWithYouTube(updatedSolution);
      
      // Update solution detail cache
      queryClient.setQueryData(
        queryKeys.solutions.detail(enhancedSolution.id),
        enhancedSolution
      );
      
      // Update solutions list cache
      if (enhancedSolution.questionId) {
        queryClient.setQueryData<Solution[]>(
          queryKeys.solutions.byQuestion(enhancedSolution.questionId),
          (old) => 
            old?.map(sol => 
              sol.id === enhancedSolution.id ? enhancedSolution : sol
            )
        );
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['solutions', 'stats']
      });
      
      queryClient.invalidateQueries({
        queryKey: ['solutions', 'with-youtube']
      });
      
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

// Delete solution (existing, enhanced)
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
      
      // Invalidate list queries
      queryClient.invalidateQueries({
        queryKey: ['solutions']
      });
      
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