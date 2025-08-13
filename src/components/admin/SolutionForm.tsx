// src/components/admin/SolutionForm.tsx - Complete version

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSolution, useUpdateSolution } from '@/hooks/useSolutions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Code, 
  AlertCircle,
  ArrowLeft,
  Video,
  ExternalLink
} from 'lucide-react';
import { SolutionFormData, Solution, CodeSnippet } from '@/types';
import Image from 'next/image';

interface SolutionFormProps {
  questionId: string;
  questionTitle?: string;
  solution?: Solution; // For editing
  mode: 'create' | 'edit';
}

// Local components to avoid conflicts
const FormInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const FormTextarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const PROGRAMMING_LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'c', 'csharp', 'typescript', 
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'scala'
];

export function SolutionForm({ questionId, questionTitle, solution, mode }: SolutionFormProps) {
  const router = useRouter();
  const createSolution = useCreateSolution();
  const updateSolution = useUpdateSolution();

  const [formData, setFormData] = useState<SolutionFormData>({
    content: solution?.content || '',
    driveLink: solution?.driveLink || '',
    youtubeLink: solution?.youtubeLink || '',
    imageUrls: solution?.imageUrls || [],
    codeSnippet: solution?.codeSnippet || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInput, setImageInput] = useState('');
  const [showCodeSnippet, setShowCodeSnippet] = useState(!!solution?.codeSnippet);
  const [codeSnippet, setCodeSnippet] = useState<CodeSnippet>({
    language: solution?.codeSnippet?.language || 'javascript',
    code: solution?.codeSnippet?.code || '',
    description: solution?.codeSnippet?.description || '',
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = 'Solution explanation is required';
    } else if (formData.content.length < 20) {
      newErrors.content = 'Solution explanation must be at least 20 characters';
    }

    // YouTube link validation
    if (formData.youtubeLink && !formData.youtubeLink.includes('youtube.com') && !formData.youtubeLink.includes('youtu.be')) {
      newErrors.youtubeLink = 'Please enter a valid YouTube URL';
    }
    
    if (formData.driveLink && !formData.driveLink.includes('drive.google.com')) {
      newErrors.driveLink = 'Please enter a valid Google Drive link';
    }

    if (showCodeSnippet && codeSnippet.code.trim() && codeSnippet.code.length < 10) {
      newErrors.codeSnippet = 'Code must be at least 10 characters if provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData: SolutionFormData = {
      ...formData,
      codeSnippet: showCodeSnippet && codeSnippet.code.trim() ? codeSnippet : undefined,
    };

    try {
      if (mode === 'create') {
        await createSolution.mutateAsync({ questionId, data: submitData });
        router.push(`/dsa/questions/${questionId}?tab=solutions`);
      } else if (solution) {
        await updateSolution.mutateAsync({ id: solution.id, data: submitData });
        router.push(`/dsa/questions/${questionId}?tab=solutions`);
      }
    } catch {
      // Error handling is done in the hooks
    }
  };

  const handleInputChange = <K extends keyof SolutionFormData>(
    field: K, 
    value: SolutionFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addImageUrl = () => {
    if (imageInput.trim() && !formData.imageUrls?.includes(imageInput.trim())) {
      handleInputChange('imageUrls', [...(formData.imageUrls || []), imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImageUrl = (index: number) => {
    const newImageUrls = formData.imageUrls?.filter((_, i) => i !== index) || [];
    handleInputChange('imageUrls', newImageUrls);
  };

  const isSubmitting = createSolution.isPending || updateSolution.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Solution' : 'Edit Solution'}
          </h1>
          <p className="text-gray-600 mt-1">
            {questionTitle && `For: ${questionTitle}`}
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Solution Content */}
        <Card>
          <CardHeader>
            <CardTitle>Solution Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Explanation *
              </label>
              <FormTextarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Explain the solution approach, algorithm, time/space complexity, and key insights..."
                rows={8}
                className={errors.content ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.content && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.content}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                {formData.content.length} characters (minimum 20 required)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Video */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-red-500" />
              <span>YouTube Video (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                YouTube Video URL
              </label>
              <FormInput
                value={formData.youtubeLink || ''}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className={errors.youtubeLink ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.youtubeLink && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.youtubeLink}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Add a YouTube video explanation of the solution
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Drive Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5 text-blue-500" />
              <span>Google Drive Link (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Google Drive Document/Folder URL
              </label>
              <FormInput
                value={formData.driveLink || ''}
                onChange={(e) => handleInputChange('driveLink', e.target.value)}
                placeholder="https://drive.google.com/..."
                className={errors.driveLink ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.driveLink && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.driveLink}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                Link to additional resources, detailed explanations, or related documents
              </div>
            </div>

            {formData.driveLink && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Drive Link Preview</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Students will be able to access this Google Drive resource
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5" />
              <span>Images (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Image URL
              </label>
              <div className="flex space-x-2">
                <FormInput
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://example.com/diagram.png"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  disabled={!imageInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Current Images */}
            {formData.imageUrls && formData.imageUrls.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Current Images ({formData.imageUrls.length})
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group border rounded-lg p-2">
                      <Image
                        src={url}
                        alt={`Solution image ${index + 1}`}
                        width={300}
                        height={128}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholder.png';
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImageUrl(index)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        {url}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Code Snippet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Code Solution (Optional)</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                className="flex items-center space-x-2"
              >
                {showCodeSnippet ? <Trash2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                <span>{showCodeSnippet ? 'Remove Code' : 'Add Code'}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          {showCodeSnippet && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Programming Language
                  </label>
                  <select
                    value={codeSnippet.language}
                    onChange={(e) => setCodeSnippet(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <FormInput
                    value={codeSnippet.description}
                    onChange={(e) => setCodeSnippet(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Optimal solution using two pointers"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Code Solution
                </label>
                <FormTextarea
                  value={codeSnippet.code}
                  onChange={(e) => setCodeSnippet(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Enter your code solution here..."
                  rows={12}
                  className={`font-mono text-sm ${errors.codeSnippet ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.codeSnippet && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.codeSnippet}</span>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-600">
            * Required fields
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>
                {isSubmitting 
                  ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                  : (mode === 'create' ? 'Create Solution' : 'Update Solution')
                }
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}