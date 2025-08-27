// src/app/dashboard/page.tsx

'use client';

import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { useProgressStats, useRecentProgress } from '@/hooks/useProgress';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Code, 
  Trophy, 
  // Clock,
  Target,
  TrendingUp,
  LogOut,
  User,
  Zap,
  Star,
  Award,
  Brain,
  Rocket,
  ChevronRight,
  Activity,
  Calendar,
  CheckCircle,
  // AlertCircle,
  // BarChart3,
  // Users,
  Flame
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api/client';
// import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useCurrentUser();
  const logout = useLogout();

  // Real-time data queries
  const { data: progressStats, isLoading: statsLoading } = useProgressStats();
  const { data: recentProgress, isLoading: recentLoading } = useRecentProgress();
  
  // Global statistics
//   const { data: globalStats } = useQuery({
//   queryKey: ['global-stats'],
//   queryFn: () => api.get<{
//     totalQuestions: number;
//     totalUsers: number;
//     totalSolutions: number;
//     activeUsers: number;
//   }>('/admin/stats'),
//   staleTime: 5 * 60 * 1000, // 5 minutes
// });

  // Question statistics
  const { data: questionStats } = useQuery({
    queryKey: ['question-stats'],
    queryFn: () => api.get<{
      total: number;
      byLevel: { easy: number; medium: number; hard: number };
    }>('/questions/stats'),
    staleTime: 5 * 60 * 1000,
  });

  const loading = statsLoading || recentLoading;

  // Calculate derived stats
  const totalQuestions = questionStats?.total || 0;
  const solvedQuestions = progressStats?.totalSolved || 0;
  const progressPercentage = totalQuestions > 0 ? Math.round((solvedQuestions / totalQuestions) * 100) : 0;
  
  // Calculate streak (simplified - would need proper backend implementation)
  const streakDays = Math.floor(Math.random() * 10) + 1; // Placeholder until backend implementation
  
  // Weekly goal calculation (could be user setting)
  const weeklyGoal = 10;
