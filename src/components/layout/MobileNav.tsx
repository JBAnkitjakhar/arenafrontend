// src/components/layout/MobileNav.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch } from '@/store';
import { setMobileMenuOpen } from '@/store/slices/uiSlice';
import { useCurrentUser } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BookOpen, 
  Code, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Crown,
  FolderOpen,
  X
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    label: 'Questions',
    href: '/dsa/questions',
    icon: BookOpen,
  },
  {
    label: 'Categories',
    href: '/dsa/categories',
    icon: FolderOpen,
  },
  {
    label: 'Compiler',
    href: '/compiler',
    icon: Code,
  },
  {
    label: 'Progress',
    href: '/progress',
    icon: BarChart3,
  },
];

const adminNavItems: NavItem[] = [
  {
    label: 'Admin Panel',
    href: '/admin',
    icon: Crown,
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    label: 'Manage Users',
    href: '/admin/users',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    label: 'Manage Questions',
    href: '/admin/questions',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    roles: [UserRole.SUPERADMIN],
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useCurrentUser();

  const hasRole = (roles?: UserRole[]) => {
    if (!roles || !user) return true;
    return roles.includes(user.role);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    dispatch(setMobileMenuOpen(false));
  };

  const renderNavItem = ({ label, href, icon: Icon, roles }: NavItem) => {
    if (!hasRole(roles)) return null;

    const active = isActive(href);

    return (
      <Link
        key={href}
        href={href}
        onClick={handleLinkClick}
        className={cn(
          'flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-lg transition-colors',
          active
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        <Icon className={cn('h-6 w-6', active && 'text-blue-700')} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => dispatch(setMobileMenuOpen(false))}
      />

      {/* Mobile Menu */}
      <div className="fixed left-0 top-0 h-full w-80 max-w-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AA</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">AlgoArena</h2>
          </div>
          <button
            onClick={() => dispatch(setMobileMenuOpen(false))}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            {navItems.map(renderNavItem)}
          </div>

          {/* Admin Navigation */}
          {user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && (
            <div className="space-y-1 pt-4 border-t border-gray-200">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Administration
              </h3>
              {adminNavItems.map(renderNavItem)}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            AlgoArena v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
}