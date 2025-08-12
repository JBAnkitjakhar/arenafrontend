// src/components/dsa/QuestionContent.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { Image, Code, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionContentProps {
  question: Question;
}

export function QuestionContent({ question }: QuestionContentProps) {
  const [showImages, setShowImages] = useState(false);
  const [expandedCodeSnippet, setExpandedCodeSnippet] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Problem Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {question.statement}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Section */}
      {question.imageUrls && question.imageUrls.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Images ({question.imageUrls.length})</span>
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImages(!showImages)}
              >
                {showImages ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showImages && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {question.imageUrls.map((imageUrl, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Question image ${index + 1}`}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => {
                        // Open image in new tab
                        window.open(imageUrl, '_blank');
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Code Snippets */}
      {question.codeSnippets && question.codeSnippets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Code Examples</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.codeSnippets.map((snippet, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex items-center justify-between p-3 bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedCodeSnippet(
                    expandedCodeSnippet === index ? null : index
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">
                      {snippet.language}
                    </span>
                    {snippet.description && (
                      <span className="text-sm text-gray-500">
                        - {snippet.description}
                      </span>
                    )}
                  </div>
                  {expandedCodeSnippet === index ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                
                {expandedCodeSnippet === index && (
                  <div className="p-0">
                    <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Backward compatibility for old imageFolderUrl */}
      {question.imageFolderUrl && (!question.imageUrls || question.imageUrls.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="h-5 w-5" />
              <span>Additional Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={question.imageFolderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View images and diagrams
            </a>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-2 text-gray-600">{question.categoryName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Difficulty:</span>
              <span className="ml-2 text-gray-600">{question.level}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created by:</span>
              <span className="ml-2 text-gray-600">{question.createdByName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {new Date(question.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}