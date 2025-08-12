// src/app/dsa/questions/[id]/page.tsx

'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuestionDetail } from '@/hooks/useQuestions';
import { useSolutions } from '@/hooks/useSolutions';
import { useApproaches } from '@/hooks/useApproaches';
import { useQuestionProgress, useUpdateProgress } from '@/hooks/useProgress';
import { useCurrentUser } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionContent } from '@/components/dsa/QuestionContent';
import { SolutionsList } from '@/components/dsa/SolutionsList';
import { ApproachesList } from '@/components/dsa/ApproachesList';
import { ApproachEditor } from '@/components/dsa/ApproachEditor';
import { 
  CheckCircle, 
  Circle, 
  BookOpen, 
  Code, 
  Users, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import { getDifficultyColor } from '@/lib/utils';
import { UserRole } from '@/types';
import Link from 'next/link';

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;
  const { user } = useCurrentUser();
  
  const [activeTab, setActiveTab] = useState('description');
  const [showApproachEditor, setShowApproachEditor] = useState(false);

  // API calls
  const { data: questionDetail, isLoading } = useQuestionDetail(questionId);
  const { data: solutions } = useSolutions(questionId);
  const { data: approaches } = useApproaches(questionId);
  const { data: progress } = useQuestionProgress(questionId);
  const updateProgress = useUpdateProgress();

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPERADMIN;
  const question = questionDetail?.question;
  const solved = progress?.solved || questionDetail?.solved || false;

  const handleProgressToggle = () => {
    updateProgress.mutate({
      questionId,
      solved: !solved,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Question not found</h2>
        <p className="text-gray-600 mb-4">The question you're looking for doesn't exist.</p>
        <Link href="/dsa/questions">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Link href="/dsa/questions">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {question.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.level)}`}>
                  {question.level}
                </span>
                <span>{question.categoryName}</span>
                <span>By {question.createdByName}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Progress Toggle */}
              <Button
                onClick={handleProgressToggle}
                disabled={updateProgress.isPending}
                variant={solved ? "default" : "outline"}
                className={solved ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {solved ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Circle className="h-4 w-4 mr-2" />
                )}
                {updateProgress.isPending 
                  ? 'Updating...' 
                  : solved 
                    ? 'Solved' 
                    : 'Mark as Solved'
                }
              </Button>
              
              {/* Admin Actions */}
              {isAdmin && (
                <Link href={`/admin/questions/${questionId}/edit`}>
                  <Button variant="outline">
                    Edit Question
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Description</span>
          </TabsTrigger>
          
          <TabsTrigger value="solutions" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Solutions ({solutions?.length || 0})</span>
          </TabsTrigger>
          
          <TabsTrigger value="approaches" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Approaches ({approaches?.length || 0})</span>
          </TabsTrigger>
          
          <TabsTrigger value="add-approach" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Approach</span>
          </TabsTrigger>
        </TabsList>

        {/* Description Tab */}
        <TabsContent value="description" className="mt-6">
          <QuestionContent question={question} />
        </TabsContent>

        {/* Solutions Tab */}
        <TabsContent value="solutions" className="mt-6">
          <SolutionsList 
            questionId={questionId} 
            solutions={solutions || []} 
            isAdmin={isAdmin}
          />
        </TabsContent>

        {/* My Approaches Tab */}
        <TabsContent value="approaches" className="mt-6">
          <ApproachesList 
            questionId={questionId}
            approaches={approaches || []}
          />
        </TabsContent>

        {/* Add Approach Tab */}
        <TabsContent value="add-approach" className="mt-6">
          <ApproachEditor 
            questionId={questionId}
            onSuccess={() => {
              setActiveTab('approaches');
              setShowApproachEditor(false);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}