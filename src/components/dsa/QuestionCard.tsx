// src/components/dsa/QuestionCard.tsx

'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { formatDate, getDifficultyColor, truncateText } from '@/lib/utils';
import { 
  Clock, 
  User, 
  BookOpen, 
  CheckCircle,
  ExternalLink,
  ImageIcon
} from 'lucide-react';

// Extended Question interface to include progress information
interface QuestionWithProgress extends Question {
  solved?: boolean;
  solvedAt?: string;
}

interface QuestionCardProps {
  question: QuestionWithProgress;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const solved = question.solved || false;
  const solvedAt = question.solvedAt;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Link href={`/dsa/questions/${question.id}`}>
                      {question.title}
                    </Link>
                  </h3>
                  {solved && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {truncateText(question.statement, 150)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.level)}`}>
                  {question.level}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{question.categoryName}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{question.createdByName}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
              
              {solved && solvedAt && (
                <div className="text-green-600 text-xs">
                  Solved {formatDate(solvedAt)}
                </div>
              )}
            </div>

            {/* Images indicator */}
            {question.imageUrls && question.imageUrls.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-blue-600">
                <ImageIcon className="h-3 w-3" />
                <span>{question.imageUrls.length} image{question.imageUrls.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="ml-4">
            <Link href={`/dsa/questions/${question.id}`}>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}