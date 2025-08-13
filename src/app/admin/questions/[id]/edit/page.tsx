// src/app/admin/questions/[id]/edit/page.tsx  

'use client';

import { useParams } from 'next/navigation';
import { useQuestionDetail } from '@/hooks/useQuestions';
import { AdminRoute } from '@/components/auth/RouteGuard';
import { QuestionForm } from '@/components/admin/QuestionForm';
import { BookOpen } from 'lucide-react';
import { Question } from '@/types';

export default function EditQuestionPage() {
  const params = useParams();
  const questionId = params.id as string;
  const { data: questionDetail, isLoading, error } = useQuestionDetail(questionId);

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  // Handle both direct question data and nested question data
  // Since questionDetail can be undefined, Question, or QuestionDetail, we need proper type checking
  const question = questionDetail 
    ? ('solutions' in questionDetail 
        ? questionDetail as Question  // It's a QuestionDetail, but we cast to Question for now
        : questionDetail as Question) // It's already a Question
    : null;

  if (error || !question) {
    return (
      <AdminRoute>
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Question not found</h2>
          <p className="text-gray-600 mb-4">
            The question youre trying to edit doesnt exist or you dont have permission to edit it.
          </p>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <QuestionForm 
        mode="edit" 
        question={question} 
      />
    </AdminRoute>
  );
}