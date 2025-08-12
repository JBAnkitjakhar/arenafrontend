// src/components/layout/Sidebar.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/store';
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
  FolderOpen
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
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

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useAppSelector(state => state.ui);
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

  const renderNavItem = ({ label, href, icon: Icon, badge, roles }: NavItem) => {
    if (!hasRole(roles)) return null;

    const active = isActive(href);

    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
          !sidebarOpen && 'lg:justify-center lg:px-2'
        )}
      >
        <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-blue-700')} />
        {sidebarOpen && (
          <>
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                {badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={cn('h-full flex flex-col', !sidebarOpen && 'lg:items-center')}>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {sidebarOpen && (
            <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Navigation
            </h2>
          )}
          {navItems.map(renderNavItem)}
        </div>

        {/* Admin Navigation */}
        {user && (user.role === UserRole.ADMIN || user.role === UserRole.SUPERADMIN) && (
          <div className="space-y-1 pt-4 border-t border-gray-200">
            {sidebarOpen && (
              <h2 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Administration
              </h2>
            )}
            {adminNavItems.map(renderNavItem)}
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            AlgoArena v1.0.0
          </div>
        </div>
      )}
    </div>
  );
}