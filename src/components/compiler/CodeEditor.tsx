// src/components/compiler/CodeEditor.tsx

'use client';

import { useRef } from 'react';
import { Editor, OnChange, OnMount } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Download, 
  Upload, 
  RotateCcw, 
  Settings,
  Maximize2,
  Copy,
  FileText
} from 'lucide-react';

// Monaco Editor types
interface MonacoEditor {
  updateOptions: (options: Record<string, unknown>) => void;
  addCommand: (keybinding: number, handler: () => void) => void;
  getAction: (actionId: string) => { run: () => void };
  getContainerDomNode: () => HTMLElement;
}

interface Monaco {
  KeyMod: {
    CtrlCmd: number;
  };
  KeyCode: {
    Enter: number;
    KeyS: number;
  };
}

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  isExecuting?: boolean;
  onExecute: () => void;
  onLanguageChange: (language: string) => void;
  supportedLanguages: string[];
  theme?: 'vs-dark' | 'light' | 'vs';
}

const LANGUAGE_CONFIGS = {
  javascript: {
    label: 'JavaScript',
    extension: '.js',
    defaultCode: 'console.log("Hello, World!");',
    monacoLanguage: 'javascript'
  },
  python: {
    label: 'Python',
    extension: '.py', 
    defaultCode: 'print("Hello, World!")',
    monacoLanguage: 'python'
  },
  java: {
    label: 'Java',
    extension: '.java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    monacoLanguage: 'java'
  },
  cpp: {
    label: 'C++',
    extension: '.cpp',
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
    monacoLanguage: 'cpp'
  },
  c: {
    label: 'C',
    extension: '.c',
    defaultCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
    monacoLanguage: 'c'
  },
  typescript: {
    label: 'TypeScript',
    extension: '.ts',
    defaultCode: 'console.log("Hello, World!");',
    monacoLanguage: 'typescript'
  },
  go: {
    label: 'Go',
    extension: '.go',
    defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    monacoLanguage: 'go'
  },
  rust: {
    label: 'Rust',
    extension: '.rs',
    defaultCode: `fn main() {
    println!("Hello, World!");
}`,
    monacoLanguage: 'rust'
  },
  csharp: {
    label: 'C#',
    extension: '.cs',
    defaultCode: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`,
    monacoLanguage: 'csharp'
  },
  php: {
    label: 'PHP',
    extension: '.php',
    defaultCode: '<?php\necho "Hello, World!\\n";\n?>',
    monacoLanguage: 'php'
  },
  ruby: {
    label: 'Ruby',
    extension: '.rb',
    defaultCode: 'puts "Hello, World!"',
    monacoLanguage: 'ruby'
  },
  kotlin: {
    label: 'Kotlin',
    extension: '.kt',
    defaultCode: `fun main() {
    println("Hello, World!")
}`,
    monacoLanguage: 'kotlin'
  }
} as const;

export function CodeEditor({
  language,
  value,
  onChange,
  isExecuting = false,
  onExecute,
  onLanguageChange,
  supportedLanguages,
  theme = 'vs-dark'
}: CodeEditorProps) {
  const editorRef = useRef<MonacoEditor | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLanguageConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS] || LANGUAGE_CONFIGS.javascript;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Type assertion to our custom interface
    editorRef.current = editor as MonacoEditor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 20,
      wordWrap: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true }
    });

    // Add keyboard shortcuts with proper typing
    const monacoTyped = monaco as Monaco;
    
    editor.addCommand(monacoTyped.KeyMod.CtrlCmd | monacoTyped.KeyCode.Enter, () => {
      if (!isExecuting) {
        onExecute();
      }
    });

    editor.addCommand(monacoTyped.KeyMod.CtrlCmd | monacoTyped.KeyCode.KeyS, () => {
      // Prevent default browser save behavior
      downloadCode();
    });
  };

  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const resetCode = () => {
    onChange(currentLanguageConfig.defaultCode);
  };

  const downloadCode = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code${currentLanguageConfig.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uploadCode = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
    // Reset the input
    event.target.value = '';
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const toggleFullscreen = () => {
    if (editorRef.current) {
      const container = editorRef.current.getContainerDomNode().closest('.code-editor-container');
      if (container) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          container.requestFullscreen();
        }
      }
    }
  };

  return (
    <Card className="code-editor-container h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Code Editor</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {supportedLanguages.map((lang) => {
                const config = LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS];
                return (
                  <option key={lang} value={lang}>
                    {config?.label || lang}
                  </option>
                );
              })}
            </select>

            {/* Toolbar Buttons */}
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="sm"
                onClick={resetCode}
                title="Reset to default code"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={copyCode}
                title="Copy code"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={uploadCode}
                title="Upload code file"
              >
                <Upload className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCode}
                title="Download code"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={formatCode}
                title="Format code (Ctrl+Shift+F)"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                title="Toggle fullscreen"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Execute Button */}
            <Button
              onClick={onExecute}
              disabled={isExecuting || !value.trim()}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4" />
              <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-96">
        <div className="relative h-full">
          <Editor
            height="100%"
            defaultLanguage={currentLanguageConfig.monacoLanguage}
            language={currentLanguageConfig.monacoLanguage}
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              selectOnLineNumbers: true,
              roundedSelection: false,
              readOnly: false,
              cursorStyle: 'line',
              automaticLayout: true,
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'all',
              renderValidationDecorations: 'on',
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
              }
            }}
          />
          
          {/* Loading Overlay */}
          {isExecuting && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
              <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="text-gray-900">Executing code...</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.py,.java,.cpp,.c,.ts,.go,.rs,.cs,.php,.rb,.kt"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
    </Card>
  );
}