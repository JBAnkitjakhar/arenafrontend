// src/app/compiler/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useCompilerState, useRuntimes, useLanguages, useExecuteCode, useCompilerActions, useLanguageVersions, useCodeTemplates, useCompilerHealth } from '@/hooks/useCompiler';
import { CodeEditor } from '@/components/compiler/CodeEditor';
import { OutputPanel } from '@/components/compiler/OutputPanel';
import { InputPanel } from '@/components/compiler/InputPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Code, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Settings,
  Monitor,
  Cpu,
  Activity
} from 'lucide-react';
import { ExecutionRequest } from '@/types';

export default function CompilerPage() {
  const compilerState = useCompilerState();
  const { data: runtimes, isLoading: isLoadingRuntimes } = useRuntimes();
  const { data: languages } = useLanguages();
  const { data: health } = useCompilerHealth();
  const executeCode = useExecuteCode();
  const compilerActions = useCompilerActions();
  const { versions, defaultVersion } = useLanguageVersions(compilerState.language);
  const { loadTemplate } = useCodeTemplates();
  
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize compiler with default values
  useEffect(() => {
    if (!isInitialized && languages && languages.length > 0) {
      // Set default language if not set
      if (!compilerState.language) {
        const defaultLang = languages.includes('javascript') ? 'javascript' : languages[0];
        compilerActions.changeLanguage(defaultLang);
        loadTemplate(defaultLang);
      }
      setIsInitialized(true);
    }
  }, [languages, isInitialized, compilerState.language, compilerActions, loadTemplate]);

  // Update version when language changes
  useEffect(() => {
    if (defaultVersion && defaultVersion !== compilerState.version) {
      compilerActions.changeVersion(defaultVersion);
    }
  }, [defaultVersion, compilerState.version, compilerActions]);

  const handleExecuteCode = () => {
    if (!compilerState.code.trim()) {
      return;
    }

    const request: ExecutionRequest = {
      language: compilerState.language,
      version: compilerState.version,
      code: compilerState.code,
      stdin: compilerState.stdin || undefined,
    };

    executeCode.mutate(request);
  };

  const handleLanguageChange = (newLanguage: string) => {
    compilerActions.changeLanguage(newLanguage);
    loadTemplate(newLanguage);
  };

  const downloadCode = () => {
    const blob = new Blob([compilerState.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${compilerState.language === 'cpp' ? 'cpp' : compilerState.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isHealthy = health?.status === 'success';
  const supportedLanguages = languages || ['javascript', 'python', 'java'];

  if (isLoadingRuntimes) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading compiler environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600" />
            <span>Code Compiler</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Write, test, and debug your code in multiple programming languages
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Health Status */}
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isHealthy 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isHealthy ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <span>{isHealthy ? 'Online' : 'Offline'}</span>
          </div>
          
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Monitor className="h-4 w-4" />
              <span>{supportedLanguages.length} languages</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>{compilerState.history.length} executions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Alert */}
      {!isHealthy && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            The compiler service is currently unavailable. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{supportedLanguages.length}</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{compilerState.history.length}</div>
                <div className="text-sm text-gray-600">Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{compilerState.code.length}</div>
                <div className="text-sm text-gray-600">Characters</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{compilerState.language}</div>
                <div className="text-sm text-gray-600">Current Language</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Code Editor - Takes 2/3 of the width */}
        <div className="lg:col-span-2">
          <CodeEditor
            language={compilerState.language}
            value={compilerState.code}
            onChange={compilerActions.updateCode}
            isExecuting={compilerState.isExecuting}
            onExecute={handleExecuteCode}
            onLanguageChange={handleLanguageChange}
            supportedLanguages={supportedLanguages}
            theme="vs-dark"
          />
        </div>

        {/* Right Panel - Input and Output */}
        <div className="space-y-4">
          {/* Input Panel */}
          <div className="h-64">
            <InputPanel
              stdin={compilerState.stdin}
              onStdinChange={compilerActions.updateStdin}
              language={compilerState.language}
              version={compilerState.version}
              onVersionChange={compilerActions.changeVersion}
              availableVersions={versions}
              isLoadingVersions={isLoadingRuntimes}
            />
          </div>
          
          {/* Output Panel */}
          <div className="h-80">
            <OutputPanel
              output={compilerState.output}
              error={compilerState.error}
              isExecuting={compilerState.isExecuting}
              history={compilerState.history}
              onClearHistory={compilerActions.clearExecutionHistory}
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div>Language: <span className="font-mono font-medium">{compilerState.language}</span></div>
          <div>Version: <span className="font-mono font-medium">{compilerState.version}</span></div>
          <div>Lines: <span className="font-mono font-medium">{compilerState.code.split('\n').length}</span></div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => compilerActions.resetCompiler()}
            className="text-red-600 hover:text-red-700"
          >
            Reset All
          </Button>
          
          <Button
            variant="outline"
            onClick={downloadCode}
            disabled={!compilerState.code.trim()}
          >
            Download Code
          </Button>
          
          <Button
            onClick={handleExecuteCode}
            disabled={compilerState.isExecuting || !compilerState.code.trim() || !isHealthy}
            className="bg-green-600 hover:bg-green-700"
          >
            {compilerState.isExecuting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Executing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Quick Help</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-1 text-gray-600">
                <div><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+Enter</kbd> Run code</div>
                <div><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+S</kbd> Download</div>
                <div><kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+Shift+F</kbd> Format</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Execution Limits</h4>
              <div className="space-y-1 text-gray-600">
                <div>• Max time: 30 seconds</div>
                <div>• Max memory: 128 MB</div>
                <div>• Max output: 64 KB</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported Languages</h4>
              <div className="text-gray-600">
                <div className="flex flex-wrap gap-1">
                  {supportedLanguages.slice(0, 8).map((lang) => (
                    <span 
                      key={lang} 
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {lang}
                    </span>
                  ))}
                  {supportedLanguages.length > 8 && (
                    <span className="text-gray-500 text-xs">
                      +{supportedLanguages.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}