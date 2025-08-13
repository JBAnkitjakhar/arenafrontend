// src/components/compiler/OutputPanel.tsx

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Copy, 
  Download,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExecutionResponse } from '@/types';

interface OutputPanelProps {
  output: ExecutionResponse | null;
  error: string | null;
  isExecuting: boolean;
  history: Array<{
    id: string;
    code: string;
    language: string;
    output: ExecutionResponse;
    timestamp: string;
  }>;
  onClearHistory: () => void;
}

export function OutputPanel({ 
  output, 
  error, 
  isExecuting, 
  history, 
  onClearHistory 
}: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState('output');
  const [showStdout, setShowStdout] = useState(true);
  const [showStderr, setShowStderr] = useState(true);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadOutput = () => {
    if (!output) return;
    
    const outputText = [
      `Language: ${output.language} ${output.version}`,
      '',
      'STDOUT:',
      output.run.stdout || '(empty)',
      '',
      'STDERR:',
      output.run.stderr || '(empty)',
      '',
      `Exit Code: ${output.run.code}`,
      `Execution Time: ${new Date().toLocaleString()}`
    ].join('\n');
    
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output_${output.language}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (code: number) => {
    if (code === 0) return 'text-green-600';
    if (code === 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (code: number) => {
    if (code === 0) return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Terminal className="h-5 w-5" />
            <span>Output</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {output && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(output.run.stdout + '\n' + output.run.stderr)}
                  title="Copy output"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadOutput}
                  title="Download output"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearHistory}
                title="Clear history"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-80">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="output" className="flex items-center space-x-2">
              <Terminal className="h-4 w-4" />
              <span>Output</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>History ({history.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Output Tab */}
          <TabsContent value="output" className="mt-0 h-full">
            <div className="p-4 h-full overflow-auto">
              {isExecuting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600">Executing your code...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Execution Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              ) : output ? (
                <div className="space-y-4">
                  {/* Execution Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(output.run.code)}
                        <span className="text-sm font-medium">
                          {output.language} {output.version}
                        </span>
                        <span className={`text-sm ${getStatusColor(output.run.code)}`}>
                          Exit Code: {output.run.code}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowStdout(!showStdout)}
                          title={showStdout ? 'Hide stdout' : 'Show stdout'}
                        >
                          {showStdout ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span className="ml-1 text-xs">STDOUT</span>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowStderr(!showStderr)}
                          title={showStderr ? 'Hide stderr' : 'Show stderr'}
                        >
                          {showStderr ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          <span className="ml-1 text-xs">STDERR</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Standard Output */}
                  {showStdout && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Standard Output</h4>
                        {output.run.stdout && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(output.run.stdout)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-sm overflow-auto max-h-32">
                        {output.run.stdout ? (
                          <pre className="whitespace-pre-wrap">{output.run.stdout}</pre>
                        ) : (
                          <span className="text-gray-500 italic">(no output)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Standard Error */}
                  {showStderr && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">Standard Error</h4>
                        {output.run.stderr && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(output.run.stderr)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="bg-gray-900 text-red-400 rounded-lg p-3 font-mono text-sm overflow-auto max-h-32">
                        {output.run.stderr ? (
                          <pre className="whitespace-pre-wrap">{output.run.stderr}</pre>
                        ) : (
                          <span className="text-gray-500 italic">(no errors)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Compile Output (if available) */}
                  {output.compile && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Compilation</h4>
                      <div className="bg-gray-900 text-blue-400 rounded-lg p-3 font-mono text-sm overflow-auto max-h-32">
                        {output.compile.stdout && (
                          <div className="mb-2">
                            <span className="text-blue-300">STDOUT:</span>
                            <pre className="whitespace-pre-wrap">{output.compile.stdout}</pre>
                          </div>
                        )}
                        {output.compile.stderr && (
                          <div>
                            <span className="text-red-300">STDERR:</span>
                            <pre className="whitespace-pre-wrap">{output.compile.stderr}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center space-y-2">
                    <Terminal className="h-12 w-12 mx-auto opacity-50" />
                    <p>No output yet. Run your code to see results.</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0 h-full">
            <div className="p-4 h-full overflow-auto">
              {history.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center space-y-2">
                    <Clock className="h-12 w-12 mx-auto opacity-50" />
                    <p>No execution history yet.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.output.run.code)}
                          <span className="text-sm font-medium">
                            {item.language} {item.output.version}
                          </span>
                          <span className={`text-xs ${getStatusColor(item.output.run.code)}`}>
                            Exit: {item.output.run.code}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(item.timestamp)}
                        </span>
                      </div>
                      
                      {/* Preview of output */}
                      <div className="text-xs text-gray-600 space-y-1">
                        {item.output.run.stdout && (
                          <div className="bg-gray-100 rounded p-2 font-mono">
                            <span className="text-gray-700">Output: </span>
                            <span className="truncate">
                              {item.output.run.stdout.slice(0, 100)}
                              {item.output.run.stdout.length > 100 && '...'}
                            </span>
                          </div>
                        )}
                        {item.output.run.stderr && (
                          <div className="bg-red-50 rounded p-2 font-mono">
                            <span className="text-red-700">Error: </span>
                            <span className="truncate text-red-600">
                              {item.output.run.stderr.slice(0, 100)}
                              {item.output.run.stderr.length > 100 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}