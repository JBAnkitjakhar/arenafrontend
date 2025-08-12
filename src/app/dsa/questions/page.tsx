// src/app/dsa/questions/page.tsx

'use client';

import { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuestions, useQuestionCounts } from '@/hooks/useQuestions';
import { useCategories } from '@/hooks/useCategories';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuestionCard } from '@/components/dsa/QuestionCard';
import { 
  Search, 
  Filter, 
  Plus,
  BookOpen,
  Target,
  Trophy
} from 'lucide-react';
import { QuestionLevel, UserRole } from '@/types';
import { cn, getDifficultyColor } from '@/lib/utils';
import Link from 'next/link';

// Custom Input component
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50',
      className
    )}
    {...props}
  />
);

export default function QuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();
  
  // URL parameters
  const currentPage = parseInt(searchParams.get('page') || '0');
  const categoryFilter = searchParams.get('category') || '';
  const levelFilter = searchParams.get('level') || '';
  const searchQuery = searchParams.get('search') || '';
  
  // Local state
  const [searchInput, setSearchInput] = useState(searchQuery);
  
  // API calls
  const { data: categories } = useCategories();
  const { data: counts } = useQuestionCounts();
  const { data: questionsData, isLoading } = useQuestions({
    page: currentPage,
    size: 20,
    category: categoryFilter,
    level: levelFilter,
    search: searchQuery,
  });

  // Update URL params
  const updateFilters = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/dsa/questions?${params.toString()}`);
  };

  const handleSearch = () => {
    updateFilters({
      category: categoryFilter,
      level: levelFilter,
      search: searchInput,
      page: '0',
    });
  };

  const handleCategoryFilter = (categoryId: string) => {
    updateFilters({
      category: categoryId === categoryFilter ? '' : categoryId,
      level: levelFilter,
      search: searchQuery,
      page: '0',
    });
  };

  const handleLevelFilter = (level: string) => {
    updateFilters({
      category: categoryFilter,
      level: level === levelFilter ? '' : level,
      search: searchQuery,
      page: '0',
    });
  };

  const clearFilters = () => {
    setSearchInput('');
    router.push('/dsa/questions');
  };

  const hasFilters = categoryFilter || levelFilter || searchQuery;
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600 mt-1">
            Practice coding problems and improve your skills
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin/questions/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      {counts && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{counts.total}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{counts.byLevel.easy}</div>
                  <div className="text-sm text-gray-600">Easy</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{counts.byLevel.medium}</div>
                  <div className="text-sm text-gray-600">Medium</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{counts.byLevel.hard}</div>
                  <div className="text-sm text-gray-600">Hard</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search questions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Categories</div>
            <div className="flex flex-wrap gap-2">
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    categoryFilter === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Difficulty</div>
            <div className="flex space-x-2">
              {Object.values(QuestionLevel).map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelFilter(level)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm transition-colors',
                    levelFilter === level
                      ? getDifficultyColor(level) + ' border'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : questionsData?.content.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                {hasFilters 
                  ? 'Try adjusting your filters to see more results.'
                  : 'No questions available at the moment.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          questionsData?.content.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>

      {/* Pagination */}
      {questionsData && questionsData.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 0}
            onClick={() => updateFilters({
              category: categoryFilter,
              level: levelFilter,
              search: searchQuery,
              page: String(currentPage - 1),
            })}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage + 1} of {questionsData.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage >= questionsData.totalPages - 1}
            onClick={() => updateFilters({
              category: categoryFilter,
              level: levelFilter,
              search: searchQuery,
              page: String(currentPage + 1),
            })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}