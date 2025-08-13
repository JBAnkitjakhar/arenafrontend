// src/app/dsa/categories/layout.tsx

import { RouteGuard } from '@/components/auth/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';

export default function CategoriesLayout({
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