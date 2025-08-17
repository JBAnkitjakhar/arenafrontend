// src/components/dashboard/QuickActions.tsx

'use client';

import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Code, 
  TrendingUp, 
  FolderOpen,
  Settings,
  Users,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCurrentUser } from '@/hooks/useAuth';
import { UserRole } from '@/types';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  roles?: UserRole[];
}

const quickActions: QuickAction[] = [
  {
    title: 'Browse Questions',
    description: 'Explore coding problems by category and difficulty',
    href: '/dsa/questions',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Categories',
    description: 'Navigate problems by topic and data structure',
    href: '/dsa/categories',
    icon: FolderOpen,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: 'Code Compiler',
    description: 'Test and run your code in multiple languages',
    href: '/compiler',
    icon: Code,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: 'View Progress',
    description: 'Track your learning journey and achievements',
    href: '/progress',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  {
    title: 'Admin Panel',
    description: 'Manage questions, users, and system settings',
    href: '/admin',
    icon: Settings,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
  {
    title: 'Manage Users',
    description: 'View and manage user accounts and permissions',
    href: '/admin/users',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    roles: [UserRole.ADMIN, UserRole.SUPERADMIN],
  },
];

export function QuickActions() {
  const { user } = useCurrentUser();

  const hasRole = (roles?: UserRole[]) => {
    if (!roles || !user) return true;
    return roles.includes(user.role);
  };

  const filteredActions = quickActions.filter(action => hasRole(action.roles));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>Jump to the most common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuickActionCard action={action} />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionCard({ action }: { action: QuickAction }) {
  const { title, description, href, icon: Icon, color, bgColor } = action;

  return (
    <Link href={href}>
      <div className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${bgColor}`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${color} ${bgColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </div>
    </Link>
  );
}