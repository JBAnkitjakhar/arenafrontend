// src/app/progress/page.tsx

'use client';

import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useProgressStats, useRecentProgress } from '@/hooks/useProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressStats } from '@/components/progress/ProgressStats';
import { 
  Clock,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight,
  Trophy,
  Star,
  Zap,
  Flame,
  ChevronRight,
  BarChart3,
  Activity,
  Sparkles,
  Code
} from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import { QuestionLevel } from '@/types';
import Link from 'next/link';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

// Types for API response structure
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

interface RecentActivityItem {
  id: string;
  questionId: string;
  questionTitle: string;
  level: QuestionLevel;
  solvedAt: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

// Enhanced Recent Activity Component
const RecentActivity = ({ activity }: { activity: RecentActivityItem[] }) => {
  if (!activity || activity.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recent activity</h3>
            <p className="text-gray-600 mb-6">Start solving problems to see your progress here!</p>
            <Link href="/dsa/questions">
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                animate={true}
                icon={<Target className="h-4 w-4" />}
              >
                Browse Questions
              </Button>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const formatActivityDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <motion.div
            className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
            whileHover={{ rotate: 5, scale: 1.1 }}
          >
            <Clock className="h-5 w-5 text-white" />
          </motion.div>
          <span>Recent Activity</span>
          <span className="text-sm font-normal text-gray-500">({activity.length} solved)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activity.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <Link href={`/dsa/questions/${item.questionId}`}>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:from-green-50 hover:to-blue-50 transition-all duration-300 border border-gray-100 hover:border-green-200 group cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
                      whileHover={{ rotate: 10 }}
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.questionTitle}
                      </h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(item.level)}`}>
                          {item.level}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatActivityDate(item.solvedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {activity.length >= 10 && (
          <div className="mt-6 text-center">
            <Link href="/dsa/questions?solved=true">
              <Button 
                variant="outline" 
                className="w-full hover:bg-blue-50 border-blue-200"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                View All Solved Problems
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced Achievement Card Component
const AchievementCard = ({ 
  icon: Icon, 
  title, 
  description, 
  progress, 
  total, 
  color = 'blue',
  // isUnlocked = false 
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  progress: number;
  total: number;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  isUnlocked?: boolean;
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
    pink: 'from-pink-500 to-rose-500',
  };

  const bgColorClasses = {
    blue: 'from-blue-50 to-cyan-50',
    green: 'from-green-50 to-emerald-50',
    purple: 'from-purple-50 to-pink-50',
    orange: 'from-orange-50 to-red-50',
    pink: 'from-pink-50 to-rose-50',
  };

  const percentage = total > 0 ? (progress / total) * 100 : 0;
  const isCompleted = progress >= total && total > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`relative overflow-hidden border-0 shadow-lg ${
        isCompleted 
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 ring-2 ring-yellow-400' 
          : `bg-gradient-to-br ${bgColorClasses[color]}`
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <motion.div 
              className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}
              animate={isCompleted ? { 
                boxShadow: [
                  "0 0 0 0 rgba(245, 158, 11, 0.7)",
                  "0 0 0 15px rgba(245, 158, 11, 0)",
                ]
              } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold">
                    {progress}/{total} 
                    {isCompleted && <span className="ml-1">🏆</span>}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div 
                    className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-500`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% completed
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-full blur-2xl`} />
          {isCompleted && (
            <motion.div
              className="absolute top-2 right-2"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <Star className="h-6 w-6 text-yellow-500 fill-current" />
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ProgressPage() {
  const { data: stats, isLoading: statsLoading } = useProgressStats();
  const { data: recentActivity, isLoading: activityLoading } = useRecentProgress();
  const [activeTab, setActiveTab] = useState('overview');

  // Process stats to match expected structure
  const processedStats = (() => {
    if (!stats || typeof stats !== 'object') {
      return {
        totalSolved: 0,
        solvedByLevel: { easy: 0, medium: 0, hard: 0 },
        totalQuestions: 0,
        recentSolved: 0,
        streak: 0
      };
    }

    const apiStats = stats as ApiProgressStats;
    return {
      totalSolved: apiStats.totalSolved || 0,
      solvedByLevel: {
        easy: apiStats.solvedByLevel?.easy || 0,
        medium: apiStats.solvedByLevel?.medium || 0,
        hard: apiStats.solvedByLevel?.hard || 0,
      },
      totalQuestions: apiStats.totalQuestions || 0,
      recentSolved: apiStats.recentSolved || 0,
      streak: apiStats.streak || 0
    };
  })();

  // Type the activity properly
  const typedActivity: RecentActivityItem[] = Array.isArray(recentActivity) 
    ? recentActivity.map((item: unknown) => {
        const activityItem = item as Partial<RecentActivityItem>;
        return {
          id: activityItem.id || `activity-${Date.now()}-${Math.random()}`,
          questionId: activityItem.questionId || '',
          questionTitle: activityItem.questionTitle || 'Unknown Question',
          level: (activityItem.level as QuestionLevel) || QuestionLevel.EASY,
          solvedAt: activityItem.solvedAt || new Date().toISOString()
        };
      })
    : [];

  // Calculate achievements based on real data
  const achievements = [
    {
      icon: Target,
      title: 'Getting Started',
      description: 'Solve your first problem',
      progress: Math.min(processedStats.totalSolved, 1),
      total: 1,
      color: 'green' as const,
      isUnlocked: processedStats.totalSolved >= 1,
    },
    {
      icon: TrendingUp,
      title: 'Problem Solver',
      description: 'Solve 10 problems',
      progress: Math.min(processedStats.totalSolved, 10),
      total: 10,
      color: 'blue' as const,
      isUnlocked: processedStats.totalSolved >= 10,
    },
    {
      icon: Award,
      title: 'Dedicated Learner',
      description: 'Solve 50 problems',
      progress: Math.min(processedStats.totalSolved, 50),
      total: 50,
      color: 'purple' as const,
      isUnlocked: processedStats.totalSolved >= 50,
    },
    {
      icon: CheckCircle,
      title: 'Easy Enthusiast',
      description: 'Solve 10 easy problems',
      progress: Math.min(processedStats.solvedByLevel.easy, 10),
      total: 10,
      color: 'green' as const,
      isUnlocked: processedStats.solvedByLevel.easy >= 10,
    },
    {
      icon: Zap,
      title: 'Medium Challenger',
      description: 'Solve 5 medium problems',
      progress: Math.min(processedStats.solvedByLevel.medium, 5),
      total: 5,
      color: 'orange' as const,
      isUnlocked: processedStats.solvedByLevel.medium >= 5,
    },
    {
      icon: Flame,
      title: 'Hard Warrior',
      description: 'Solve 3 hard problems',
      progress: Math.min(processedStats.solvedByLevel.hard, 3),
      total: 3,
      color: 'pink' as const,
      isUnlocked: processedStats.solvedByLevel.hard >= 3,
    },
  ];

  const loading = statsLoading || activityLoading;
  const overallProgress = processedStats.totalQuestions > 0 
    ? Math.round((processedStats.totalSolved / processedStats.totalQuestions) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="space-y-2">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-3"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </motion.div>
              <span>Your Progress</span>
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Track your learning journey and celebrate your achievements
            </p>
          </div>
        </motion.div>

        {/* Progress Summary Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            {
              title: 'Total Solved',
              value: processedStats.totalSolved,
              description: `out of ${processedStats.totalQuestions} problems`,
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-50 to-emerald-50',
              progress: overallProgress,
            },
            {
              title: 'Easy Problems',
              value: processedStats.solvedByLevel.easy,
              description: 'foundational concepts',
              icon: Target,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-50 to-cyan-50',
            },
            {
              title: 'Medium Problems',
              value: processedStats.solvedByLevel.medium,
              description: 'intermediate challenges',
              icon: TrendingUp,
              color: 'from-orange-500 to-red-500',
              bgColor: 'from-orange-50 to-red-50',
            },
            {
              title: 'Hard Problems',
              value: processedStats.solvedByLevel.hard,
              description: 'advanced algorithms',
              icon: Trophy,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-50 to-pink-50',
            },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card 
                variant="elevated" 
                className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border-0 hover:shadow-xl transition-all duration-300`}
                hover={true}
                animate={true}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <motion.div 
                      className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </div>
                  </div>
                  {stat.progress && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-2xl`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Tabs */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <CardTitle>Detailed Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>Achievements</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
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
                    <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <Trophy className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Achievement Gallery</h3>
                      <p className="text-gray-600">
                        Unlock badges by solving problems and reaching milestones
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {achievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <AchievementCard
                            icon={achievement.icon}
                            title={achievement.title}
                            description={achievement.description}
                            progress={achievement.progress}
                            total={achievement.total}
                            color={achievement.color}
                            isUnlocked={achievement.isUnlocked}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="mt-6">
                  <RecentActivity activity={typedActivity} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Motivational Section */}
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.h3 
                  className="text-2xl font-bold text-white mb-4"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Keep pushing your limits! 🚀
                </motion.h3>
                <p className="text-blue-100 mb-6">
                  Every problem solved is a step closer to mastering algorithms and data structures.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dsa/questions">
                    <Button 
                      variant="outline" 
                      className="bg-white text-blue-600 hover:bg-blue-50 border-white"
                      animate={true}
                      icon={<Target className="h-4 w-4" />}
                    >
                      Solve More Problems
                    </Button>
                  </Link>
                  <Link href="/compiler">
                    <Button 
                      variant="outline" 
                      className="bg-transparent text-white border-white hover:bg-white/10"
                      animate={true}
                      icon={<Code className="h-4 w-4" />}
                    >
                      Practice Coding
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                className="absolute top-4 right-4 text-6xl opacity-20"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🏆
              </motion.div>
              <motion.div
                className="absolute bottom-4 left-4 text-4xl opacity-20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⭐
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}