// src/app/admin/settings/layout.tsx

import { RouteGuard } from '@/components/auth/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';
import { UserRole } from '@/types';

export default function AdminSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard 
      requireAuth={true} 
      requiredRoles={[UserRole.SUPERADMIN]}
    >
      <MainLayout>
        {children}
      </MainLayout>
    </RouteGuard>
  );
}