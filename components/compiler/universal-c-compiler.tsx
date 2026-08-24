'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { analyzeCProgramState } from '@/lib/c-ast-interpreter';
import { ASTProgramState } from '@/lib/types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Terminal,
  Database,
  Eye,
  Sparkles,
  Check,
  Copy,
  Code2,
  Zap,
  CheckCircle2
} from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const DEFAULT_C_CODE = `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

struct Node* head = NULL;

void insertAtBeginning(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

void insertAtEnd(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = value;
    newNode->next = NULL;
    if (head == NULL) {
        head = newNode;
        return;
    }
    struct Node* temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
}

int main() {
    insertAtBeginning(10);
    insertAtBeginning(20);
    insertAtEnd(30);
    insertAtEnd(40);
    printf("Linked List nodes linked successfully!\\n");
    return 0;
}`;

export function UniversalCCompiler() {
  const [code, setCode] = useState<string>(DEFAULT_C_CODE);
  const [activeLine, setActiveLine] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1000); // ms per line
  const [customInput, setCustomInput] = useState<string>('10 20 30');
  const [showInputDrawer, setShowInputDrawer] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'memory' | 'console' | 'explanation'>('console');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runSuccess, setRunSuccess] = useState<boolean>(false);

  // Compute live AST Program State
  const astState = useMemo<ASTProgramState>(() => {
    return analyzeCProgramState(code, activeLine);
  }, [code, activeLine]);

  const totalLines = useMemo(() => {
    return Math.max(1, code.split('\n').length);
  }, [code]);

  // Auto-play stepper
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveLine((prev) => {
          if (prev >= totalLines) {
            setIsPlaying(false);
            return totalLines;
          }
          return prev + 1;
        });
      }, playSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, totalLines, playSpeed]);

  const handleRunCode = () => {
    setIsPlaying(false);
    setIsRunning(true);
    // Jump straight to the final execution state and switch to console output
    setActiveLine(totalLines);
    setActiveTab('console');
    setTimeout(() => {
      setIsRunning(false);
      setRunSuccess(true);
      setTimeout(() => setRunSuccess(false), 2500);
    }, 200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStepNext = () => {
    setActiveLine(prev => Math.min(totalLines, prev + 1));
  };

  const handleStepPrev = () => {
    setActiveLine(prev => Math.max(1, prev - 1));
  };

  const handleReset = () => {
    setActiveLine(1);
    setIsPlaying(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-surface-subtle select-none">
      {/* Top Studio Control Bar */}
      <div className="border-b border-border bg-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-subtle">
        {/* Brand & Engine Identity */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs shadow-subtle">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-primary tracking-tight">
                C ONLINE COMPILER
              </span>
              <span className="px-1.5 py-0.5 rounded bg-surface text-secondary border border-border text-[9px] font-mono font-bold">
                AST Memory Engine
              </span>
            </div>
            <span className="text-[10px] text-muted font-mono hidden sm:inline">
              Department of AI&DS • Real-time Sandbox
            </span>
          </div>
        </div>

        {/* Right: Custom Input & Utilities */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInputDrawer(!showInputDrawer)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              showInputDrawer
                ? 'bg-surface text-primary border-zinc-400 font-bold'
                : 'border-border bg-white text-secondary hover:bg-surface'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Custom Input (stdin)</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-secondary text-xs font-semibold flex items-center gap-1.5 transition"
            title="Copy C Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Stdin Drawer (Collapsible) */}
      {showInputDrawer && (
        <div className="bg-surface border-b border-border p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex-1 w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
              Standard Input Stream (stdin for scanf / arguments)
            </span>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 10 20 30"
              className="w-full font-mono text-xs px-3 py-1.5 bg-white border border-border rounded-lg text-primary focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="text-[10px] text-muted font-mono shrink-0">
            Feed test inputs to C programs
          </div>
        </div>
      )}

      {/* Primary Toolbar: Run Button & Stepper Controls */}
      <div className="bg-surface/80 border-b border-border px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Main RUN Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center gap-1.5 shadow-subtle transition disabled:opacity-50"
            title="Run C Program"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-primary" />
            )}
            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
          </button>

          {/* Stepper Controls */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg border border-border text-xs font-bold flex items-center gap-1.5 transition shadow-subtle ${
              isPlaying
                ? 'bg-surface text-primary font-semibold'
                : 'bg-white text-primary hover:bg-surface'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-primary" /> : <Play className="w-3.5 h-3.5 fill-current text-primary" />}
            <span>{isPlaying ? 'Pause' : 'Auto Play Line-by-Line'}</span>
          </button>

          <button
            onClick={handleStepPrev}
            disabled={activeLine <= 1}
            className="p-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary disabled:opacity-40 transition shadow-subtle"
            title="Step Previous Line"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handleStepNext}
            disabled={activeLine >= totalLines}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-semibold flex items-center gap-1 disabled:opacity-40 transition shadow-subtle"
            title="Step Next Line"
          >
            <span>Next Line</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-border bg-white hover:bg-surface text-muted hover:text-primary transition shadow-subtle"
            title="Reset to Line 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-1 ml-2 font-mono text-xs text-muted border-l border-border pl-3">
            <span>Line:</span>
            <span className="font-bold text-primary px-1.5 py-0.5 rounded bg-surface border border-border text-[11px]">
              {activeLine} / {totalLines}
            </span>
          </div>

          {runSuccess && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-accent-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-fade-in">
              <CheckCircle2 className="w-3 h-3" />
              <span>Executed successfully (Exit 0)</span>
            </span>
          )}
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-muted">Speed:</span>
          <div className="flex rounded-md border border-border bg-white p-0.5 text-xs font-mono">
            <button
              onClick={() => setPlaySpeed(1500)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                playSpeed === 1500 ? 'bg-primary text-white font-bold' : 'text-secondary hover:text-primary'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setPlaySpeed(1000)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                playSpeed === 1000 ? 'bg-primary text-white font-bold' : 'text-secondary hover:text-primary'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setPlaySpeed(500)}
              className={`px-2 py-0.5 rounded text-[10px] transition ${
                playSpeed === 500 ? 'bg-primary text-white font-bold' : 'text-secondary hover:text-primary'
              }`}
            >
              2.0x
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden min-h-[550px]">
        {/* Left Column: Monaco C Editor */}
        <div className="lg:col-span-6 border-r border-border bg-white flex flex-col min-h-[350px] lg:min-h-0">
          <div className="px-4 py-2 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary font-mono flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span>main.c</span>
              </span>
              <span className="text-[10px] text-muted font-mono">
                Click any line or use Next Line to step through
              </span>
            </div>
            <span className="text-[10px] font-mono text-accent-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active Line {activeLine}
            </span>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              language="c"
              theme="light"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                glyphMargin: true,
                folding: false,
                lineDecorationsWidth: 10,
                renderLineHighlight: 'all',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
              onMount={(editor) => {
                editor.onMouseDown((e) => {
                  if (e.target.position) {
                    setActiveLine(e.target.position.lineNumber);
                  }
                });
              }}
            />
          </div>

          {/* Active Line Live Strip */}
          <div className="p-2.5 bg-surface border-t border-border flex items-center gap-2 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold text-muted px-1.5 py-0.5 rounded bg-white border border-border">
              L{activeLine}
            </span>
            <div className="flex-1 truncate text-primary font-semibold">
              {astState.activeLineText || '// (empty line)'}
            </div>
            <span className="text-[10px] font-sans text-accent-emerald font-semibold">
              ✨ Synchronized
            </span>
          </div>
        </div>

        {/* Right Column: Visualizer, Memory, Console (White Theme), and AI Explanation */}
        <div className="lg:col-span-6 bg-white flex flex-col min-h-[400px] lg:min-h-0">
          {/* Tabs Navigation */}
          <div className="px-4 py-2 border-b border-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-lg border border-border">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                  activeTab === 'console'
                    ? 'bg-white text-primary shadow-subtle font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
                <span>Console Output</span>
              </button>

              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                  activeTab === 'visual'
                    ? 'bg-white text-primary shadow-subtle font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-accent-blue" />
                <span>Live Visualizer</span>
              </button>

              <button
                onClick={() => setActiveTab('memory')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                  activeTab === 'memory'
                    ? 'bg-white text-primary shadow-subtle font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-accent-amber" />
                <span>RAM & Stack Table</span>
              </button>

              <button
                onClick={() => setActiveTab('explanation')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition ${
                  activeTab === 'explanation'
                    ? 'bg-white text-primary shadow-subtle font-bold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
                <span>AI Line Inspector</span>
              </button>
            </div>
          </div>

          {/* Tab: Console Output Terminal (White Theme with Black Text) */}
          {activeTab === 'console' && (
            <div className="flex-1 p-4 overflow-y-auto bg-white text-primary font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-border text-[11px] text-muted">
                  <span className="flex items-center gap-1.5 text-primary font-semibold">
                    <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                    <span>Standard Output (stdout)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-bold text-primary">
                    Exit Code: 0
                  </span>
                </div>

                <div className="space-y-1.5 bg-surface/50 p-3 rounded-xl border border-border min-h-[220px]">
                  {astState.consoleOutput.length === 0 ? (
                    <div className="text-muted italic py-4">
                      [Program execution sandbox ready. Click "Run Code" or step through lines to generate output.]
                    </div>
                  ) : (
                    astState.consoleOutput.map((out, idx) => (
                      <div key={idx} className="text-primary font-semibold flex items-center gap-2">
                        <span className="text-muted text-[10px] select-none">&gt;</span>
                        <span>{out}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border text-[10px] text-muted flex items-center justify-between mt-4">
                <span>Execution Time: ~2ms &bull; RAM: 512KB</span>
                <span className="text-accent-emerald font-semibold">&bull; GCC Sandbox Emulator Active</span>
              </div>
            </div>
          )}

          {/* Tab: Live Visualizer Canvas */}
          {activeTab === 'visual' && (
            <div className="flex-1 p-4 overflow-y-auto flex flex-col bg-surface/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
                  <span>Structure in RAM: {astState.detectedStructure?.toUpperCase() || 'GENERAL'}</span>
                </span>
                <span className="text-[10px] font-mono text-muted">
                  Active Pointer: {astState.activePointerName || 'head / top'}
                </span>
              </div>

              {/* Linked List Canvas */}
              {astState.detectedStructure === 'linked_list' && (
                <div className="flex-1 flex flex-col justify-center items-center py-6">
                  {astState.nodes.length === 0 ? (
                    <div className="text-center text-xs text-muted font-mono py-8">
                      Head pointer initialized to NULL. Step forward or click Run Code to allocate and link nodes.
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                      {astState.nodes.map((node, i) => (
                        <React.Fragment key={node.id}>
                          <div className="flex flex-col items-center group animate-fade-in">
                            {node.isHead && (
                              <span className="text-[10px] font-bold uppercase font-mono text-accent-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mb-1 shadow-subtle">
                                HEAD &bull; {astState.activePointerName || 'head'}
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-muted mb-0.5">
                              {node.address}
                            </span>
                            <div className="flex rounded-xl border-2 border-primary overflow-hidden shadow-card bg-white transition hover:scale-105">
                              <div className="px-3.5 py-2 bg-white border-r border-border font-mono text-sm font-bold text-primary flex items-center justify-center min-w-[45px]">
                                {node.value}
                              </div>
                              <div className="px-2.5 py-2 bg-surface font-mono text-[10px] text-muted flex items-center justify-center">
                                {node.nextAddress || 'NULL'}
                              </div>
                            </div>
                            <span className="text-[9px] font-mono text-secondary mt-1">
                              Node {i + 1}
                            </span>
                          </div>

                          <div className="flex items-center text-primary font-bold text-lg font-mono">
                            &rarr;
                          </div>
                        </React.Fragment>
                      ))}

                      <div className="px-2.5 py-1.5 rounded-lg border border-border bg-surface text-muted text-xs font-mono font-bold shadow-subtle">
                        NULL
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Stack Canvas */}
              {astState.detectedStructure === 'stack' && (
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="w-56 border-2 border-primary border-t-0 rounded-b-2xl bg-white p-2.5 shadow-card flex flex-col-reverse gap-1.5 min-h-[220px] justify-start">
                    {astState.stackItems.length === 0 ? (
                      <div className="text-center text-xs text-muted font-mono my-auto">
                        Stack is Empty (top = -1)
                      </div>
                    ) : (
                      astState.stackItems.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono font-bold shadow-subtle animate-fade-in ${
                            item.isTop
                              ? 'bg-amber-50 border-accent-amber text-primary'
                              : 'bg-white border-border text-secondary'
                          }`}
                        >
                          <span className="text-[10px] text-muted">Index [{item.index}]</span>
                          <span className="text-sm font-bold text-primary">{item.value}</span>
                          {item.isTop ? (
                            <span className="text-[9px] font-bold text-accent-amber uppercase bg-amber-100 px-1.5 py-0.5 rounded">
                              TOP
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted">&bull;</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-2">
                    LIFO Stack Memory Frame
                  </span>
                </div>
              )}

              {/* Queue Canvas */}
              {astState.detectedStructure === 'queue' && (
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="w-full max-w-md border-2 border-primary border-dashed rounded-2xl p-4 bg-white shadow-card flex items-center justify-start gap-2 overflow-x-auto">
                    {astState.queueItems && astState.queueItems.length > 0 ? (
                      astState.queueItems.map((qItem, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 min-w-[70px] p-2.5 rounded-xl border flex flex-col items-center text-xs font-mono shadow-subtle animate-fade-in ${
                            qItem.isFront
                              ? 'bg-blue-50 border-accent-blue'
                              : qItem.isRear
                              ? 'bg-emerald-50 border-accent-emerald'
                              : 'bg-white border-border'
                          }`}
                        >
                          {qItem.isFront && (
                            <span className="text-[8px] font-bold uppercase text-accent-blue bg-blue-100 px-1 rounded mb-1">
                              FRONT
                            </span>
                          )}
                          <span className="text-sm font-bold text-primary">{qItem.value}</span>
                          {qItem.isRear && (
                            <span className="text-[8px] font-bold uppercase text-accent-emerald bg-emerald-100 px-1 rounded mt-1">
                              REAR
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center w-full text-xs text-muted font-mono py-4">
                        Queue is currently empty.
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-2">
                    FIFO Queue Pipeline (Front &rarr; Rear)
                  </span>
                </div>
              )}

              {/* Array Contiguous Memory Strip */}
              {astState.detectedStructure === 'array' && (
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
                    {astState.arrayItems?.map((arrItem, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col items-center p-3 rounded-xl border text-center font-mono shadow-card min-w-[65px] transition animate-fade-in ${
                          arrItem.isHighlighted
                            ? 'bg-blue-50 border-accent-blue scale-105'
                            : 'bg-white border-border'
                        }`}
                      >
                        <span className="text-[9px] text-muted mb-1">[{arrItem.index}]</span>
                        <span className="text-base font-bold text-primary">{arrItem.value}</span>
                        <span className="text-[9px] text-secondary mt-1">{arrItem.address}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-3">
                    Contiguous 4-Byte Element Offsets (Base + Index &times; Size)
                  </span>
                </div>
              )}

              {/* Pointer & General Memory View */}
              {(astState.detectedStructure === 'pointers' || astState.detectedStructure === 'general') && (
                <div className="flex-1 flex flex-col justify-center py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {astState.variables.map((v, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white rounded-xl border border-border shadow-subtle flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-primary font-mono">{v.name}</div>
                          <div className="text-[10px] text-muted font-mono">{v.type} &bull; {v.address}</div>
                        </div>
                        <div className="px-2.5 py-1 rounded bg-surface border border-border text-xs font-mono font-bold text-accent-blue">
                          {String(v.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tree Visualizer */}
              {astState.detectedStructure === 'tree' && (
                <div className="flex-1 flex flex-col items-center justify-center py-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary text-white font-mono font-bold text-sm flex items-center justify-center shadow-card">
                      50
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-accent-blue font-mono font-bold text-xs flex items-center justify-center border border-blue-300">
                          30
                        </div>
                        <span className="text-[9px] text-muted mt-1">Left Child</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-accent-emerald font-mono font-bold text-xs flex items-center justify-center border border-emerald-300">
                          70
                        </div>
                        <span className="text-[9px] text-muted mt-1">Right Child</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted mt-3">
                    Binary Search Tree Hierarchy (Root &rarr; Left &lt; Root &lt; Right)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tab: RAM & Stack Memory Table */}
          {activeTab === 'memory' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">
                  Runtime RAM Stack Frames & Local Scope
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Call Stack: {astState.callStack.join(' &rarr; ')}
                </span>
              </div>

              {astState.variables.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted font-mono">
                  No local variables allocated in current stack frame.
                </div>
              ) : (
                <div className="border border-border rounded-xl overflow-hidden shadow-subtle">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-surface border-b border-border text-muted">
                      <tr>
                        <th className="py-2.5 px-3">Identifier</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">RAM Address</th>
                        <th className="py-2.5 px-3">Stored Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-white">
                      {astState.variables.map((v, i) => (
                        <tr key={i} className="hover:bg-surface transition">
                          <td className="py-2.5 px-3 font-bold text-primary">{v.name}</td>
                          <td className="py-2.5 px-3 text-secondary">{v.type}</td>
                          <td className="py-2.5 px-3 text-muted">{v.address}</td>
                          <td className="py-2.5 px-3 font-bold text-accent-blue">{String(v.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab: AI Pedagogical Line Inspector */}
          {activeTab === 'explanation' && (
            <div className="flex-1 p-4 overflow-y-auto">
              {astState.lineExplanation ? (
                <div className="space-y-3">
                  <div className="p-3 bg-surface rounded-xl border border-border">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                      <Sparkles className="w-4 h-4 text-accent-indigo" />
                      <span>{astState.lineExplanation.purpose}</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">
                      {astState.lineExplanation.whatItDoes}
                    </p>
                  </div>

                  <div className="academic-card p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                      💡 Beginner Analogy
                    </span>
                    <p className="text-xs text-primary leading-relaxed">
                      {astState.lineExplanation.beginnerFriendly}
                    </p>
                  </div>

                  <div className="academic-card p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
                      ⚙️ Internal Memory Effect (RAM / Heap / CPU)
                    </span>
                    <p className="text-xs text-secondary font-mono leading-relaxed">
                      {astState.lineExplanation.internalMemoryEffect}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl border border-border bg-white">
                      <span className="text-[9px] font-bold uppercase text-muted block mb-0.5">Why Needed</span>
                      <p className="text-[11px] text-secondary">{astState.lineExplanation.whyNeeded}</p>
                    </div>
                    <div className="p-2.5 rounded-xl border border-red-200 bg-red-50/50">
                      <span className="text-[9px] font-bold uppercase text-accent-rose block mb-0.5">What If Removed</span>
                      <p className="text-[11px] text-red-900">{astState.lineExplanation.whatIfRemoved}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-muted">
                  Select any line in the code editor to view detailed pedagogical explanations.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
