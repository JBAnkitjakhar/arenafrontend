// src/components/dashboard/RecentActivity.tsx

'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Eye, 
  PlusCircle,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'solved' | 'attempted' | 'approach_added' | 'solution_viewed';
  questionTitle: string;
  questionId: string;
  timestamp: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No recent activity</p>
        <p className="text-sm">Start solving problems to see your activity here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ActivityItem activity={activity} />
        </motion.div>
      ))}
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityConfig = () => {
    switch (activity.type) {
      case 'solved':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-500',
          action: 'solved',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
        };
      case 'attempted':
        return {
          icon: AlertCircle,
          iconColor: 'text-yellow-500',
          action: 'attempted',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        };
      case 'approach_added':
        return {
          icon: PlusCircle,
          iconColor: 'text-blue-500',
          action: 'added approach to',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        };
      case 'solution_viewed':
        return {
          icon: Eye,
          iconColor: 'text-purple-500',
          action: 'viewed solution for',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        };
      default:
        return {
          icon: XCircle,
          iconColor: 'text-gray-500',
          action: 'interacted with',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        };
    }
  };

  const getDifficultyColor = () => {
    switch (activity.difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'HARD':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const { icon: Icon, iconColor, action, bgColor } = getActivityConfig();
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  return (
    <Link href={`/dsa/questions/${activity.questionId}`}>
      <div className={`p-4 rounded-lg border hover:shadow-md transition-all duration-200 ${bgColor} hover:scale-[1.02]`}>
        <div className="flex items-start gap-3">
          <div className={`p-1 rounded-full ${iconColor}`}>
            <Icon className="h-4 w-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-900 dark:text-white">
                You {action} <span className="font-medium">{activity.questionTitle}</span>
              </p>
              <Badge className={`text-xs ${getDifficultyColor()}`}>
                {activity.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{timeAgo}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}