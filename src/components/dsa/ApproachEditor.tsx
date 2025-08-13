// src/components/dsa/ApproachEditor.tsx

'use client';

import { useState } from 'react';
import { useCreateApproach } from '@/hooks/useApproaches';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Code, 
  FileText, 
  AlertCircle,
  EyeOff
} from 'lucide-react';
import { ApproachFormData } from '@/types';

interface ApproachEditorProps {
  questionId: string;
  onSuccess?: () => void;
}

// Simple components if missing
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const PROGRAMMING_LANGUAGES = [
  'javascript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'typescript',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'scala',
  'other'
];

export function ApproachEditor({ questionId, onSuccess }: ApproachEditorProps) {
  const [formData, setFormData] = useState<ApproachFormData>({
    textContent: '',
    codeContent: '',
    codeLanguage: 'javascript',
  });
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createApproach = useCreateApproach();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.textContent.trim()) {
      newErrors.textContent = 'Please describe your approach';
    } else if (formData.textContent.trim().length < 20) {
      newErrors.textContent = 'Approach description must be at least 20 characters';
    }

    if (showCodeEditor && formData.codeContent) {
      if (formData.codeContent.trim().length < 10) {
        newErrors.codeContent = 'Code must be at least 10 characters if provided';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData: ApproachFormData = {
      textContent: formData.textContent.trim(),
      codeLanguage: formData.codeLanguage,
    };

    // Only include code if it's provided and not empty
    if (showCodeEditor && formData.codeContent && formData.codeContent.trim()) {
      submitData.codeContent = formData.codeContent.trim();
    }

    try {
      await createApproach.mutateAsync({ questionId, data: submitData });
      
      // Reset form
      setFormData({
        textContent: '',
        codeContent: '',
        codeLanguage: 'javascript',
      });
      setShowCodeEditor(false);
      setErrors({});
      
      onSuccess?.();
    } catch (error) {
      console.error(error);
      // Error handling is done in the hook
    }
  };

  const handleInputChange = (field: keyof ApproachFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Add Your Approach</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Text Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Describe Your Approach *
            </label>
            <Textarea
              value={formData.textContent}
              onChange={(e) => handleInputChange('textContent', e.target.value)}
              placeholder="Explain your approach, thought process, time/space complexity, edge cases, etc..."
              rows={6}
              className={errors.textContent ? 'border-red-500 focus:ring-red-500' : ''}
            />
            {errors.textContent && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.textContent}</span>
              </div>
            )}
            <div className="text-xs text-gray-500">
              {formData.textContent.length} characters (minimum 20 required)
            </div>
          </div>

          {/* Code Section Toggle */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Include Code Implementation (Optional)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCodeEditor(!showCodeEditor)}
                className="flex items-center space-x-2"
              >
                {showCodeEditor ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span>Hide Code</span>
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" />
                    <span>Add Code</span>
                  </>
                )}
              </Button>
            </div>

            {showCodeEditor && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Programming Language
                  </label>
                  <select
                    value={formData.codeLanguage}
                    onChange={(e) => handleInputChange('codeLanguage', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Code Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Code Implementation
                  </label>
                  <Textarea
                    value={formData.codeContent}
                    onChange={(e) => handleInputChange('codeContent', e.target.value)}
                    placeholder="Paste your code implementation here..."
                    rows={12}
                    className={`font-mono text-sm ${errors.codeContent ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.codeContent && (
                    <div className="flex items-center space-x-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{errors.codeContent}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {formData.codeContent?.length || 0} characters
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Share your unique approach and help others learn!
            </div>
            <Button
              type="submit"
              disabled={createApproach.isPending || !formData.textContent.trim()}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>
                {createApproach.isPending ? 'Saving...' : 'Save Approach'}
              </span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}