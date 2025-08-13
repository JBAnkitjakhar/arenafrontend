// src/app/admin/page.tsx

'use client';

import { useCurrentUser } from '@/hooks/useAuth';
import { useSolutionStats, useSolutionsWithYouTube } from '@/hooks/useSolutions';
import { useQuestionCounts } from '@/hooks/useQuestions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminRoute } from '@/components/auth/RouteGuard';
import { 
  Users, 
  BookOpen, 
  Video, 
  Code, 
  TrendingUp,
  Plus,
  Crown,
  Settings,
  BarChart3,
  Database,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboardPage() {
  const { user } = useCurrentUser();
  const { data: questionCounts } = useQuestionCounts();
  const { data: solutionStats } = useSolutionStats();
  const { data: youtubeVideos } = useSolutionsWithYouTube();

  // Mock data for now - will be replaced with real API calls
  const adminStats = {
    totalUsers: 156,
    totalQuestions: 89,
    totalSolutions: 124,
    totalApproaches: 340,
    usersByRole: {
      USER: 145,
      ADMIN: 10,
      SUPERADMIN: 1
    },
    recentActivity: [
      { type: 'user_registered', data: { name: 'John Doe' }, timestamp: new Date().toISOString() },
      { type: 'question_added', data: { title: 'Two Sum Problem' }, timestamp: new Date(Date.now() - 3600000).toISOString() },
    ]
  };

  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const quickActions = [
    {
      title: 'Add Question',
      description: 'Create a new coding problem',
      href: '/admin/questions/create',
      icon: Plus,
      color: 'blue',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      icon: Users,
      color: 'green',
    },
    {
      title: 'View Questions',
      description: 'Manage existing questions',
      href: '/admin/questions',
      icon: BookOpen,
      color: 'purple',
    },
    ...(isSuperAdmin ? [{
      title: 'System Settings',
      description: 'Configure system settings',
      href: '/admin/settings',
      icon: Settings,
      color: 'orange',
    }] : []),
  ];

  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}! Manage your DSA platform.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {adminStats.totalUsers}
                  </div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {adminStats.usersByRole.ADMIN + adminStats.usersByRole.SUPERADMIN} admins
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {questionCounts?.total || 0}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {questionCounts?.byLevel.easy || 0} easy, {questionCounts?.byLevel.medium || 0} medium, {questionCounts?.byLevel.hard || 0} hard
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {solutionStats?.totalSolutions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Solutions</div>
                </div>
                <Code className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 text-xs text-gray-500">
                {solutionStats?.solutionsWithYoutubeVideos || 0} with videos
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {adminStats.totalApproaches}
                  </div>
                  <div className="text-sm text-gray-600">User Approaches</div>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Community contributions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                        <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solution Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Content Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {solutionStats && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solutions with Images:</span>
                    <span className="font-medium">{solutionStats.solutionsWithImages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solutions with YouTube Videos:</span>
                    <span className="font-medium">{solutionStats.solutionsWithYoutubeVideos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solutions with Drive Links:</span>
                    <span className="font-medium">{solutionStats.solutionsWithDriveLinks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Solutions with Both Links:</span>
                    <span className="font-medium">{solutionStats.solutionsWithBothLinks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interactive Visualizers:</span>
                    <span className="font-medium">{solutionStats.solutionsWithVisualizers}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminStats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">
                        {activity.type === 'user_registered' && `New user registered: ${activity.data.name}`}
                        {activity.type === 'question_added' && `Question added: ${activity.data.title}`}
                        {activity.type === 'solution_added' && `Solution added for: ${activity.data.title}`}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 border-t">
                  <Link href="/admin/activity">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* YouTube Videos Overview */}
        {youtubeVideos && youtubeVideos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-red-500" />
                  <span>Recent Video Solutions</span>
                </div>
                <Link href="/admin/solutions?filter=youtube">
                  <Button variant="outline" size="sm">
                    View All Videos
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubeVideos.slice(0, 6).map((solution) => (
                  <div key={solution.id} className="border rounded-lg p-4 space-y-2">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {solution.questionTitle}
                    </div>
                    <div className="text-xs text-gray-600">
                      By {solution.createdByName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(solution.createdAt), { addSuffix: true })}
                    </div>
                    {solution.youtubeVideoId && (
                      <img
                        src={`https://img.youtube.com/vi/${solution.youtubeVideoId}/mqdefault.jpg`}
                        alt="Video thumbnail"
                        className="w-full h-20 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminRoute>
  );
}