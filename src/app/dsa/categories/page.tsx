// src/app/dsa/categories/page.tsx 

'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search,
  FolderOpen,
  Plus,
  BookOpen,
  Target,
  BarChart3,
  ArrowRight,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole, Category } from '@/types';
import Link from 'next/link';

// Local Input component to avoid conflicts
const CategoriesInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50',
      className
    )}
    {...props}
  />
);

// Extended Category interface for UI purposes
interface CategoryWithStats extends Category {
  description?: string;
  questionsCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  color?: string;
}

interface CategoryCardProps {
  category: CategoryWithStats;
  userProgress?: {
    solved: number;
    total: number;
    percentage: number;
  };
}

const CategoryCard = ({ category, userProgress }: CategoryCardProps) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-orange-100 text-orange-800',
    Hard: 'bg-red-100 text-red-800',
    Mixed: 'bg-purple-100 text-purple-800',
  };

  const progressPercentage = userProgress?.percentage || 0;

  return (
    <Link href={`/dsa/categories/${category.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: category.color ? `${category.color}20` : '#f3f4f6',
                  color: category.color || '#6b7280'
                }}
              >
                <FolderOpen className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {category.name}
                </CardTitle>
                {category.difficulty && (
                  <span className={cn(
                    'inline-block px-2 py-1 rounded-full text-xs font-medium mt-1',
                    difficultyColors[category.difficulty]
                  )}>
                    {category.difficulty}
                  </span>
                )}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {category.description || 'Explore problems in this category to improve your skills.'}
          </p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {category.questionsCount || 0} problems
              </span>
            </div>
            
            {userProgress && (
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 font-medium">
                  {userProgress.solved}/{userProgress.total}
                </span>
              </div>
            )}
          </div>

          {userProgress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default function CategoriesPage() {
  const { user } = useCurrentUser();
  const { data: categoriesData, isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;

  // Enhance categories with mock data for now - replace with real API
  const categories: CategoryWithStats[] = (categoriesData || []).map(category => ({
    ...category,
    description: 'Explore problems in this category to improve your skills.',
    questionsCount: Math.floor(Math.random() * 20) + 5,
    difficulty: (['Easy', 'Medium', 'Hard', 'Mixed'] as const)[Math.floor(Math.random() * 4)],
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
  }));

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock progress data - replace with real API call
  const getUserProgress = () => {
    // This would come from useProgressByCategory hook
    const mockData = {
      solved: Math.floor(Math.random() * 10),
      total: Math.floor(Math.random() * 20) + 10,
      percentage: 0,
    };
    mockData.percentage = (mockData.solved / mockData.total) * 100;
    return mockData;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Browse problems by topic and master different algorithms
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin/categories/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <CategoriesInput
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Stats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{categories?.length || 0}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {categories?.reduce((sum, cat) => sum + (cat.questionsCount || 0), 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Total Problems</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {categories?.reduce((sum) => sum + getUserProgress().solved, 0) || 0}
                </div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((categories?.reduce((sum) => sum + getUserProgress().percentage, 0) || 0) / (categories?.length || 1))}%
                </div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              userProgress={getUserProgress()}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No categories found' : 'No categories available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms.'
                : 'Categories will appear here once they are added.'
              }
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}