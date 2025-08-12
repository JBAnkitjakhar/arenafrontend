// src/hooks/useCategories.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Category } from '@/types';

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => api.get<Category[]>('/dsa/categories'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get category by ID
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => api.get<Category>(`/dsa/categories/${id}`),
    enabled: !!id,
  });
}

// Get category statistics
export function useCategoryStats(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.stats(id),
    queryFn: () => api.get<{
      totalQuestions: number;
      questionsByLevel: {
        easy: number;
        medium: number;
        hard: number;
      };
      totalSolutions: number;
    }>(`/dsa/categories/${id}/stats`),
    enabled: !!id,
  });
}

// Create category mutation (Admin only)
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: { name: string }) => 
      api.post<Category>('/dsa/categories', data),
    onSuccess: (newCategory) => {
      // Update categories cache
      queryClient.setQueryData<Category[]>(
        queryKeys.categories.all,
        (old) => old ? [newCategory, ...old] : [newCategory]
      );
      
      dispatch(addToast({
        title: 'Success',
        description: `Category "${newCategory.name}" created successfully`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to create category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update category mutation (Admin only)
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string } }) =>
      api.put<Category>(`/dsa/categories/${id}`, data),
    onSuccess: (updatedCategory) => {
      // Update categories cache
      queryClient.setQueryData<Category[]>(
        queryKeys.categories.all,
        (old) => 
          old?.map(cat => 
            cat.id === updatedCategory.id ? updatedCategory : cat
          ) || []
      );
      
      // Update individual category cache
      queryClient.setQueryData(
        queryKeys.categories.detail(updatedCategory.id),
        updatedCategory
      );
      
      dispatch(addToast({
        title: 'Success',
        description: 'Category updated successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to update category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete category mutation (Admin only)
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/categories/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from categories cache
      queryClient.setQueryData<Category[]>(
        queryKeys.categories.all,
        (old) => old?.filter(cat => cat.id !== deletedId) || []
      );
      
      // Remove individual category cache
      queryClient.removeQueries({
        queryKey: queryKeys.categories.detail(deletedId)
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.all
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Category and all related questions deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to delete category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}