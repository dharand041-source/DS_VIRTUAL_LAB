'use client';

import React, { useState } from 'react';
import { SandboxExecutionResult } from '@/lib/c-sandbox-executor';
import { Terminal, CheckCircle2, XCircle, Clock, HardDrive, AlertCircle } from 'lucide-react';

interface OutputConsoleProps {
  executionResult: SandboxExecutionResult | null;
  isRunning?: boolean;
}

export function OutputConsole({ executionResult, isRunning }: OutputConsoleProps) {
  const [activeTab, setActiveTab] = useState<'console' | 'tests'>('console');

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Console Header Tabs */}
      <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition ${
              activeTab === 'console'
                ? 'bg-white text-primary shadow-subtle border border-border'
                : 'text-muted hover:text-primary'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" /> Output
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded transition ${
              activeTab === 'tests'
                ? 'bg-white text-primary shadow-subtle border border-border'
                : 'text-muted hover:text-primary'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Test Cases</span>
            {executionResult && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                executionResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {executionResult.totalPassed}/{executionResult.totalTests}
              </span>
            )}
          </button>
        </div>

        {executionResult && (
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {executionResult.executionTimeMs} ms
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" /> {executionResult.memoryKb} KB
            </span>
          </div>
        )}
      </div>

      {/* Main Console Content */}
      <div className="flex-1 p-3 overflow-y-auto bg-surface-subtle font-mono text-xs text-primary min-h-[140px]">
        {isRunning ? (
          <div className="flex items-center gap-2 text-muted py-4">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Compiling C program in isolated sandbox worker...</span>
          </div>
        ) : !executionResult ? (
          <div className="text-muted py-4">
            Click <strong className="text-primary font-semibold">"Run Program"</strong> to compile, execute in sandbox, and evaluate test cases.
          </div>
        ) : activeTab === 'console' ? (
          <div>
            {executionResult.compilationError ? (
              <div className="space-y-2">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Compilation / Security Diagnostic</span>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap">{executionResult.compilationError}</pre>
                </div>

                {executionResult.beginnerErrorExplanation && (
                  <div className="p-3 bg-white border border-border rounded text-secondary font-sans text-xs">
                    <strong className="text-primary font-semibold block mb-1">Beginner Help:</strong>
                    {executionResult.beginnerErrorExplanation}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <span className="text-muted text-[11px] block mb-1">$ ./program_exec</span>
                <pre className="whitespace-pre-wrap text-primary font-mono">{executionResult.stdout}</pre>
                <div className="mt-3 pt-2 border-t border-border text-[11px] text-muted flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" />
                  <span>Process finished with exit code 0</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Test Cases Tab */
          <div className="space-y-2 font-sans">
            {executionResult.results.map((res, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border bg-white ${
                  res.passed ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    {res.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
                    ) : (
                      <XCircle className="w-4 h-4 text-accent-rose" />
                    )}
                    <span className="text-xs font-bold text-primary">{res.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    res.passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {res.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-muted uppercase block font-sans">Expected Output:</span>
                    <pre className="text-primary whitespace-pre-wrap mt-0.5">{res.expectedOutput}</pre>
                  </div>

                  <div className="bg-surface p-2 rounded border border-border">
                    <span className="text-[10px] text-muted uppercase block font-sans">Actual Output:</span>
                    <pre className="text-primary whitespace-pre-wrap mt-0.5">{res.actualOutput}</pre>
                  </div>
                </div>

                {res.errorMessage && (
                  <p className="mt-2 text-xs text-rose-600 font-sans">{res.errorMessage}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
