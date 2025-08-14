// src/app/dashboard/page.tsx

'use client';

import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Clock,
  Target,
  TrendingUp 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useCurrentUser();

  // Placeholder data - will be replaced with real data later
  const stats = {
    totalQuestions: 156,
    solvedQuestions: 23,
    easyCompleted: 12,
    mediumCompleted: 8,
    hardCompleted: 3,
    streakDays: 5,
  };

  const progressPercentage = Math.round((stats.solvedQuestions / stats.totalQuestions) * 100);

  const quickActions = [
    {
      title: 'Browse Questions',
      description: 'Explore coding problems by category and difficulty',
      href: '/dsa/questions',
      icon: BookOpen,
      color: 'blue',
    },
    {
      title: 'Code Compiler',
      description: 'Test and run your code in multiple languages',
      href: '/compiler',
      icon: Code,
      color: 'green',
    },
    {
      title: 'View Progress',
      description: 'Track your learning journey and achievements',
      href: '/progress',
      icon: TrendingUp,
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Ready to continue your coding journey?
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.solvedQuestions}/{stats.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">
              {progressPercentage}% completed
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.streakDays}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              days in a row
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Easy Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-500" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.easyCompleted}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Hard Problems
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-red-500" />
              <div className="text-2xl font-bold text-gray-900">
                {stats.hardCompleted}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card key={action.href} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-${action.color}-100`}>
                      <Icon className={`h-5 w-5 text-${action.color}-600`} />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {action.description}
                  </CardDescription>
                  <Link href={action.href}>
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest problem-solving sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="h-8 w-8 mx-auto mb-2" />
            <p>No recent activity yet</p>
            <p className="text-sm">Start solving problems to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}