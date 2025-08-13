// src/components/compiler/InputPanel.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  Copy, 
  Trash2, 
  Upload, 
  Download,
  Settings,
  HelpCircle
} from 'lucide-react';

interface InputPanelProps {
  stdin: string;
  onStdinChange: (stdin: string) => void;
  language: string;
  version: string;
  onVersionChange: (version: string) => void;
  availableVersions: string[];
  isLoadingVersions?: boolean;
}

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 ${className}`}
    {...props}
  />
);

const LANGUAGE_EXAMPLES = {
  javascript: {
    stdin: '5\n3\n8\n1\n9',
    description: 'Enter input line by line'
  },
  python: {
    stdin: 'Alice\n25\nBob\n30',
    description: 'Each line represents one input'
  },
  java: {
    stdin: '10 20\n30 40\n50',
    description: 'Space-separated values on each line'
  },
  cpp: {
    stdin: '5\n1 2 3 4 5',
    description: 'First line: count, second line: values'
  },
  c: {
    stdin: '3\nHello\nWorld\nTest',
    description: 'Number followed by strings'
  },
  go: {
    stdin: '42\ntest string\n3.14',
    description: 'Mixed data types'
  },
  rust: {
    stdin: '5 10\n15 20',
    description: 'Multiple integers per line'
  },
  csharp: {
    stdin: 'John Doe\n25\ntrue',
    description: 'String, number, boolean'
  },
  php: {
    stdin: 'apple\nbanana\ncherry',
    description: 'List of strings'
  },
  ruby: {
    stdin: '1,2,3,4,5\ntest',
    description: 'Comma-separated values'
  }
};

export function InputPanel({
  stdin,
  onStdinChange,
  language,
  version,
  onVersionChange,
  availableVersions,
  isLoadingVersions = false
}: InputPanelProps) {
  const [activeTab, setActiveTab] = useState('stdin');

  const currentExample = LANGUAGE_EXAMPLES[language as keyof typeof LANGUAGE_EXAMPLES] || LANGUAGE_EXAMPLES.javascript;

  const clearInput = () => {
    onStdinChange('');
  };

  const loadExample = () => {
    onStdinChange(currentExample.stdin);
  };

  const copyInput = async () => {
    try {
      await navigator.clipboard.writeText(stdin);
    } catch (err) {
      console.error('Failed to copy input:', err);
    }
  };

  const downloadInput = () => {
    const blob = new Blob([stdin], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `input_${language}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadInput = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onStdinChange(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span>Input & Settings</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadExample}
              title="Load example input"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
            
            {stdin && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyInput}
                  title="Copy input"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadInput}
                  title="Download input"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearInput}
                  title="Clear input"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={uploadInput}
              title="Upload input file"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-80">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stdin" className="flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <span>Input (stdin)</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Input Tab */}
          <TabsContent value="stdin" className="mt-0 h-full">
            <div className="p-4 h-full flex flex-col space-y-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Input (stdin)
                </label>
                <Textarea
                  value={stdin}
                  onChange={(e) => onStdinChange(e.target.value)}
                  placeholder="Enter input for your program..."
                  className="h-full font-mono text-sm resize-none"
                />
              </div>
              
              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 mb-1">Input Help ({language})</p>
                    <p className="text-blue-700">{currentExample.description}</p>
                    <div className="mt-2 bg-blue-100 rounded p-2 font-mono text-xs">
                      Example:<br />
                      <span className="whitespace-pre-line">{currentExample.stdin}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0 h-full">
            <div className="p-4 space-y-4">
              {/* Language Version */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Language Version
                </label>
                <select
                  value={version}
                  onChange={(e) => onVersionChange(e.target.value)}
                  disabled={isLoadingVersions || availableVersions.length === 0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
                >
                  {isLoadingVersions ? (
                    <option>Loading versions...</option>
                  ) : availableVersions.length === 0 ? (
                    <option>No versions available</option>
                  ) : (
                    availableVersions.map((ver) => (
                      <option key={ver} value={ver}>
                        {ver}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500">
                  {isLoadingVersions 
                    ? 'Loading available versions...' 
                    : `${availableVersions.length} version(s) available`
                  }
                </p>
              </div>

              {/* Execution Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Execution Info</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>Language: <span className="font-mono">{language}</span></div>
                  <div>Version: <span className="font-mono">{version}</span></div>
                  <div>Input lines: <span className="font-mono">{stdin.split('\n').length}</span></div>
                  <div>Input chars: <span className="font-mono">{stdin.length}</span></div>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Keyboard Shortcuts</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+Enter</kbd> - Run code</div>
                  <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+S</kbd> - Download code</div>
                  <div><kbd className="bg-blue-200 px-1 rounded">Ctrl+Shift+F</kbd> - Format code</div>
                </div>
              </div>

              {/* Limits & Guidelines */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Limits & Guidelines</h4>
                <div className="space-y-1 text-xs text-yellow-800">
                  <div>• Max execution time: 30 seconds</div>
                  <div>• Max memory usage: 128 MB</div>
                  <div>• Max output size: 64 KB</div>
                  <div>• Network access: Disabled</div>
                  <div>• File system: Read-only</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}