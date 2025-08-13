// src/components/progress/RecentActivity.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  Calendar,
  ExternalLink,
  Trophy,
  Target,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface RecentActivity {
  id: string;
  questionId: string;
  questionTitle: string;
  level: string;
  solvedAt: string;
}

interface RecentActivityProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

const getDifficultyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'easy':
      return 'text-green-600 bg-green-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'hard':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getDifficultyIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case 'easy':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'hard':
      return '🔴';
    default:
      return '⚪';
  }
};

export function RecentActivity({ activities, isLoading = false }: RecentActivityProps) {
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600 mb-4">
              Start solving questions to see your progress here!
            </p>
            <Link href="/dsa/questions">
              <Button>
                <Trophy className="h-4 w-4 mr-2" />
                Browse Questions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <div className="text-sm text-gray-500">
            Last {activities.length} solved
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group"
            >
              {/* Achievement Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              
              {/* Question Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {activity.questionTitle}
                  </h4>
                  <span className="text-lg">{getDifficultyIcon(activity.level)}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(new Date(activity.solvedAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.level)}`}>
                    {activity.level}
                  </span>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0">
                <Link href={`/dsa/questions/${activity.questionId}`}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Link */}
        {activities.length >= 10 && (
          <div className="mt-6 text-center">
            <Link href="/progress/activity">
              <Button variant="outline" className="w-full">
                View All Activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for dashboard
export function RecentActivityCompact({ activities, isLoading = false }: RecentActivityProps) {
  
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-6">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity) => (
        <div key={activity.id} className="flex items-center space-x-3 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 truncate">{activity.questionTitle}</div>
            <div className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(activity.solvedAt), { addSuffix: true })}
            </div>
          </div>
          <span className="text-xs">{getDifficultyIcon(activity.level)}</span>
        </div>
      ))}
      
      {activities.length > 5 && (
        <div className="text-center pt-2">
          <Link href="/progress">
            <Button variant="ghost" size="sm" className="text-xs">
              View all ({activities.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}