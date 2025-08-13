// src/hooks/useQuestions.ts  

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@/store';
import { addToast } from '@/store/slices/uiSlice';
import { questionsApi } from '@/lib/api/client';
import { queryKeys } from '@/lib/query-client';
import { Question, QuestionDetail, PaginatedResponse, QuestionFormData } from '@/types';

interface QuestionsParams {
  page?: number;
  size?: number;
  category?: string;
  level?: string;
  search?: string;
}

// Get paginated questions
export function useQuestions(params: QuestionsParams = {}) {
  return useQuery({
    queryKey: queryKeys.questions.list(params),
    queryFn: () => questionsApi.getAll({
      page: params.page || 0,
      size: params.size || 20,
      categoryId: params.category,
      level: params.level,
      search: params.search,
    }),
    staleTime: 1 * 60 * 1000, // 1 minute
    select: (data: any): PaginatedResponse<Question> => {
      // Ensure the data matches our expected type
      return {
        content: data?.content || data?.data?.content || [],
        totalElements: data?.totalElements || data?.data?.totalElements || 0,
        totalPages: data?.totalPages || data?.data?.totalPages || 0,
        number: data?.number || data?.data?.number || 0,
        size: data?.size || data?.data?.size || 20,
        first: data?.first || data?.data?.first || true,
        last: data?.last || data?.data?.last || true,
      };
    },
  });
}

// Get question detail with solutions and user progress
export function useQuestionDetail(questionId: string) {
  return useQuery({
    queryKey: queryKeys.questions.detail(questionId),
    queryFn: () => questionsApi.getById(questionId),
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data: any): QuestionDetail => {
      // Handle both direct response and wrapped response
      const questionData = data?.data || data;
      return questionData;
    },
  });
}

// Get question counts/statistics
export function useQuestionCounts() {
  return useQuery({
    queryKey: queryKeys.questions.counts,
    queryFn: () => questionsApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data: any) => {
      // Ensure the data structure matches what the UI expects
      const counts = data?.data || data;
      return {
        total: counts?.total || 0,
        byLevel: {
          easy: counts?.byLevel?.easy || 0,
          medium: counts?.byLevel?.medium || 0,
          hard: counts?.byLevel?.hard || 0,
        },
        byCategory: counts?.byCategory || {},
        solved: counts?.solved || 0,
        unsolved: counts?.unsolved || 0,
      };
    },
  });
}

// Search questions
export function useSearchQuestions(query: string) {
  return useQuery({
    queryKey: queryKeys.questions.search(query),
    queryFn: () => questionsApi.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
    select: (data: any): Question[] => {
      return data?.data || data || [];
    },
  });
}

// Create question (Admin only)
export function useCreateQuestion() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (data: QuestionFormData) => questionsApi.create(data),
    onSuccess: (newQuestion) => {
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      const questionData = newQuestion?.data || newQuestion;
      dispatch(addToast({
        title: 'Question Created',
        description: `"${questionData.title}" has been created successfully.`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to create question';
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
    mutationFn: ({ questionId, data }: { questionId: string; data: QuestionFormData }) =>
      questionsApi.update(questionId, data),
    onSuccess: (updatedQuestion, { questionId }) => {
      const questionData = updatedQuestion?.data || updatedQuestion;
      
      // Update specific question cache
      queryClient.setQueryData(
        queryKeys.questions.detail(questionId),
        questionData
      );
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      dispatch(addToast({
        title: 'Question Updated',
        description: `"${questionData.title}" has been updated successfully.`,
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to update question';
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
    mutationFn: (questionId: string) => questionsApi.delete(questionId),
    onSuccess: (_, questionId) => {
      // Remove from question detail cache
      queryClient.removeQueries({
        queryKey: queryKeys.questions.detail(questionId)
      });
      
      // Invalidate questions lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.lists()
      });
      
      // Invalidate question counts
      queryClient.invalidateQueries({
        queryKey: queryKeys.questions.counts
      });
      
      // Invalidate progress data (since question is deleted)
      queryClient.invalidateQueries({
        queryKey: ['progress']
      });
      
      dispatch(addToast({
        title: 'Question Deleted',
        description: 'Question has been deleted successfully.',
        type: 'success',
      }));
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete question';
      dispatch(addToast({
        title: 'Error',
        description: message,
        type: 'error',
      }));
    },
  });
}