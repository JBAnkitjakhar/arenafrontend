// src/app/dashboard/page.tsx

'use client';

import { useCurrentUser } from '@/hooks/useAuth';
import { useRealtime } from '@/components/providers/RealtimeProvider';
import { useDashboardStats } from '@/hooks/useDashboard';
import { motion } from 'framer-motion';
import { 
  Target,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import { StreakCounter } from '@/components/dashboard/StreakCounter';
import { LeaderboardWidget } from '@/components/dashboard/LeaderboardWidget';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const { isConnected, connectionStatus } = useRealtime();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError error={error} />;
  }

  const {
    totalQuestions = 0,
    solvedQuestions = 0,
    easyCompleted = 0,
    mediumCompleted = 0,
    hardCompleted = 0,
    streakDays = 0,
    totalUsers = 0,
    weeklyProgress = [],
    recentActivity = [],
    leaderboard = []
  } = stats || {};

  const progressPercentage = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header Section */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Ready to continue your coding journey?
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectionStatus isConnected={isConnected} status={connectionStatus} />
          <StreakCounter days={streakDays} />
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Questions Solved"
          value={solvedQuestions}
          total={totalQuestions}
          icon={CheckCircle}
          color="emerald"
          progress={progressPercentage}
        />
        <StatsCard
          title="Easy Problems"
          value={easyCompleted}
          icon={Target}
          color="green"
          trend="+2 this week"
        />
        <StatsCard
          title="Medium Problems"
          value={mediumCompleted}
          icon={AlertCircle}
          color="yellow"
          trend="+1 this week"
        />
        <StatsCard
          title="Hard Problems"
          value={hardCompleted}
          icon={XCircle}
          color="red"
          trend="Keep going!"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Chart */}
          <motion.div variants={item}>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>Your coding activity over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart data={weeklyProgress} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <QuickActions />
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest coding sessions and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={recentActivity} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="space-y-6">
          {/* Overall Progress */}
          <motion.div variants={item}>
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{progressPercentage}%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
                </div>
                <Progress value={progressPercentage} className="h-3" />
                <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {solvedQuestions} of {totalQuestions} problems solved
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div variants={item}>
            <LeaderboardWidget data={leaderboard} currentUserId={user?.id} />
          </motion.div>

          {/* Community Stats */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                  <Badge variant="secondary">{totalUsers}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Questions Added</span>
                  <Badge variant="secondary">{totalQuestions}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Solves</span>
                  <Badge variant="secondary">{solvedQuestions * 10}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Start */}
          <motion.div variants={item}>
            <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto" />
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">Ready to code?</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Start with a question that matches your skill level
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/dsa/questions">
                      Start Coding
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: number;
  total?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'green' | 'yellow' | 'red' | 'blue' | 'purple';
  progress?: number;
  trend?: string;
}

function StatsCard({ title, value, total, icon: Icon, color, progress, trend }: StatsCardProps) {
  const colorClasses = {
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {total && (
                <p className="text-sm text-gray-500 dark:text-gray-400">/ {total}</p>
              )}
            </div>
            {trend && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error State
function DashboardError({ error }: { error: any }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <XCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Failed to load dashboard</h2>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
        {error?.message || 'Something went wrong while loading your dashboard. Please try again.'}
      </p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}