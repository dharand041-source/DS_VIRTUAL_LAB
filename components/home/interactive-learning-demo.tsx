'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Database,
  Terminal,
  Code2
} from 'lucide-react';

interface DemoStep {
  lineNumber: number;
  codeLine: string;
  comment?: string;
  explanation: string;
  ramStateNote: string;
  variables: Record<string, string | number>;
  timeComplexity: string;
  visualData: {
    elements: {
      index: number;
      val: string | number;
      addr: string;
      isHighlighted: boolean;
      isAvailable?: boolean;
    }[];
    activeIdx: number | null;
  };
}

const SINGLE_DEMO_PROGRAM = {
  title: 'Array Insertion & Memory State',
  badge: 'Beginner • Contiguous Memory Allocation',
  cFileName: 'array_insertion_demo.c',
  steps: [
    {
      lineNumber: 1,
      codeLine: 'int arr[4] = {10, 20, 30};',
      comment: '// Allocate array of 4 integers in stack RAM',
      explanation: 'The C runtime reserves 16 contiguous bytes (4 elements × 4 bytes each) starting at base memory address 0x1000.',
      ramStateNote: 'Contiguous RAM slots [0], [1], [2] populated. Slot [3] contains uninitialized memory.',
      variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30, 'arr[3]': '?' },
      timeComplexity: 'O(1) Init',
      visualData: {
        elements: [
          { index: 0, val: 10, addr: '0x1000', isHighlighted: false },
          { index: 1, val: 20, addr: '0x1004', isHighlighted: false },
          { index: 2, val: 30, addr: '0x1008', isHighlighted: false },
          { index: 3, val: '—', addr: '0x100C', isHighlighted: false, isAvailable: true }
        ],
        activeIdx: null
      }
    },
    {
      lineNumber: 2,
      codeLine: 'int size = 3; int insertVal = 25;',
      comment: '// Store current count and value to insert',
      explanation: 'Local integer variables size (3) and insertVal (25) are allocated in the active stack call frame.',
      ramStateNote: 'Stack registers loaded with insert value 25 targeted for insertion at index [3].',
      variables: { 'size': 3, 'insertVal': 25 },
      timeComplexity: 'O(1)',
      visualData: {
        elements: [
          { index: 0, val: 10, addr: '0x1000', isHighlighted: false },
          { index: 1, val: 20, addr: '0x1004', isHighlighted: false },
          { index: 2, val: 30, addr: '0x1008', isHighlighted: false },
          { index: 3, val: '—', addr: '0x100C', isHighlighted: true, isAvailable: true }
        ],
        activeIdx: 3
      }
    },
    {
      lineNumber: 3,
      codeLine: 'arr[size] = insertVal; // arr[3] = 25',
      comment: '// Direct memory write at index 3 (Base + 3*4 = 0x100C)',
      explanation: 'Using pointer arithmetic (0x1000 + 3 × 4 bytes = 0x100C), CPU writes binary 25 directly into the 4th memory slot.',
      ramStateNote: 'Memory address 0x100C successfully written with value 25. Array is now full.',
      variables: { 'arr[0]': 10, 'arr[1]': 20, 'arr[2]': 30, 'arr[3]': 25 },
      timeComplexity: 'O(1) Direct Write',
      visualData: {
        elements: [
          { index: 0, val: 10, addr: '0x1000', isHighlighted: false },
          { index: 1, val: 20, addr: '0x1004', isHighlighted: false },
          { index: 2, val: 30, addr: '0x1008', isHighlighted: false },
          { index: 3, val: 25, addr: '0x100C', isHighlighted: true, isAvailable: false }
        ],
        activeIdx: 3
      }
    },
    {
      lineNumber: 4,
      codeLine: 'printf("Inserted %d at index %d\\n", arr[3], 3);',
      comment: '// Output verification to console',
      explanation: 'Console stream receives formatted output string confirming successful O(1) array element insertion.',
      ramStateNote: 'Standard Output (stdout): "Inserted 25 at index 3". Execution complete.',
      variables: { 'arr[3]': 25, 'status': 'COMPLETE' },
      timeComplexity: 'O(1) I/O',
      visualData: {
        elements: [
          { index: 0, val: 10, addr: '0x1000', isHighlighted: false },
          { index: 1, val: 20, addr: '0x1004', isHighlighted: false },
          { index: 2, val: 30, addr: '0x1008', isHighlighted: false },
          { index: 3, val: 25, addr: '0x100C', isHighlighted: true, isAvailable: false }
        ],
        activeIdx: 3
      }
    }
  ]
};

