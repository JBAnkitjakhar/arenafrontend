// src/components/progress/ProgressCharts.tsx

'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Activity,
  Calendar,
  Zap
} from 'lucide-react';

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

interface RecentActivity {
  id: string;
  questionId: string;
  questionTitle: string;
  level: string;
  solvedAt: string;
}

interface ProgressChartsProps {
  stats: ProgressStats;
  recentActivity: RecentActivity[];
}

const COLORS = {
  easy: '#22c55e',
  medium: '#f59e0b', 
  hard: '#ef4444',
  solved: '#3b82f6',
  unsolved: '#e5e7eb'
};

const DIFFICULTY_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export function ProgressCharts({ stats, recentActivity }: ProgressChartsProps) {
  
  // Data for overall progress pie chart
  const overallProgressData = [
    { name: 'Solved', value: stats.totalSolved, color: COLORS.solved },
    { name: 'Remaining', value: stats.totalQuestions - stats.totalSolved, color: COLORS.unsolved }
  ];

  // Data for difficulty breakdown
  const difficultyData = [
    { 
      name: 'Easy', 
      solved: stats.solvedByLevel.easy, 
      total: stats.totalByLevel.easy,
      percentage: stats.progressByLevel.easy,
      color: COLORS.easy
    },
    { 
      name: 'Medium', 
      solved: stats.solvedByLevel.medium, 
      total: stats.totalByLevel.medium,
      percentage: stats.progressByLevel.medium,
      color: COLORS.medium
    },
    { 
      name: 'Hard', 
      solved: stats.solvedByLevel.hard, 
      total: stats.totalByLevel.hard,
      percentage: stats.progressByLevel.hard,
      color: COLORS.hard
    }
  ];

  // Data for detailed pie chart by difficulty
  const detailedPieData = [
    { name: 'Easy', value: stats.solvedByLevel.easy, color: COLORS.easy },
    { name: 'Medium', value: stats.solvedByLevel.medium, color: COLORS.medium },
    { name: 'Hard', value: stats.solvedByLevel.hard, color: COLORS.hard }
  ];

  // Process recent activity for activity chart (last 7 days)
  const processActivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = recentActivity.filter(activity => 
        activity.solvedAt.split('T')[0] === date
      ).length;
      
      return {
        date: date,
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        solved: count
      };
    });
  };

  const activityData = processActivityData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Overall Progress Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Overall Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {overallProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(stats.progressPercentage)}%
            </div>
            <div className="text-sm text-gray-600">
              {stats.totalSolved} of {stats.totalQuestions} completed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difficulty Breakdown Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <span>Progress by Difficulty</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="solved" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            {difficultyData.map((item) => (
              <div key={item.name} className="text-center">
                <div className="text-lg font-bold" style={{ color: item.color }}>
                  {Math.round(item.percentage)}%
                </div>
                <div className="text-xs text-gray-600">
                  {item.name}: {item.solved}/{item.total}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Solved Questions by Difficulty Pie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Solved Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={detailedPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {detailedPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-center space-x-6 mt-4">
            {detailedPieData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-orange-600" />
            <span>7-Day Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="solved" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Last 7 days</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>
                Total: {activityData.reduce((sum, day) => sum + day.solved, 0)} solved
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}