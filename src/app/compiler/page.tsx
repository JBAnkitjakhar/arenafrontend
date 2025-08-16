// src/app/compiler/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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
  Activity,
  Play,
  Clock,
  Sparkles,
  Terminal,
  Download,
  RotateCcw,
  Rocket
} from 'lucide-react';
import { ExecutionRequest } from '@/types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  }
};

export default function CompilerPage() {
  const compilerState = useCompilerState();
  const { isLoading: isLoadingRuntimes } = useRuntimes();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="mx-auto h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h2 className="text-xl font-semibold text-gray-900">Initializing Compiler</h2>
              <p className="text-gray-600">Loading compiler environment and runtimes...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center space-x-3"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Code className="h-10 w-10 text-blue-600" />
              </motion.div>
              <span>Code Compiler</span>
            </motion.h1>
            <p className="text-gray-600 text-lg">
              Write, test, and debug your code in multiple programming languages with real-time execution
            </p>
          </div>
          
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Health Status */}
            <motion.div 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                isHealthy 
                  ? 'bg-green-100/80 text-green-800 border border-green-200' 
                  : 'bg-red-100/80 text-red-800 border border-red-200'
              }`}
              whileHover={{ scale: 1.05 }}
              animate={isHealthy ? { 
                boxShadow: [
                  "0 0 0 0 rgba(34, 197, 94, 0.4)",
                  "0 0 0 10px rgba(34, 197, 94, 0)",
                ]
              } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isHealthy ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <span>{isHealthy ? 'Online' : 'Offline'}</span>
            </motion.div>
            
            {/* Stats */}
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{supportedLanguages.length} languages</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="font-medium">{compilerState.history.length} executions</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Health Alert */}
        <AnimatePresence>
          {!isHealthy && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  The compiler service is currently unavailable. Some features may not work properly.
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-3 h-6 text-xs"
                    onClick={() => window.location.reload()}
                  >
                    Retry Connection
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats Cards */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          {[
            {
              title: 'Languages',
              value: supportedLanguages.length,
              icon: Code,
              color: 'from-blue-500 to-cyan-500',
              bgColor: 'from-blue-50 to-cyan-50',
            },
            {
              title: 'Executions',
              value: compilerState.history.length,
              icon: Zap,
              color: 'from-green-500 to-emerald-500',
              bgColor: 'from-green-50 to-emerald-50',
            },
            {
              title: 'Code Lines',
              value: compilerState.code.split('\n').length,
              icon: Terminal,
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-50 to-pink-50',
            },
            {
              title: 'Current',
              value: compilerState.language.toUpperCase(),
              icon: Settings,
              color: 'from-orange-500 to-red-500',
              bgColor: 'from-orange-50 to-red-50',
              isText: true,
            },
          ].map((stat, index) => (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card 
                variant="elevated" 
                className={`relative overflow-hidden bg-gradient-to-br ${stat.bgColor} border-0 hover:shadow-xl transition-all duration-300`}
                hover={true}
                animate={true}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <stat.icon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.title}</div>
                    </div>
                  </div>
                  {/* Gradient overlay */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.color} opacity-5 rounded-full blur-xl`} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content - Split Layout */}
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {/* Code Editor - Takes 2/3 of the width */}
          <motion.div className="xl:col-span-2" variants={itemVariants}>
            <div className="h-[700px]">
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
          </motion.div>

          {/* Right Panel - Input and Output */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {/* Input Panel */}
            <div className="h-80">
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
          </motion.div>
        </motion.div>

        {/* Action Bar */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Info Section */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span>Language:</span>
                    <span className="font-mono font-medium bg-blue-100 px-2 py-1 rounded text-blue-700">
                      {compilerState.language}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-green-500" />
                    <span>Version:</span>
                    <span className="font-mono font-medium bg-green-100 px-2 py-1 rounded text-green-700">
                      {compilerState.version}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-4 w-4 text-purple-500" />
                    <span>Lines:</span>
                    <span className="font-mono font-medium bg-purple-100 px-2 py-1 rounded text-purple-700">
                      {compilerState.code.split('\n').length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span>Chars:</span>
                    <span className="font-mono font-medium bg-orange-100 px-2 py-1 rounded text-orange-700">
                      {compilerState.code.length}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => compilerActions.resetCompiler()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    icon={<RotateCcw className="h-4 w-4" />}
                  >
                    Reset
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={downloadCode}
                    disabled={!compilerState.code.trim()}
                    className="hover:bg-blue-50 border-blue-200"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                  
                  <Button
                    onClick={handleExecuteCode}
                    disabled={compilerState.isExecuting || !compilerState.code.trim() || !isHealthy}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    loading={compilerState.isExecuting}
                    animate={true}
                    icon={compilerState.isExecuting ? undefined : <Rocket className="h-4 w-4" />}
                  >
                    {compilerState.isExecuting ? 'Executing...' : 'Run Code'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span>Quick Help & Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Code className="h-4 w-4 text-blue-500" />
                    <span>Keyboard Shortcuts</span>
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Run code</span>
                      <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">Ctrl+Enter</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Download</span>
                      <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">Ctrl+S</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Format code</span>
                      <kbd className="bg-gray-200 px-2 py-1 rounded text-xs font-mono">Ctrl+Shift+F</kbd>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-green-500" />
                    <span>Execution Limits</span>
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>Max time: 30 seconds</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-3 w-3" />
                      <span>Max memory: 128 MB</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Terminal className="h-3 w-3" />
                      <span>Max output: 64 KB</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-purple-500" />
                    <span>Supported Languages</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {supportedLanguages.slice(0, 8).map((lang) => (
                      <motion.span 
                        key={lang} 
                        className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {lang}
                      </motion.span>
                    ))}
                    {supportedLanguages.length > 8 && (
                      <span className="text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full">
                        +{supportedLanguages.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}