export function InteractiveLearningDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeProgram = SINGLE_DEMO_PROGRAM;
  const activeStep = activeProgram.steps[currentStepIndex] || activeProgram.steps[0];

  // Step controls
  const handleNextStep = () => {
    setCurrentStepIndex((prev) => (prev < activeProgram.steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : activeProgram.steps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeProgram.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeProgram.steps.length]);

  return (
    <div className="w-full max-w-5xl mx-auto border border-border rounded-2xl bg-white shadow-floating overflow-hidden text-left animate-fade-in select-none">
      {/* 1. Header Toolbar */}
      <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between gap-3">
        {/* Left: Window Controls & File Name */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-300"></div>
          </div>
          <span className="text-xs font-mono font-bold text-black ml-2 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-red-600" />
            <span>{activeProgram.cFileName}</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-border text-secondary hidden sm:inline">
            {activeProgram.badge}
          </span>
        </div>

        <div className="text-[11px] font-mono text-muted hidden md:inline">
          Interactive Beginner Demonstration
        </div>
      </div>

      {/* 2. Interactive Execution Control Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`btn ${isPlaying ? 'btn-outline-warning' : 'btn-outline-danger'}`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Auto-Play Step-by-Step</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrevStep}
            className="btn btn-outline-secondary btn-sm"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNextStep}
            className="btn btn-outline-secondary btn-sm font-bold"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="btn btn-outline-secondary btn-sm"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Indicator & Complexity */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[11px] text-muted">
            Step <strong className="text-black">{currentStepIndex + 1}</strong> of {activeProgram.steps.length}
          </span>
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
            {activeStep.timeComplexity}
          </span>
        </div>
      </div>

      {/* 3. Main Split-Screen Workspace: Code Editor on Left, Live Visualizer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
        {/* LEFT: Interactive C Source Code */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border p-4 bg-surface/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-border text-[10px] font-mono text-muted">
              <span>C SOURCE CODE (CLICK LINE TO EXECUTE)</span>
              <span className="text-red-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                LIVE POINTER
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {activeProgram.steps.map((step, idx) => {
                const isActive = currentStepIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStepIndex(idx);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-red-50/90 border-red-300 shadow-subtle ring-1 ring-red-400'
                        : 'bg-white border-border/80 hover:border-zinc-400 text-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : 'bg-surface text-muted border border-border'
                        }`}
                      >
                        {step.lineNumber}
                      </span>
                      <span className={`font-bold ${isActive ? 'text-black' : 'text-zinc-800'}`}>
                        {step.codeLine}
                      </span>
                    </div>
                    {step.comment && (
                      <p className="text-[10px] text-muted font-sans italic mt-1 pl-6">
                        {step.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active RAM Variables Snapshot */}
          <div className="mt-4 p-2.5 bg-white rounded-xl border border-border space-y-1.5 shadow-xs">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted block">
              Active RAM Variables Snapshot
            </span>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              {Object.entries(activeStep.variables).map(([k, v]) => (
                <span
                  key={k}
                  className="px-2 py-0.5 rounded-md bg-surface border border-border text-black font-semibold"
                >
                  <strong className="text-red-700">{k}</strong> = {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Live Data Structure Memory Visualizer */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-white">
          <div className="flex flex-col items-center justify-center flex-1 my-4">
            <span className="text-[11px] font-mono text-muted mb-4 block">
              Contiguous RAM Slots (4 Bytes Each)
            </span>

            {/* RAM Slot Boxes */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {activeStep.visualData.elements.map((el, i) => (
                <div
                  key={i}
                  className={`w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-between p-2 transition-all duration-300 font-mono ${
                    el.isHighlighted
                      ? 'bg-red-50 border-red-600 scale-110 shadow-red'
                      : el.isAvailable
                      ? 'bg-surface/50 border-dashed border-zinc-400 text-muted'
                      : 'bg-white border-black text-black shadow-subtle'
                  }`}
                >
                  <span className="text-[9px] text-muted font-sans font-bold">
                    arr[{el.index}]
                  </span>
                  <span className="text-lg font-black text-black">
                    {el.val}
                  </span>
                  <span className="text-[8px] text-muted font-mono">
                    {el.addr}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Teaching Explanation Box */}
          <div className="bg-surface/80 border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-black font-bold text-xs">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span>AI Teaching Explanation:</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {activeStep.explanation}
            </p>
            <div className="pt-2 border-t border-border flex items-start gap-1.5 text-[11px] font-mono text-black">
              <span className="text-amber-600 font-bold shrink-0">💡 Memory State:</span>
              <span>{activeStep.ramStateNote}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Footer CTA Bar */}
      <div className="px-4 py-3 bg-surface border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span className="text-secondary font-medium">
          Ready to write your own custom C programs and test cases?
        </span>
        <div className="flex items-center gap-2">
          <Link
            href="/compiler"
            className="btn btn-outline-primary"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Open in C Compiler</span>
          </Link>
          <Link
            href="/experiments"
            className="btn btn-outline-dark"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Explore 10 Experiments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
