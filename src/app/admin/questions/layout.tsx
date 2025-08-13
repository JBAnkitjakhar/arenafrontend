// src/app/admin/questions/layout.tsx

import { RouteGuard } from '@/components/auth/RouteGuard';
import AdminLayout from '../layout';

export default function AdminQuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth={true} requiredRoles={['ADMIN', 'SUPERADMIN']}>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Question Management</h1>
              <p className="text-gray-600">Create, edit, and manage DSA questions</p>
            </div>
          </div>
          {children}
        </div>
      </AdminLayout>
    </RouteGuard>
  );
}