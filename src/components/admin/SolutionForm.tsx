// src/components/admin/SolutionForm.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateSolution, useUpdateSolution } from '@/hooks/useSolutions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { YouTubeInput } from '@/components/ui/YouTubeInput';
import { 
  Save, 
  Plus, 
  Trash2, 
  Image, 
  Code, 
  AlertCircle,
  ArrowLeft,
  Video,
  ExternalLink
} from 'lucide-react';
import { SolutionFormData, Solution, CodeSnippet } from '@/types';

interface SolutionFormProps {
  questionId: string;
  questionTitle?: string;
  solution?: Solution; // For editing
  mode: 'create' | 'edit';
}

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
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

    // YouTube link validation will be handled by YouTubeInput component
    
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
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleInputChange = (field: keyof SolutionFormData, value: any) => {
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
              <Textarea
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
            <YouTubeInput
              value={formData.youtubeLink}
              onChange={(url) => handleInputChange('youtubeLink', url)}
              placeholder="https://www.youtube.com/watch?v=..."
              label="YouTube Video URL"
              showPreview={true}
              error={errors.youtubeLink}
            />
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
              <Input
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
              <Image className="h-5 w-5" />
              <span>Images (Optional)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Add Image URL
              </label>
              <div className="flex space-x-2">
                <Input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://example.com/diagram.png"
                  className="flex-1"
                />
                <Button