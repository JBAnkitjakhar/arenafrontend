// src/app/progress/page.tsx

'use client';

import { useState } from 'react';
import { useProgressStats, useRecentProgress } from '@/hooks/useProgress';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressStats } from '@/components/progress/ProgressStats';
import { 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import Link from 'next/link';

interface RecentActivityProps {
  activity: Array<{
    id: string;
    questionId: string;
    questionTitle: string;
    level: string;
    solvedAt: string;
  }>;
}

const RecentActivity = ({ activity }: RecentActivityProps) => {
  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
          <p className="text-gray-600 mb-4">Start solving problems to see your progress here!</p>
          <Link href="/dsa/questions">
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Browse Questions
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <Link 
                    href={`/dsa/questions/${item.questionId}`}
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.questionTitle}
                  </Link>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(item.level)}`}>
                      {item.level}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.solvedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
        
        {activity.length >= 10 && (
          <div className="mt-4 text-center">
            <Link href="/dsa/questions?solved=true">
              <Button variant="outline" size="sm">
                View All Solved Problems
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AchievementCard = ({ icon: Icon, title, description, progress, total, color = 'blue' }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  progress: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
  };

  const progressColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const percentage = total > 0 ? (progress / total) * 100 : 0;
  const isCompleted = progress >= total;

  return (
    <Card className={isCompleted ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600 mb-3">{description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {progress}/{total} {isCompleted && '🏆'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${progressColorClasses[color]}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ProgressPage() {
  const { user } = useCurrentUser();
  const { data: stats } = useProgressStats();
  const { data: recentActivity } = useRecentProgress();
  const [activeTab, setActiveTab] = useState('overview');

  const achievements = stats ? [
    {
      icon: Target,
      title: 'Getting Started',
      description: 'Solve your first problem',
      progress: Math.min(stats.totalSolved, 1),
      total: 1,
      color: 'green' as const,
    },
    {
      icon: TrendingUp,
      title: 'Problem Solver',
      description: 'Solve 10 problems',
      progress: Math.min(stats.totalSolved, 10),
      total: 10,
      color: 'blue' as const,
    },
    {
      icon: Award,
      title: 'Dedicated Learner',
      description: 'Solve 50 problems',
      progress: Math.min(stats.totalSolved, 50),
      total: 50,
      color: 'purple' as const,
    },
    {
      icon: CheckCircle,
      title: 'Easy Master',
      description: 'Solve all easy problems',
      progress: stats.solvedByLevel.easy,
      total: stats.totalByLevel.easy,
      color: 'green' as const,
    },
    {
      icon: Target,
      title: 'Medium Conqueror',
      description: 'Solve all medium problems',
      progress: stats.solvedByLevel.medium,
      total: stats.totalByLevel.medium,
      color: 'orange' as const,
    },
    {
      icon: Award,
      title: 'Hard Champion',
      description: 'Solve all hard problems',
      progress: stats.solvedByLevel.hard,
      total: stats.totalByLevel.hard,
      color: 'purple' as const,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Your Progress
        </h1>
        <p className="text-gray-600 mt-1">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Progress Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Award className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <ProgressStats />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <AchievementCard
                      key={index}
                      icon={achievement.icon}
                      title={achievement.title}
                      description={achievement.description}
                      progress={achievement.progress}
                      total={achievement.total}
                      color={achievement.color}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-6">
          <RecentActivity activity={recentActivity || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}