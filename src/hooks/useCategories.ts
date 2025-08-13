// src/hooks/useCategories.ts - Updated to match backend endpoints

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { categoriesApi } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';

export interface Category {
  id: string;
  name: string;
  description?: string;
  questionsCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  color?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface CategoryStats {
  totalQuestions: number;
  questionsByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalSolved: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get category by ID
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: () => categoriesApi.getById(categoryId),
    enabled: !!categoryId,
  });
}

// Get category statistics
export function useCategoryStats(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.stats(categoryId),
    queryFn: () => categoriesApi.getStats(categoryId),
    enabled: !!categoryId,
  });
}

// Create category
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) =>
      categoriesApi.create(data),
    onSuccess: (newCategory) => {
      // Invalidate categories list
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all
      });
      
      dispatch(addToast({
        title: 'Category Created',
        description: `"${newCategory.name}" has been created successfully.`,
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

// Update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ categoryId, data }: { 
      categoryId: string; 
      data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>
    }) =>
      categoriesApi.update(categoryId, data),
    onSuccess: (updatedCategory) => {
      // Update categories list
      queryClient.setQueryData(queryKeys.categories.all, (oldData: Category[] | undefined) => {
        if (!oldData) return [updatedCategory];
        return oldData.map(cat => 
          cat.id === updatedCategory.id ? updatedCategory : cat
        );
      });
      
      // Update individual category cache
      queryClient.setQueryData(
        queryKeys.categories.detail(updatedCategory.id),
        updatedCategory
      );
      
      dispatch(addToast({
        title: 'Category Updated',
        description: `"${updatedCategory.name}" has been updated successfully.`,
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
      
      dispatch(addToast({
        title: 'Category Deleted',
        description: `Category and ${result.deletedQuestions} questions have been deleted.`,
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