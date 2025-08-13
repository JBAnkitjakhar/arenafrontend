// src/components/progress/ProgressChart.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  TrendingUp, 
  Target,
  Trophy
} from 'lucide-react';

interface ProgressData {
  easy: { solved: number; total: number };
  medium: { solved: number; total: number };
  hard: { solved: number; total: number };
}

interface ProgressChartProps {
  data: ProgressData;
  title?: string;
  showPercentages?: boolean;
}

export function ProgressChart({ data, title = "Progress Overview", showPercentages = true }: ProgressChartProps) {
  const levels = [
    {
      name: 'Easy',
      data: data.easy,
      color: '#10B981', // green-500
      bgColor: '#D1FAE5', // green-100
      icon: Target,
    },
    {
      name: 'Medium',
      data: data.medium,
      color: '#F59E0B', // amber-500
      bgColor: '#FEF3C7', // amber-100
      icon: BarChart3,
    },
    {
      name: 'Hard',
      data: data.hard,
      color: '#EF4444', // red-500
      bgColor: '#FEE2E2', // red-100
      icon: Trophy,
    },
  ];

  const totalSolved = Object.values(data).reduce((sum, level) => sum + level.solved, 0);
  const totalQuestions = Object.values(data).reduce((sum, level) => sum + level.total, 0);
  const overallPercentage = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {overallPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {totalSolved} of {totalQuestions} problems solved
            </div>
          </div>

          {/* Level-wise Progress */}
          <div className="space-y-4">
            {levels.map((level) => {
              const percentage = level.data.total > 0 
                ? (level.data.solved / level.data.total) * 100 
                : 0;
              const Icon = level.icon;

              return (
                <div key={level.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        className="h-4 w-4" 
                        style={{ color: level.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {level.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {level.data.solved}/{level.data.total}
                      </div>
                      {showPercentages && (
                        <div className="text-xs text-gray-500">
                          {percentage.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div 
                      className="w-full rounded-full h-3"
                      style={{ backgroundColor: level.bgColor }}
                    >
                      <div 
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: level.color
                        }}
                      />
                    </div>
                    
                    {/* Progress indicator */}
                    {percentage > 0 && (
                      <div 
                        className="absolute top-0 h-3 w-1 bg-white rounded-full shadow-sm transition-all duration-500"
                        style={{ 
                          left: `${Math.min(percentage, 100)}%`,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            {levels.map((level) => (
              <div key={level.name} className="text-center">
                <div 
                  className="text-lg font-bold"
                  style={{ color: level.color }}
                >
                  {level.data.solved}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  {level.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for smaller spaces
export function CompactProgressChart({ data }: { data: ProgressData }) {
  const levels = [
    { name: 'Easy', data: data.easy, color: '#10B981' },
    { name: 'Medium', data: data.medium, color: '#F59E0B' },
    { name: 'Hard', data: data.hard, color: '#EF4444' },
  ];

  return (
    <div className="space-y-3">
      {levels.map((level) => {
        const percentage = level.data.total > 0 
          ? (level.data.solved / level.data.total) * 100 
          : 0;

        return (
          <div key={level.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{level.name}</span>
              <span className="text-gray-600">
                {level.data.solved}/{level.data.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: level.color
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Circular progress chart
export function CircularProgressChart({ 
  solved, 
  total, 
  size = 120, 
  strokeWidth = 8,
  color = '#3B82F6'
}: {
  solved: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const percentage = total > 0 ? (solved / total) * 100 : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">
          {percentage.toFixed(0)}%
        </div>
        <div className="text-xs text-gray-500">
          {solved}/{total}
        </div>
      </div>
    </div>
  );
}