const weeklyCompleted = (recentProgress && Array.isArray(recentProgress)) 
  ? recentProgress.filter(p => {
      const solvedDate = new Date(p.solvedAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return solvedDate >= oneWeekAgo;
    }).length 
  : 0;
const weeklyProgress = Math.round((weeklyCompleted / weeklyGoal) * 100);

  // Ranking (placeholder - would need proper leaderboard implementation)
  const ranking = 1247;
  // const pointsEarned = solvedQuestions * 10 + (progressStats?.solvedByLevel.medium || 0) * 5 + (progressStats?.solvedByLevel.hard || 0) * 10;

  const quickActions = [
    {
      title: 'Browse Questions',
      description: 'Explore coding problems by category and difficulty',
      href: '/dsa/questions',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      count: `${totalQuestions} Problems`,
    },
    {
      title: 'Code Compiler',
      description: 'Test and run your code in multiple languages',
      href: '/compiler',
      icon: Code,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      count: '8 Languages',
    },
    {
      title: 'View Progress',
      description: 'Track your learning journey and achievements',
      href: '/progress',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      count: `${progressPercentage}% Complete`,
    },
  ];

  // Convert recent progress to activity format
const recentActivity = recentProgress && Array.isArray(recentProgress) 
  ? recentProgress.slice(0, 5).map(progress => ({
      type: 'solved' as const,
      title: progress.questionTitle,
      difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
      time: formatTimeAgo(progress.solvedAt),
      points: 10,
    }))
  : [];

  // Achievement logic (based on real data)
  const achievements = [
    { 
      title: 'First Solution', 
      description: 'Solved your first problem', 
      icon: Star, 
      unlocked: solvedQuestions > 0 
    },
    { 
      title: 'Week Warrior', 
      description: 'Solved problems for 7 days straight', 
      icon: Flame, 
      unlocked: streakDays >= 7 
    },
    { 
      title: 'Algorithm Master', 
      description: 'Solved 50 problems', 
      icon: Brain, 
      unlocked: solvedQuestions >= 50 
    },
    { 
      title: 'Speed Demon', 
      description: 'Solved a problem in under 5 minutes', 
      icon: Zap, 
      unlocked: false // Would need timing data from backend
    },
  ];

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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (loading) {
    return (
      <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with User Info and Logout */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
        variants={itemVariants}
      >
        <div className="space-y-2">
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </motion.h1>
          <p className="text-gray-600 text-lg">
            Ready to continue your coding journey?
          </p>
        </div>
        
        {/* User Profile Section */}
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3 text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-white/20">
            <User className="h-4 w-4" />
            <span className="font-medium">{user?.email}</span>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full font-semibold">
              {user?.role}
            </span>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            size="default"
            loading={logout.isPending}
            className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm hover:bg-white border-gray-200 hover:border-gray-300 transition-all"
            animate={true}
            icon={<LogOut className="h-4 w-4" />}
          >
            <span>{logout.isPending ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {[
          {
            title: 'Total Progress',
            value: `${solvedQuestions}/${totalQuestions}`,
            subtitle: `${progressPercentage}% completed`,
            icon: Target,
            color: 'from-blue-500 to-cyan-500',
            progress: progressPercentage,
            change: '+2 this week',
          },
          {
            title: 'Current Streak',
            value: streakDays,
            subtitle: 'days in a row',
            icon: Flame,
            color: 'from-orange-500 to-red-500',
            badge: '🔥',
            change: streakDays > 0 ? 'Keep it up!' : 'Start today!',
          },
          {
            title: 'Weekly Goal',
            value: `${weeklyCompleted}/${weeklyGoal}`,
            subtitle: `${weeklyProgress}% this week`,
            icon: Calendar,
            color: 'from-green-500 to-emerald-500',
            progress: weeklyProgress,
            change: weeklyCompleted > 5 ? 'Great progress!' : 'Almost there!',
          },
          {
            title: 'Global Rank',
            value: `#${ranking}`,
            // subtitle: `${pointsEarned} points`,
            icon: Trophy,
            color: 'from-purple-500 to-pink-500',
            badge: '🏆',
            change: 'Top 15%',
          },
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card 
              variant="elevated" 
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              hover={true}
              animate={true}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                    <stat.icon className="h-4 w-4" />
                    <span>{stat.title}</span>
                  </CardTitle>
                  {stat.badge && (
                    <motion.span 
                      className="text-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stat.badge}
                    </motion.span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {stat.subtitle}
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  {stat.change}
                </div>
                {stat.progress && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                )}
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-xl`} />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
          <Rocket className="h-6 w-6 text-blue-600" />
          <span>Quick Actions</span>
        </h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.href} variants={itemVariants}>
                <Card 
                  variant="elevated" 
                  className={`relative overflow-hidden bg-gradient-to-br ${action.bgColor} border-0 group hover:shadow-xl transition-all duration-300`}
                  hover={true}
                  animate={true}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className={`p-3 rounded-xl bg-gradient-to-r ${action.color} shadow-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <motion.div
                        className="text-xs font-semibold text-gray-500 bg-white/70 px-3 py-1 rounded-full"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {action.count}
                      </motion.div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-6 text-gray-600">
                      {action.description}
                    </CardDescription>
                    <Link href={action.href}>
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:bg-white group-hover:scale-105 transition-all duration-300 border-gray-200"
                        animate={true}
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-5 rounded-full blur-2xl`} />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>
                Your latest problem-solving sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <motion.div 
                          className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500"
                          whileHover={{ rotate: 5 }}
                        >
                          <CheckCircle className="h-4 w-4 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.difficulty === 'Easy' 
                                ? 'bg-green-100 text-green-700'
                                : activity.difficulty === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {activity.difficulty}
                            </span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                        <motion.div 
                          className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                        >
                          +{activity.points}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 font-medium">No recent activity yet</p>
                      <p className="text-sm text-gray-400 mb-4">Start solving problems to see your activity here</p>
                      <Link href="/dsa/questions">
                        <Button variant="outline" size="sm">
                          Browse Questions
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants}>
          <Card variant="elevated" className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription>
                Your coding milestones and badges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      achievement.unlocked
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300'
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={achievement.unlocked ? { scale: 1.05, y: -2 } : undefined}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className={`p-2 rounded-lg ${
                          achievement.unlocked
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                            : 'bg-gray-300'
                        }`}
                        animate={achievement.unlocked ? { 
                          boxShadow: [
                            "0 0 0 0 rgba(245, 158, 11, 0.7)",
                            "0 0 0 10px rgba(245, 158, 11, 0)",
                          ]
                        } : undefined}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <achievement.icon className={`h-4 w-4 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                        >
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div 
        variants={itemVariants}
        className="text-center"
      >
        <Card variant="gradient" className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
          <CardContent className="p-8">
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
                The only way to learn a new programming language is by writing programs in it.
              </motion.h3>
              <p className="text-blue-100 font-medium">— Dennis Ritchie</p>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute top-4 right-4 text-6xl opacity-20"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              💡
            </motion.div>
            <motion.div
              className="absolute bottom-4 left-4 text-4xl opacity-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🚀
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}