// src/components/dsa/SolutionsList.tsx
// we will match that file later becuase new file is not matching completely

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Solution } from '@/types';
import { 
  Code, 
  ExternalLink, 
  Image, 
  Play, 
  Plus,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface SolutionsListProps {
  questionId: string;
  solutions: Solution[];
  isAdmin: boolean;
}

export function SolutionsList({ questionId, solutions, isAdmin }: SolutionsListProps) {
  const [expandedSolution, setExpandedSolution] = useState<string | null>(null);
  const [showImages, setShowImages] = useState<Record<string, boolean>>({});
  const [showVisualizers, setShowVisualizers] = useState<Record<string, boolean>>({});

  const toggleSolution = (solutionId: string) => {
    setExpandedSolution(expandedSolution === solutionId ? null : solutionId);
  };

  const toggleImages = (solutionId: string) => {
    setShowImages(prev => ({
      ...prev,
      [solutionId]: !prev[solutionId]
    }));
  };

  const toggleVisualizers = (solutionId: string) => {
    setShowVisualizers(prev => ({
      ...prev,
      [solutionId]: !prev[solutionId]
    }));
  };

  if (solutions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No solutions yet</h3>
          <p className="text-gray-600 mb-4">
            Solutions for this question haven't been added yet.
          </p>
          {isAdmin && (
            <Link href={`/admin/questions/${questionId}/solutions/create`}>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Solution
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Solutions ({solutions.length})
        </h3>
        {isAdmin && (
          <Link href={`/admin/questions/${questionId}/solutions/create`}>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Solution
            </Button>
          </Link>
        )}
      </div>

      {/* Solutions */}
      {solutions.map((solution, index) => (
        <Card key={solution.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <span>Solution {index + 1}</span>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {solution.imageUrls && solution.imageUrls.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <Image className="h-4 w-4" />
                      <span>{solution.imageUrls.length}</span>
                    </span>
                  )}
                  {solution.visualizerFileIds && solution.visualizerFileIds.length > 0 && (
                    <span className="flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>{solution.visualizerFileIds.length}</span>
                    </span>
                  )}
                </div>
              </CardTitle>
              
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <Link href={`/admin/solutions/${solution.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSolution(solution.id)}
                >
                  {expandedSolution === solution.id ? (
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
              By {solution.createdByName} • {formatDate(solution.createdAt)}
            </div>
          </CardHeader>

          {expandedSolution === solution.id && (
            <CardContent className="space-y-6">
              {/* Content */}
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {solution.content}
                </div>
              </div>

              {/* Drive Link */}
              {solution.driveLink && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Additional Resources</span>
                  </div>
                  <a
                    href={solution.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    View additional materials and diagrams
                  </a>
                </div>
              )}

              {/* Images */}
              {solution.imageUrls && solution.imageUrls.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Image className="h-4 w-4" />
                      <span>Images ({solution.imageUrls.length})</span>
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleImages(solution.id)}
                    >
                      {showImages[solution.id] ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  
                  {showImages[solution.id] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {solution.imageUrls.map((imageUrl, imgIndex) => (
                        <div key={imgIndex} className="border rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Solution image ${imgIndex + 1}`}
                            className="w-full h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* HTML Visualizers */}
              {solution.visualizerFileIds && solution.visualizerFileIds.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Play className="h-4 w-4" />
                      <span>Interactive Visualizers ({solution.visualizerFileIds.length})</span>
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleVisualizers(solution.id)}
                    >
                      {showVisualizers[solution.id] ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  
                  {showVisualizers[solution.id] && (
                    <div className="space-y-4">
                      {solution.visualizerFileIds.map((fileId, vizIndex) => (
                        <div key={fileId} className="border rounded-lg overflow-hidden">
                          <div className="p-3 bg-gray-50 border-b">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                Visualizer {vizIndex + 1}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => {
                                  // Open visualizer in new tab
                                  window.open(`/api/visualizers/${fileId}`, '_blank');
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open
                              </Button>
                            </div>
                          </div>
                          
                          {/* Iframe for visualizer preview */}
                          <div className="h-96 bg-white">
                            <iframe
                              src={`/api/visualizers/${fileId}`}
                              className="w-full h-full border-0"
                              title={`Visualizer ${vizIndex + 1}`}
                              sandbox="allow-scripts allow-same-origin"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Code Snippet */}
              {solution.codeSnippet && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                    <Code className="h-4 w-4" />
                    <span>Code Example</span>
                  </h4>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                      <span className="text-sm font-medium text-gray-700">
                        {solution.codeSnippet.language}
                      </span>
                      {solution.codeSnippet.description && (
                        <span className="text-sm text-gray-500">
                          {solution.codeSnippet.description}
                        </span>
                      )}
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
                      <code>{solution.codeSnippet.code}</code>
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