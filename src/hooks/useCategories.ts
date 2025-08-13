// src/hooks/useCategories.ts  

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { categoriesApi } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Category } from '@/types';

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: any): Category[] => {
      // Handle both direct response and wrapped response
      return data?.data || data || [];
    },
  });
}

// Get category by ID
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => categoriesApi.getById(categoryId),
    enabled: !!categoryId,
    select: (data: any): Category => {
      return data?.data || data;
    },
  });
}

// Get category statistics
export function useCategoryStats(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.stats(categoryId),
    queryFn: () => categoriesApi.getStats(categoryId),
    enabled: !!categoryId,
    select: (data: any) => {
      const stats = data?.data || data;
      return {
        totalQuestions: stats?.totalQuestions || 0,
        questionsByLevel: {
          easy: stats?.questionsByLevel?.easy || 0,
          medium: stats?.questionsByLevel?.medium || 0,
          hard: stats?.questionsByLevel?.hard || 0,
        },
        totalSolved: stats?.totalSolved || 0,
        solvedByLevel: {
          easy: stats?.solvedByLevel?.easy || 0,
          medium: stats?.solvedByLevel?.medium || 0,
          hard: stats?.solvedByLevel?.hard || 0,
        },
      };
    },
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: { name: string }) => categoriesApi.create(data),
    onSuccess: (newCategory) => {
      // Invalidate categories list
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all
      });
      
      const categoryData = newCategory?.data || newCategory;
      dispatch(addToast({
        title: 'Category Created',
        description: `"${categoryData.name}" has been created successfully.`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ categoryId, data }: { 
      categoryId: string; 
      data: { name: string }
    }) => categoriesApi.update(categoryId, data),
    onSuccess: (updatedCategory) => {
      const categoryData = updatedCategory?.data || updatedCategory;
      
      // Update categories list
      queryClient.setQueryData(queryKeys.categories.all, (oldData: Category[] | undefined) => {
        if (!oldData) return [categoryData];
        return oldData.map(cat => 
          cat.id === categoryData.id ? categoryData : cat
        );
      });
      
      // Update individual category cache
      queryClient.setQueryData(
        queryKeys.categories.detail(categoryData.id),
        categoryData
      );
      
      dispatch(addToast({
        title: 'Category Updated',
        description: `"${categoryData.name}" has been updated successfully.`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (categoryId: string) => categoriesApi.delete(categoryId),
    onSuccess: (result, categoryId) => {
      // Remove from categories list
      queryClient.setQueryData(queryKeys.categories.all, (oldData: Category[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(cat => cat.id !== categoryId);
      });
      
      // Remove individual category cache
      queryClient.removeQueries({
        queryKey: queryKeys.categories.detail(categoryId)
      });
      
      // Invalidate questions list (since questions in this category are affected)
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      const resultData = result?.data || result;
      dispatch(addToast({
        title: 'Category Deleted',
        description: `Category and ${resultData?.deletedQuestions || 0} questions have been deleted.`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}