// src/components/dashboard/LeaderboardWidget.tsx

'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';

interface LeaderboardUser {
  id: string;
  name: string;
  image?: string;
  solvedCount: number;
  rank: number;
  streak: number;
}

interface LeaderboardWidgetProps {
  data: LeaderboardUser[];
  currentUserId?: string;
}

export function LeaderboardWidget({ data, currentUserId }: LeaderboardWidgetProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top performers this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-600" />
          Leaderboard
        </CardTitle>
        <CardDescription>Top performers this week</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.slice(0, 5).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <LeaderboardItem 
              user={user} 
              index={index} 
              isCurrentUser={user.id === currentUserId}
            />
          </motion.div>
        ))}
        
        <div className="pt-2">
          <Link href="/leaderboard">
            <Button variant="outline" className="w-full text-sm">
              View Full Leaderboard
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardItem({ 
  user, 
  index, 
  isCurrentUser 
}: { 
  user: LeaderboardUser; 
  index: number; 
  isCurrentUser: boolean;
}) {
  const getRankIcon = () => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankColor = () => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800';
      case 1:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-gray-200 dark:border-gray-800';
      case 2:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800';
      default:
        return isCurrentUser 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-900/20';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${getRankColor()}`}>
      <div className="flex-shrink-0">
        {getRankIcon()}
      </div>
      
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} alt={user.name} />
        <AvatarFallback className="text-xs">
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium truncate ${
            isCurrentUser ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
          }`}>
            {user.name}
            {isCurrentUser && (
              <Badge variant="outline" className="ml-2 text-xs">You</Badge>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {user.solvedCount} solved
          </span>
          {user.streak > 0 && (
            <Badge variant="secondary" className="text-xs">
              {user.streak}d streak
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}