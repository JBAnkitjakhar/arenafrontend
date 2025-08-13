// src/components/admin/QuestionForm.tsx - Fixed version

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { useCreateQuestion, useUpdateQuestion } from '@/hooks/useQuestions';
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
} from 'lucide-react';
import { QuestionFormData, QuestionLevel, Question, CodeSnippet } from '@/types';
import Image from 'next/image';

interface QuestionFormProps {
  question?: Question; // For editing
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

export function QuestionForm({ question, mode }: QuestionFormProps) {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createQuestion = useCreateQuestion();
  const updateQuestion = useUpdateQuestion();

  const [formData, setFormData] = useState<QuestionFormData>({
    title: question?.title || '',
    statement: question?.statement || '',
    categoryId: question?.categoryId || '',
    level: question?.level || QuestionLevel.EASY,
    imageUrls: question?.imageUrls || [],
    codeSnippets: question?.codeSnippets || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInput, setImageInput] = useState('');
  const [showCodeSnippetForm, setShowCodeSnippetForm] = useState(false);
  const [currentCodeSnippet, setCurrentCodeSnippet] = useState<CodeSnippet>({
    language: 'javascript',
    code: '',
    description: '',
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.statement.trim()) {
      newErrors.statement = 'Problem statement is required';
    } else if (formData.statement.length < 50) {
      newErrors.statement = 'Problem statement must be at least 50 characters';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'create') {
        await createQuestion.mutateAsync(formData);
        router.push('/admin/questions');
      } else if (question) {
        await updateQuestion.mutateAsync({ questionId: question.id, data: formData });
        router.push(`/dsa/questions/${question.id}`);
      }
    } catch {
      // Error handling is done in the hooks
    }
  };

  const handleInputChange = <K extends keyof QuestionFormData>(
    field: K, 
    value: QuestionFormData[K]
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

  const addCodeSnippet = () => {
    if (currentCodeSnippet.code.trim()) {
      const newSnippets = [...(formData.codeSnippets || []), currentCodeSnippet];
      handleInputChange('codeSnippets', newSnippets);
      setCurrentCodeSnippet({ language: 'javascript', code: '', description: '' });
      setShowCodeSnippetForm(false);
    }
  };

  const removeCodeSnippet = (index: number) => {
    const newSnippets = formData.codeSnippets?.filter((_, i) => i !== index) || [];
    handleInputChange('codeSnippets', newSnippets);
  };

  const isSubmitting = createQuestion.isPending || updateQuestion.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'create' ? 'Create Question' : 'Edit Question'}
          </h1>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Add a new coding problem to the platform' 
              : 'Update the question details'
            }
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
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Question Title *
              </label>
              <FormInput
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Two Sum Problem"
                className={errors.title ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.title && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="flex items-center space-x-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.categoryId}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty Level *
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => handleInputChange('level', e.target.value as QuestionLevel)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={QuestionLevel.EASY}>Easy</option>
                  <option value={QuestionLevel.MEDIUM}>Medium</option>
                  <option value={QuestionLevel.HARD}>Hard</option>
                </select>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Problem Statement *
              </label>
              <FormTextarea
                value={formData.statement}
                onChange={(e) => handleInputChange('statement', e.target.value)}
                placeholder="Describe the problem clearly with examples, constraints, and expected output..."
                rows={8}
                className={errors.statement ? 'border-red-500 focus:ring-red-500' : ''}
              />
              {errors.statement && (
                <div className="flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.statement}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                {formData.statement.length} characters (minimum 50 required)
              </div>
            </div>
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
                  placeholder="https://example.com/image.png"
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
                        alt={`Question image ${index + 1}`}
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

        {/* Code Snippets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Code Templates (Optional)</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCodeSnippetForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Code Template</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Code Snippet Form */}
            {showCodeSnippetForm && (
              <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Add Code Template</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCodeSnippetForm(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      value={currentCodeSnippet.language}
                      onChange={(e) => setCurrentCodeSnippet(prev => ({ ...prev, language: e.target.value }))}
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
                      value={currentCodeSnippet.description}
                      onChange={(e) => setCurrentCodeSnippet(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="e.g., Function template"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Code Template
                  </label>
                  <FormTextarea
                    value={currentCodeSnippet.code}
                    onChange={(e) => setCurrentCodeSnippet(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="Enter the code template..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCodeSnippetForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={addCodeSnippet}
                    disabled={!currentCodeSnippet.code.trim()}
                  >
                    Add Template
                  </Button>
                </div>
              </div>
            )}

            {/* Current Code Snippets */}
            {formData.codeSnippets && formData.codeSnippets.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Current Templates ({formData.codeSnippets.length})
                </label>
                {formData.codeSnippets.map((snippet, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {snippet.language.charAt(0).toUpperCase() + snippet.language.slice(1)} Template
                        </span>
                        {snippet.description && (
                          <span className="text-sm text-gray-600">
                            - {snippet.description}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCodeSnippet(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded text-sm font-mono overflow-x-auto">
                      <pre>{snippet.code}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
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
                  : (mode === 'create' ? 'Create Question' : 'Update Question')
                }
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}