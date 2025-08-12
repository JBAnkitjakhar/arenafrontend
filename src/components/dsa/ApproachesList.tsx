// src/components/dsa/ApproachesList.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeleteApproach, useApproachSizeUsage } from '@/hooks/useApproaches';
import { Approach } from '@/types';
import { 
  Code, 
  Edit, 
  Trash2, 
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { formatDate, formatContentSize } from '@/lib/utils';

interface ApproachesListProps {
  questionId: string;
  approaches: Approach[];
}

export function ApproachesList({ questionId, approaches }: ApproachesListProps) {
  const [expandedApproach, setExpandedApproach] = useState<string | null>(null);
  const [editingApproach, setEditingApproach] = useState<string | null>(null);
  
  const deleteApproach = useDeleteApproach();
  const { data: sizeUsage } = useApproachSizeUsage(questionId);

  const toggleApproach = (approachId: string) => {
    setExpandedApproach(expandedApproach === approachId ? null : approachId);
  };

  const handleDelete = (approachId: string) => {
    if (window.confirm('Are you sure you want to delete this approach?')) {
      deleteApproach.mutate(approachId);
    }
  };

  if (approaches.length === 0) {
    return (
      <div className="space-y-4">
        {/* Size Usage Display */}
        {sizeUsage && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Storage Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Used: {formatContentSize(sizeUsage.totalUsed)}</span>
                  <span>Remaining: {formatContentSize(sizeUsage.remaining)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      sizeUsage.usagePercentage > 80 
                        ? 'bg-red-500' 
                        : sizeUsage.usagePercentage > 60 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, sizeUsage.usagePercentage)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  {sizeUsage.approachCount} / {sizeUsage.maxApproaches} approaches • {sizeUsage.usagePercentage.toFixed(1)}% of {formatContentSize(sizeUsage.maxAllowed)} used
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No approaches yet</h3>
            <p className="text-gray-600">
              Start by adding your approach to this question. Share your thinking process and solution!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Size Usage Display */}
      {sizeUsage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center space-x-2">
              <span>Storage Usage</span>
              {sizeUsage.usagePercentage > 80 && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {formatContentSize(sizeUsage.totalUsed)}</span>
                <span>Remaining: {formatContentSize(sizeUsage.remaining)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    sizeUsage.usagePercentage > 80 
                      ? 'bg-red-500' 
                      : sizeUsage.usagePercentage > 60 
                        ? 'bg-yellow-500' 
                        : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, sizeUsage.usagePercentage)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                {sizeUsage.approachCount} / {sizeUsage.maxApproaches} approaches • {sizeUsage.usagePercentage.toFixed(1)}% of {formatContentSize(sizeUsage.maxAllowed)} used
              </div>
              {sizeUsage.usagePercentage > 80 && (
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                  ⚠️ You're approaching the 15KB limit. Consider shortening your approaches.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
              <CardTitle className="flex items-center space-x-2">
                <span>Approach {index + 1}</span>
                <span className="text-sm text-gray-500">
                  ({formatContentSize(approach.contentSize)})
                </span>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingApproach(approach.id)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(approach.id)}
                  disabled={deleteApproach.isPending}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                
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
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Created {formatDate(approach.createdAt)}
              {approach.updatedAt !== approach.createdAt && (
                <span> • Updated {formatDate(approach.updatedAt)}</span>
              )}
            </div>
          </CardHeader>

          {expandedApproach === approach.id && (
            <CardContent className="space-y-4">
              {/* Text Content */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Explanation</h4>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {approach.textContent}
                  </div>
                </div>
              </div>

              {/* Code Content */}
              {approach.codeContent && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <Code className="h-4 w-4" />
                    <span>Code ({approach.codeLanguage})</span>
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
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