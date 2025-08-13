
// src/components/dsa/ApproachesList.tsx

'use client';

import { useState } from 'react';
import { Approach } from '@/types';
import { useDeleteApproach } from '@/hooks/useApproaches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronUp, 
  Code, 
  FileText, 
  Trash2,
  Edit,
  Calendar,
  Eye
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ApproachesListProps {
  questionId: string;
  approaches: Approach[];
}

export function ApproachesList({ questionId, approaches }: ApproachesListProps) {
  const [expandedApproach, setExpandedApproach] = useState<string | null>(null);
  const deleteApproach = useDeleteApproach();

  const toggleApproach = (approachId: string) => {
    setExpandedApproach(expandedApproach === approachId ? null : approachId);
  };

  const handleDelete = (approachId: string) => {
    if (confirm('Are you sure you want to delete this approach?')) {
      deleteApproach.mutate(approachId);
    }
  };

  if (approaches.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Approaches Yet</h3>
          <p className="text-gray-600 mb-4">
            You haven't added any approaches for this question yet. Start by adding your first approach!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          My Approaches ({approaches.length})
        </h3>
      </div>

      {/* Approaches */}
      {approaches.map((approach, index) => (
        <Card key={approach.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <span>Approach {index + 1}</span>
                
                {/* Indicators */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {approach.codeContent && (
                    <span className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      <Code className="h-3 w-3" />
                      <span>{approach.codeLanguage}</span>
                    </span>
                  )}
                  
                  <span className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <FileText className="h-3 w-3" />
                    <span>{approach.contentSize} chars</span>
                  </span>
                </div>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleApproach(approach.id)}
                >
                  {expandedApproach === approach.id ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(approach.id)}
                  disabled={deleteApproach.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Meta info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(approach.createdAt), { addSuffix: true })}</span>
              </div>
              
              {approach.updatedAt !== approach.createdAt && (
                <span className="text-gray-500">
                  (edited {formatDistanceToNow(new Date(approach.updatedAt), { addSuffix: true })})
                </span>
              )}
            </div>
          </CardHeader>

          {/* Expanded content */}
          {expandedApproach === approach.id && (
            <CardContent className="border-t bg-gray-50 space-y-6">
              
              {/* Text Content */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">My Approach</h4>
                <div className="prose prose-sm max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: approach.textContent.replace(/\n/g, '<br/>') 
                    }} 
                  />
                </div>
              </div>

              {/* Code Content */}
              {approach.codeContent && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Code ({approach.codeLanguage})
                  </h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">
                      <code>{approach.codeContent}</code>
                    </pre>
                  </div>
                </div>
              )}

            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}