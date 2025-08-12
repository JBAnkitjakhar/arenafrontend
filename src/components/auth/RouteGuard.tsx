// src/components/auth/RouteGuard.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/auth/login',
}: RouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Wait for auth state to be determined
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requiredRole && user && user.role !== requiredRole) {
      // Check if user has sufficient privileges
      const roleHierarchy = {
        [UserRole.USER]: 0,
        [UserRole.ADMIN]: 1,
        [UserRole.SUPERADMIN]: 2,
      };

      const userLevel = roleHierarchy[user.role];
      const requiredLevel = roleHierarchy[requiredRole];

      if (userLevel < requiredLevel) {
        // Redirect to appropriate page based on user role
        if (user.role === UserRole.USER) {
          router.push('/dashboard');
        } else {
          router.push('/admin'); // Admin trying to access superadmin area
        }
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requiredRole, router, redirectTo]);

  // Show loading while determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if auth check failed
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role check failed
  if (requiredRole && user) {
    const roleHierarchy = {
      [UserRole.USER]: 0,
      [UserRole.ADMIN]: 1,
      [UserRole.SUPERADMIN]: 2,
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[requiredRole];

    if (userLevel < requiredLevel) {
      return null;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole={UserRole.ADMIN}>
      {children}
    </RouteGuard>
  );
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requiredRole={UserRole.SUPERADMIN}>
      {children}
    </RouteGuard>
  );
}

export function PublicRoute({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard requireAuth={false}>
      {children}
    </RouteGuard>
  );
}