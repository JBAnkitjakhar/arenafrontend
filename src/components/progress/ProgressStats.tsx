// src/components/progress/ProgressStats.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProgressStats } from '@/hooks/useProgress';
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  Circle,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Match the actual API response structure
interface ApiProgressStats {
  totalSolved: number;
  totalQuestions: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentSolved: number;
  streak: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  progress?: number;
}

const StatCard = ({ title, value, description, icon: Icon, color, progress }: StatCardProps) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    orange: 'text-orange-500 bg-orange-50',
    red: 'text-red-500 bg-red-50',
    purple: 'text-purple-500 bg-purple-50',
  };

  const progressColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
          <div className={cn('p-2 rounded-lg mr-3', colorClasses[color])}>
            <Icon className="h-4 w-4" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          {description}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn('h-2 rounded-full transition-all duration-300', progressColors[color])}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface LevelProgressProps {
  level: 'easy' | 'medium' | 'hard';
  solved: number;
  total: number;
  percentage: number;
}

const LevelProgress = ({ level, solved, total, percentage }: LevelProgressProps) => {
  const levelConfig = {
    easy: {
      color: 'text-green-600',
      bg: 'bg-green-500',
      icon: Target,
      label: 'Easy',
    },
    medium: {
      color: 'text-orange-600',
      bg: 'bg-orange-500',
      icon: Circle,
      label: 'Medium',
    },
    hard: {
      color: 'text-red-600',
      bg: 'bg-red-500',
      icon: Trophy,
      label: 'Hard',
    },
  };

  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={cn('h-4 w-4', config.color)} />
          <span className="text-sm font-medium text-gray-700">{config.label}</span>
        </div>
        <span className="text-sm text-gray-600">
          {solved}/{total} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn('h-2 rounded-full transition-all duration-300', config.bg)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

export function ProgressStats() {
  const { data: stats, isLoading, error } = useProgressStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load progress</h3>
          <p className="text-gray-600">Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  // Process the API response to get calculated values
  const apiStats = stats as ApiProgressStats;
  const overallProgress = apiStats.totalQuestions > 0 
    ? Math.round((apiStats.totalSolved / apiStats.totalQuestions) * 100) 
    : 0;

  // Calculate progress percentages for each level
  const easyProgress = apiStats.totalQuestions > 0 
    ? Math.round((apiStats.solvedByLevel.easy / (apiStats.totalQuestions * 0.4)) * 100) // Assume 40% easy
    : 0;
  
  const mediumProgress = apiStats.totalQuestions > 0 
    ? Math.round((apiStats.solvedByLevel.medium / (apiStats.totalQuestions * 0.4)) * 100) // Assume 40% medium
    : 0;
  
  const hardProgress = apiStats.totalQuestions > 0 
    ? Math.round((apiStats.solvedByLevel.hard / (apiStats.totalQuestions * 0.2)) * 100) // Assume 20% hard
    : 0;

  // Estimate totals for each level (you can adjust these ratios based on your actual data)
  const estimatedEasyTotal = Math.ceil(apiStats.totalQuestions * 0.4);
  const estimatedMediumTotal = Math.ceil(apiStats.totalQuestions * 0.4);
  const estimatedHardTotal = Math.ceil(apiStats.totalQuestions * 0.2);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${apiStats.totalSolved}/${apiStats.totalQuestions}`}
          description={`${overallProgress}% completed`}
          icon={TrendingUp}
          color="blue"
          progress={overallProgress}
        />
        
        <StatCard
          title="Easy Problems"
          value={apiStats.solvedByLevel.easy}
          description={`out of ~${estimatedEasyTotal} problems`}
          icon={Target}
          color="green"
          progress={easyProgress}
        />
        
        <StatCard
          title="Medium Problems"
          value={apiStats.solvedByLevel.medium}
          description={`out of ~${estimatedMediumTotal} problems`}
          icon={Circle}
          color="orange"
          progress={mediumProgress}
        />
        
        <StatCard
          title="Hard Problems"
          value={apiStats.solvedByLevel.hard}
          description={`out of ~${estimatedHardTotal} problems`}
          icon={Trophy}
          color="red"
          progress={hardProgress}
        />
      </div>

      {/* Detailed Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Progress by Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LevelProgress
            level="easy"
            solved={apiStats.solvedByLevel.easy}
            total={estimatedEasyTotal}
            percentage={easyProgress}
          />
          <LevelProgress
            level="medium"
            solved={apiStats.solvedByLevel.medium}
            total={estimatedMediumTotal}
            percentage={mediumProgress}
          />
          <LevelProgress
            level="hard"
            solved={apiStats.solvedByLevel.hard}
            total={estimatedHardTotal}
            percentage={hardProgress}
          />
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {overallProgress}%
            </div>
            <div className="text-sm text-gray-600">
              Total Completion
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {apiStats.recentSolved}
            </div>
            <div className="text-sm text-gray-600">
              Recent Solved
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {apiStats.streak}
            </div>
            <div className="text-sm text-gray-600">
              Current Streak
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}