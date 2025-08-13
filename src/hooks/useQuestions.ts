// src/hooks/useQuestions.ts - Additional missing hooks

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Question, QuestionFormData } from '@/types';

// Create question (Admin only)
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: QuestionFormData) =>
      api.post<Question>('/dsa/questions', data),
    onSuccess: (newQuestion) => {
      // Invalidate questions list to refresh
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      // Invalidate category stats if needed
      if (newQuestion.categoryId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.categories.stats(newQuestion.categoryId)
        });
      }
      
      dispatch(addToast({
        title: 'Success',
        description: 'Question created successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to create question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Update question (Admin only)
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionFormData }) =>
      api.put<Question>(`/dsa/questions/${id}`, data),
    onSuccess: (updatedQuestion) => {
      // Update question detail cache
      queryClient.setQueryData(
        queryKeys.questions.detail(updatedQuestion.id),
        { question: updatedQuestion }
      );
      
      // Invalidate questions list to refresh
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Question updated successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to update question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}

// Delete question (Admin only)
export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/dsa/questions/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.questions.detail(deletedId)
      });
      
      // Invalidate all questions queries to refresh lists
      queryClient.invalidateQueries({
        queryKey: ['questions']
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      // Invalidate solutions and approaches for this question
      queryClient.invalidateQueries({
        queryKey: queryKeys.solutions.byQuestion(deletedId)
      });
      
      queryClient.invalidateQueries({
        queryKey: ['approaches', 'question', deletedId]
      });
      
      dispatch(addToast({
        title: 'Success',
        description: 'Question deleted successfully',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || 'Failed to delete question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}