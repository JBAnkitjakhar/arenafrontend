// src/app/admin/questions/create/page.tsx

'use client';

import { AdminRoute } from '@/components/auth/RouteGuard';
import { QuestionForm } from '@/components/admin/QuestionForm';

export default function CreateQuestionPage() {
  return (
    <AdminRoute>
      <QuestionForm mode="create" />
    </AdminRoute>
  );
}