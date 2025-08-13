// src/app/admin/layout.tsx
import { RouteGuard } from '@/components/auth/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';
import { UserRole } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard 
      requireAuth={true} 
      requiredRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}
    >
      <MainLayout>
        {children}
      </MainLayout>
    </RouteGuard>
  );
}