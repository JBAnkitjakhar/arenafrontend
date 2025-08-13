// src/components/dsa/QuestionContent.tsx

'use client';

import { Question, QuestionLevel } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Tag, User, Calendar, ImageIcon, Code } from 'lucide-react';
import Image from 'next/image';

interface QuestionContentProps {
  question: Question;
}

// Simple Badge component
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export function QuestionContent({ question }: QuestionContentProps) {
  const difficultyColors = {
    [QuestionLevel.EASY]: 'bg-green-100 text-green-800',
    [QuestionLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [QuestionLevel.HARD]: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Title and Level */}
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900 pr-4">
                {question.title}
              </h1>
              <Badge className={difficultyColors[question.level]}>
                {question.level}
              </Badge>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>{question.categoryName}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>Created by {question.createdByName}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(question.createdAt).toLocaleDateString()}</span>
              </div>

              {question.imageUrls && question.imageUrls.length > 0 && (
                <div className="flex items-center space-x-1">
                  <ImageIcon className="h-4 w-4" />
                  <span>{question.imageUrls.length} image{question.imageUrls.length !== 1 ? 's' : ''}</span>
                </div>
              )}

              {question.codeSnippets && question.codeSnippets.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Code className="h-4 w-4" />
                  <span>{question.codeSnippets.length} code snippet{question.codeSnippets.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Statement */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Problem Statement</h2>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: question.statement.replace(/\n/g, '<br/>') 
                }} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Images */}
      {question.imageUrls && question.imageUrls.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Visual Examples ({question.imageUrls.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {question.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={`Question example ${index + 1}`}
                        fill
                        className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(imageUrl, '_blank')}
                        unoptimized // For external images
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors rounded-lg"></div>
                    
                    {/* Image overlay info */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      Example {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Snippets */}
      {question.codeSnippets && question.codeSnippets.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Code Templates ({question.codeSnippets.length})
                </h2>
              </div>
              
              <div className="space-y-4">
                {question.codeSnippets.map((snippet, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {snippet.language} Template
                      </h3>
                      <Badge className="bg-gray-100 text-gray-800">
                        {snippet.language}
                      </Badge>
                    </div>
                    
                    {snippet.description && (
                      <p className="text-sm text-gray-600">
                        {snippet.description}
                      </p>
                    )}
                    
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backward compatibility for imageFolderUrl */}
      {question.imageFolderUrl && !question.imageUrls && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Additional Resources</h2>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Additional resources are available for this question. 
                  <a 
                    href={question.imageFolderUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 underline hover:no-underline"
                  >
                    View resources →
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}