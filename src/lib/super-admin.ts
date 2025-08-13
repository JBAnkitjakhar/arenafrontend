// src/lib/super-admin.ts

import { UserRole } from '@/types';

/**
 * Configuration for super admin setup
 */
export const SUPER_ADMIN_CONFIG = {
  email: 'ankitjakharabc@gmail.com',
  role: UserRole.SUPERADMIN,
  isProtected: true, // Cannot be changed by anyone
} as const;

/**
 * Check if an email should be automatically assigned super admin role
 */
export function shouldBeSuperAdmin(email: string): boolean {
  return email.toLowerCase() === SUPER_ADMIN_CONFIG.email.toLowerCase();
}

/**
 * Check if a user is the protected super admin
 */
export function isProtectedSuperAdmin(email: string): boolean {
  return shouldBeSuperAdmin(email);
}

/**
 * Validate if a role change is allowed
 */
export function canChangeUserRole(targetUserEmail: string, currentUserRole: UserRole): boolean {
  // Protected super admin cannot have their role changed
  if (isProtectedSuperAdmin(targetUserEmail)) {
    return false;
  }
  
  // Only super admin can change roles
  if (currentUserRole !== UserRole.SUPERADMIN) {
    return false;
  }
  
  return true;
}

/**
 * Get the appropriate role for a new user based on their email
 */
export function getInitialUserRole(email: string): UserRole {
  if (shouldBeSuperAdmin(email)) {
    return UserRole.SUPERADMIN;
  }
  
  return UserRole.USER; // Default role for all other users
}

// Hook for admin panel to check permissions
export function useRoleManagement() {
  const checkCanModifyUser = (targetUserEmail: string, currentUserRole: UserRole) => {
    return {
      canChangeRole: canChangeUserRole(targetUserEmail, currentUserRole),
      isProtected: isProtectedSuperAdmin(targetUserEmail),
      reason: isProtectedSuperAdmin(targetUserEmail) 
        ? 'This is the protected super admin account'
        : currentUserRole !== UserRole.SUPERADMIN 
        ? 'Only super admins can change user roles'
        : null
    };
  };
  
  return {
    checkCanModifyUser,
    isProtectedSuperAdmin,
    shouldBeSuperAdmin,
    SUPER_ADMIN_EMAIL: SUPER_ADMIN_CONFIG.email,
  };
}