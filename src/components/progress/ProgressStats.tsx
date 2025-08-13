// src/components/progress/ProgressStats.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Flame,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Zap,
  Star,
  BarChart3
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Link from 'next/link';

interface ProgressStats {
  totalSolved: number;
  solvedByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  totalQuestions: number;
  totalByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
  progressPercentage: number;
  progressByLevel: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface ProgressStatsProps {
  stats: ProgressStats;
  streak?: number;
  rank?: number;
  totalUsers?: number;
}

export function ProgressStats({ stats, streak = 0, rank = 0, totalUsers = 0 }: ProgressStatsProps) {
  
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getProgressLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'Expert', color: 'text-purple-600', icon: Star };
    if (percentage >= 60) return { level: 'Advanced', color: 'text-blue-600', icon: Award };
    if (percentage >= 40) return { level: 'Intermediate', color: 'text-green-600', icon: TrendingUp };
    if (percentage >= 20) return { level: 'Beginner', color: 'text-yellow-600', icon: Target };
    return { level: 'Starter', color: 'text-gray-600', icon: BookOpen };
  };

  const progressLevel = getProgressLevel(stats.progressPercentage);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      {/* Overall Progress Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16">
              <CircularProgressbar
                value={stats.progressPercentage}
                text={`${Math.round(stats.progressPercentage)}%`}
                styles={buildStyles({
                  textSize: '24px',
                  pathColor: '#3b82f6',
                  textColor: '#1f2937',
                  trailColor: '#e5e7eb',
                  pathTransitionDuration: 1.5,
                })}
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalSolved}
              </div>
              <div className="text-sm text-gray-600">
                of {stats.totalQuestions} solved
              </div>
              <div className={`text-xs font-medium ${progressLevel.color} flex items-center space-x-1 mt-1`}>
                <progressLevel.icon className="h-3 w-3" />
                <span>{progressLevel.level}</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
      </Card>

      {/* Streak Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Flame className="h-4 w-4" />
            <span>Current Streak</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {streak}
              </div>
              <div className="text-sm text-gray-600">
                {streak === 1 ? 'day' : 'days'} in a row
              </div>
              <div className="text-xs text-orange-600 font-medium mt-1">
                {streak >= 7 ? '🔥 On fire!' : streak >= 3 ? '💪 Great job!' : '🚀 Keep going!'}
              </div>
            </div>
          </div>
        </CardContent>
        
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-orange-100 rounded-full opacity-20"></div>
      </Card>

      {/* Difficulty Breakdown */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>By Difficulty</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.solvedByLevel).map(([level, solved]) => {
              const total = stats.totalByLevel[level as keyof typeof stats.totalByLevel];
              const percentage = total > 0 ? (solved / total) * 100 : 0;
              
              return (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getDifficultyColor(level) }}
                    />
                    <span className="text-sm capitalize text-gray-700">{level}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {solved}/{total}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round(percentage)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-100 rounded-full opacity-20"></div>
      </Card>

      {/* Rank & Achievement */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Rank & Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Rank */}
            {rank > 0 && totalUsers > 0 && (