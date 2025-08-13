// src/app/dsa/categories/[id]/page.tsx  
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuestions } from '@/hooks/useQuestions';
import { useCategoryProgress } from '@/hooks/useProgress';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuestionCard } from '@/components/dsa/QuestionCard';
import { 
  ArrowLeft,
  Filter,
  BookOpen,
  Target,
  Trophy,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuestionLevel, UserRole, Question } from '@/types';

// Extended Question type to include solved status
interface QuestionWithProgress extends Question {
  solved?: boolean;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const { user } = useCurrentUser();
  
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [solvedFilter, setSolvedFilter] = useState<string>(''); // 'solved', 'unsolved', ''
  
  // API calls
  const { data: questionsData, isLoading: questionsLoading } = useQuestions({
    page: 0,
    size: 50,
    category: categoryId,
    level: levelFilter,
  });
  
  const { isLoading: progressLoading } = useCategoryProgress(categoryId);
  
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
  
  // Add mock solved status to questions - replace with real progress data
  const questions: QuestionWithProgress[] = (questionsData?.content || []).map(question => ({
    ...question,
    solved: Math.random() > 0.7, // Mock solved status - replace with real progress data
  }));
  
  // Mock category data - replace with real API call
  const category = {
    id: categoryId,
    name: 'Arrays & Strings',
    description: 'Master fundamental data structures and string manipulation techniques. Learn to solve problems involving arrays, lists, and string processing.',
    color: '#3B82F6',
    questionsCount: questions.length,
    difficulty: 'Mixed' as const,
  };

  // Filter questions based on solved status
  const filteredQuestions = questions.filter(question => {
    if (solvedFilter === 'solved') return question.solved;
    if (solvedFilter === 'unsolved') return !question.solved;
    return true;
  });

  const levelStats = {
    easy: questions.filter(q => q.level === QuestionLevel.EASY).length,
    medium: questions.filter(q => q.level === QuestionLevel.MEDIUM).length,
    hard: questions.filter(q => q.level === QuestionLevel.HARD).length,
  };

  const solvedStats = {
    easy: questions.filter(q => q.level === QuestionLevel.EASY && q.solved).length,
    medium: questions.filter(q => q.level === QuestionLevel.MEDIUM && q.solved).length,
    hard: questions.filter(q => q.level === QuestionLevel.HARD && q.solved).length,
  };

  const totalSolved = Object.values(solvedStats).reduce((sum, count) => sum + count, 0);
  const totalQuestions = Object.values(levelStats).reduce((sum, count) => sum + count, 0);
  const overallProgress = totalQuestions > 0 ? (totalSolved / totalQuestions) * 100 : 0;

  if (questionsLoading || progressLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: `${category.color}20`,
                  color: category.color
                }}
              >
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-600">
                    {category.questionsCount} problems
                  </span>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    'bg-purple-100 text-purple-800'
                  )}>
                    {category.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 max-w-2xl">
              {category.description}
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <Button variant="outline">
            Edit Category
          </Button>
        )}
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {overallProgress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(overallProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {totalSolved}/{totalQuestions} solved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Easy</span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {solvedStats.easy}/{levelStats.easy}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${levelStats.easy > 0 ? (solvedStats.easy / levelStats.easy) * 100 : 0}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Medium</span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {solvedStats.medium}/{levelStats.medium}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${levelStats.medium > 0 ? (solvedStats.medium / levelStats.medium) * 100 : 0}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Hard</span>
            </div>
            <div className="text-lg font-bold text-gray-900 mb-1">
              {solvedStats.hard}/{levelStats.hard}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${levelStats.hard > 0 ? (solvedStats.hard / levelStats.hard) * 100 : 0}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Filters:</span>
            </div>
            
            {/* Difficulty Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Difficulty:</span>
              <div className="flex space-x-1">
                <Button
                  variant={levelFilter === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter('')}
                >
                  All
                </Button>
                <Button
                  variant={levelFilter === 'easy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter(levelFilter === 'easy' ? '' : 'easy')}
                >
                  Easy
                </Button>
                <Button
                  variant={levelFilter === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter(levelFilter === 'medium' ? '' : 'medium')}
                >
                  Medium
                </Button>
                <Button
                  variant={levelFilter === 'hard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter(levelFilter === 'hard' ? '' : 'hard')}
                >
                  Hard
                </Button>
              </div>
            </div>

            {/* Solved Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <div className="flex space-x-1">
                <Button
                  variant={solvedFilter === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSolvedFilter('')}
                >
                  All
                </Button>
                <Button
                  variant={solvedFilter === 'solved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSolvedFilter(solvedFilter === 'solved' ? '' : 'solved')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Solved
                </Button>
                <Button
                  variant={solvedFilter === 'unsolved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSolvedFilter(solvedFilter === 'unsolved' ? '' : 'unsolved')}
                >
                  Unsolved
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            {(levelFilter || solvedFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setLevelFilter('');
                  setSolvedFilter('');
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      {filteredQuestions.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Problems ({filteredQuestions.length})
            </h2>
          </div>
          
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No problems found
            </h3>
            <p className="text-gray-600 mb-4">
              {(levelFilter || solvedFilter) 
                ? 'Try adjusting your filters to see more problems.'
                : 'This category doesn\'t have any problems yet.'
              }
            </p>
            {(levelFilter || solvedFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setLevelFilter('');
                  setSolvedFilter('');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}