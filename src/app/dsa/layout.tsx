// src/app/dsa/layout.tsx

import { RouteGuard } from '@/components/auth/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DSALayout({
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