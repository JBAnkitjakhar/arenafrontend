// src/hooks/useCategories.ts  

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Category } from '@/types';

interface ApiError {
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
  };
  message?: string;
}

interface CategoryStats {
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

interface DeleteCategoryResponse {
  deletedQuestions: number;
}

// Get all categories
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get<Category[]>('/dsa/categories');
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get category by ID
export function useCategory(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(categoryId),
    queryFn: async (): Promise<Category> => {
      const response = await api.get<Category>(`/dsa/categories/${categoryId}`);
      return response;
    },
    enabled: !!categoryId,
  });
}

// Get category statistics
export function useCategoryStats(categoryId: string) {
  return useQuery({
    queryKey: queryKeys.categories.stats(categoryId),
    queryFn: async (): Promise<CategoryStats> => {
      const response = await api.get<CategoryStats>(`/dsa/categories/${categoryId}/stats`);
      return response;
    },
    enabled: !!categoryId,
    select: (data: CategoryStats): CategoryStats => {
      return {
        totalQuestions: data?.totalQuestions || 0,
        questionsByLevel: {
          easy: data?.questionsByLevel?.easy || 0,
          medium: data?.questionsByLevel?.medium || 0,
          hard: data?.questionsByLevel?.hard || 0,
        },
        totalSolved: data?.totalSolved || 0,
        solvedByLevel: {
          easy: data?.solvedByLevel?.easy || 0,
          medium: data?.solvedByLevel?.medium || 0,
          hard: data?.solvedByLevel?.hard || 0,
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
    mutationFn: async (data: { name: string }): Promise<Category> => {
      const response = await api.post<Category>('/dsa/categories', data);
      return response;
    },
    onSuccess: (newCategory: Category) => {
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
    onError: (error: ApiError) => {
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
    mutationFn: async ({ categoryId, data }: { 
      categoryId: string; 
      data: { name: string }
    }): Promise<Category> => {
      const response = await api.put<Category>(`/dsa/categories/${categoryId}`, data);
      return response;
    },
    onSuccess: (updatedCategory: Category) => {
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
    onError: (error: ApiError) => {
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
    mutationFn: async (categoryId: string): Promise<DeleteCategoryResponse> => {
      const response = await api.delete<DeleteCategoryResponse>(`/dsa/categories/${categoryId}`);
      return response;
    },
    onSuccess: (result: DeleteCategoryResponse, categoryId) => {
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
        queryKey: ['questions']
      });
      
      dispatch(addToast({
        title: 'Category Deleted',
        description: `Category and ${result?.deletedQuestions || 0} questions have been deleted.`,
        type: 'success',
      }));
    },
    onError: (error: ApiError) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete category';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}