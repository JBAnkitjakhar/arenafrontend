
// src/app/dashboard/layout.tsx

import { RouteGuard } from '@/components/auth/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard requireAuth={true}>
      <MainLayout>
        {children}
      </MainLayout>
    </RouteGuard>
  );
}