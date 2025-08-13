// src/app/admin/questions/page.tsx - Fixed version

'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuestions, useQuestionCounts, useDeleteQuestion } from '@/hooks/useQuestions';
import { useCategories } from '@/hooks/useCategories';
import { AdminRoute } from '@/components/auth/RouteGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Calendar,
  User,
} from 'lucide-react';
import { QuestionLevel, Question } from '@/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// Simple components to avoid import conflicts
const SearchInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default function AdminQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deleteQuestion = useDeleteQuestion();
  
  // URL parameters
  const currentPage = parseInt(searchParams.get('page') || '0');
  const categoryFilter = searchParams.get('category') || '';
  const levelFilter = searchParams.get('level') || '';
  const searchQuery = searchParams.get('search') || '';
  
  // Local state
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // API calls with proper type handling
  const { data: categories = [] } = useCategories();
  const { data: counts } = useQuestionCounts();
  const { data: questionsData, isLoading } = useQuestions({
    page: currentPage,
    size: 20,
    category: categoryFilter,
    level: levelFilter,
    search: searchQuery,
  });

  // Safely extract data with defaults
  const questions: Question[] = questionsData?.content || [];
  const totalPages = questionsData?.totalPages || 0;
  const totalElements = questionsData?.totalElements || 0;

  // Update URL params
  const updateFilters = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/admin/questions?${params.toString()}`);
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

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion.mutateAsync(questionId);
      setShowDeleteModal(null);
    } catch {
      // Error handling is done in hook
    }
  };

  const getDifficultyBadge = (level: QuestionLevel) => {
    const colors = {
      [QuestionLevel.EASY]: 'bg-green-100 text-green-800',
      [QuestionLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [QuestionLevel.HARD]: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge className={colors[level]}>
        {level}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    router.push('/admin/questions');
  };

  const hasFilters = categoryFilter || levelFilter || searchQuery;

  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
            <p className="text-gray-600 mt-1">
              Create, edit, and manage coding problems
            </p>
          </div>
          <Link href="/admin/questions/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{counts?.total || 0}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{counts?.byLevel?.easy || 0}</div>
                  <div className="text-sm text-gray-600">Easy</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{counts?.byLevel?.medium || 0}</div>
                  <div className="text-sm text-gray-600">Medium</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{counts?.byLevel?.hard || 0}</div>
                  <div className="text-sm text-gray-600">Hard</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <SearchInput
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search questions..."
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Level Filter */}
              <select
                value={levelFilter}
                onChange={(e) => handleLevelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>

              {/* Search & Clear */}
              <div className="flex space-x-2">
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4 mr-1" />
                  Search
                </Button>
                {hasFilters && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Questions ({totalElements})</span>
              {selectedQuestions.length > 0 && (
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected ({selectedQuestions.length})
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600 mb-4">
                  {hasFilters ? 'Try adjusting your filters.' : 'Get started by creating your first question.'}
                </p>
                <Link href="/admin/questions/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question: Question) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestions.includes(question.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedQuestions([...selectedQuestions, question.id]);
                              } else {
                                setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                              }
                            }}
                            className="rounded"
                          />
                          
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                            <Link href={`/dsa/questions/${question.id}`}>
                              {question.title}
                            </Link>
                          </h3>
                          
                          {getDifficultyBadge(question.level)}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {question.statement.substring(0, 150)}...
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{question.createdByName}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                          </div>
                          
                          <Badge className="bg-gray-100 text-gray-800">
                            {question.categoryName}
                          </Badge>
                          
                          {question.imageUrls && question.imageUrls.length > 0 && (
                            <span className="text-green-600">
                              {question.imageUrls.length} image{question.imageUrls.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Link href={`/dsa/questions/${question.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Link href={`/admin/questions/${question.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteModal(question.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {currentPage * 20 + 1} to {Math.min((currentPage + 1) * 20, totalElements)} of {totalElements} questions
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => updateFilters({
                  category: categoryFilter,
                  level: levelFilter,
                  search: searchQuery,
                  page: (currentPage - 1).toString(),
                })}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages - 1}
                onClick={() => updateFilters({
                  category: categoryFilter,
                  level: levelFilter,
                  search: searchQuery,
                  page: (currentPage + 1).toString(),
                })}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Question
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this question? This action cannot be undone and will also delete all associated solutions and user approaches.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteQuestion(showDeleteModal)}
                  disabled={deleteQuestion.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteQuestion.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}