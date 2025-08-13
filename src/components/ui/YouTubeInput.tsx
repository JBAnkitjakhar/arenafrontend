// src/components/ui/YouTubeInput.tsx

'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { YouTubeThumbnail } from '@/components/ui/YouTubeEmbed';
import { isValidYouTubeUrl, extractYouTubeVideoId, getYouTubeThumbnail } from '@/lib/youtube-utils';
import { Play, ExternalLink, AlertCircle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeInputProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function YouTubeInput({
  value = '',
  onChange,
  placeholder = 'https://www.youtube.com/watch?v=...',
  label = 'YouTube Video URL',
  error,
  required = false,
  showPreview = true,
  className
}: YouTubeInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'idle'>('idle');
  const [videoId, setVideoId] = useState<string | null>(null);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        validateUrl(inputValue);
      } else {
        setValidationStatus('idle');
        setVideoId(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Update internal state when external value changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const validateUrl = async (url: string) => {
    setIsValidating(true);
    
    try {
      const isValid = isValidYouTubeUrl(url);
      const extractedVideoId = extractYouTubeVideoId(url);
      
      if (isValid && extractedVideoId) {
        setValidationStatus('valid');
        setVideoId(extractedVideoId);
        onChange(url); // Only call onChange for valid URLs
      } else {
        setValidationStatus('invalid');
        setVideoId(null);
        // Don't call onChange for invalid URLs
      }
    } catch (error) {
      setValidationStatus('invalid');
      setVideoId(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear validation status immediately on change
    setValidationStatus('idle');
    setVideoId(null);
  };

  const handleClear = () => {
    setInputValue('');
    setValidationStatus('idle');
    setVideoId(null);
    onChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    
    switch (validationStatus) {
      case 'valid':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'invalid':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getValidationMessage = () => {
    switch (validationStatus) {
      case 'valid':
        return <span className="text-green-600 text-sm">Valid YouTube URL</span>;
      case 'invalid':
        return <span className="text-red-600 text-sm">Please enter a valid YouTube URL</span>;
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input with validation */}
      <div className="relative">
        <Input
          type="url"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={cn(
            'pr-20',
            validationStatus === 'valid' && 'border-green-500 focus:ring-green-500',
            validationStatus === 'invalid' && 'border-red-500 focus:ring-red-500',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />
        
        {/* Validation icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {getValidationIcon()}
          
          {/* Clear button */}
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Validation message */}
      <div className="min-h-[20px]">
        {getValidationMessage()}
        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Helper buttons */}
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePaste}
          className="text-xs"
        >
          Paste from Clipboard
        </Button>
        
        {validationStatus === 'valid' && videoId && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
            className="text-xs flex items-center space-x-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Preview</span>
          </Button>
        )}
      </div>

      {/* Video Preview */}
      {showPreview && validationStatus === 'valid' && videoId && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Video Preview</h4>
          <div className="flex items-start space-x-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              <YouTubeThumbnail
                url={inputValue}
                className="w-32 h-18"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
              />
            </div>
            
            {/* Video info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Video ID:</span>
                  <code className="text-xs bg-gray-200 px-2 py-1 rounded">{videoId}</code>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-700">Platform:</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">YouTube</span>
                </div>
                <div className="text-xs text-gray-500 pt-2">
                  This video will be embedded in the solution for students to watch.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Format examples */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="font-medium">Supported YouTube URL formats:</div>
        <div className="space-y-1 pl-2">
          <div>• https://www.youtube.com/watch?v=VIDEO_ID</div>
          <div>• https://youtu.be/VIDEO_ID</div>
          <div>• https://www.youtube.com/embed/VIDEO_ID</div>
        </div>
      </div>
    </div>
  );
}