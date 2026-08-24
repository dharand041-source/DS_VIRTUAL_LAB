'use client';

import React, { useState } from 'react';
import { ASTStackItem } from '@/lib/types';
import { ArrowLeft, Plus, Trash2, RotateCcw, Info, ArrowDown } from 'lucide-react';

interface StackVisualizerProps {
  initialItems?: ASTStackItem[];
  mode?: 'array' | 'linked_list';
  maxCapacity?: number;
}

export function StackVisualizer({
  initialItems,
  mode = 'array',
  maxCapacity = 5
}: StackVisualizerProps) {
  const [stack, setStack] = useState<(number | string)[]>(
    initialItems && initialItems.length > 0
      ? initialItems.map(i => i.value)
      : [10, 20, 30]
  );
  const [inputValue, setInputValue] = useState<string>('40');
  const [log, setLog] = useState<string>('Stack initialized with 3 elements. LIFO Discipline.');

  const topIndex = stack.length - 1;

  const handlePush = () => {
    if (mode === 'array' && stack.length >= maxCapacity) {
      setLog(`Stack Overflow! Capacity is ${maxCapacity}. Cannot push more items.`);
      return;
    }
    const val = parseInt(inputValue, 10) || Math.floor(Math.random() * 90) + 10;
    setStack([...stack, val]);
    setLog(`PUSH(${val}): Incremented top to ${stack.length}, inserted at stack[${stack.length}].`);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setLog('Stack Underflow! Stack is empty (top = -1).');
      return;
    }
    const popped = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setLog(`POP(): Removed top element (${popped}). Top decremented to ${stack.length - 2}.`);
  };

  const handleReset = () => {
    setStack([10, 20, 30]);
    setLog('Reset stack to default state.');
  };

  return (
    <div className="w-full flex flex-col h-full bg-white select-none">
      {/* Header Controls */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">ADT:</span>
          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-subtle border border-border">
            {mode === 'array' ? `Stack ADT (Array MAX=${maxCapacity})` : 'Stack ADT (Dynamic Linked List)'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 border border-border rounded-md px-1.5 py-0.5 bg-white">
            <span className="text-[11px] text-muted font-mono">val:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-12 text-xs font-mono text-primary bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={handlePush}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition shadow-subtle"
          >
            <Plus className="w-3 h-3" /> Push
          </button>

          <button
            onClick={handlePop}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-rose-50 text-rose-600 border border-border transition"
          >
            <Trash2 className="w-3 h-3" /> Pop
          </button>

          <button
            onClick={handleReset}
            className="p-1 text-muted hover:text-primary transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stack Visual Canvas */}
      <div className="flex-1 p-6 flex flex-col items-center justify-end min-h-[240px] overflow-y-auto">
        <div className="w-64 border-b-4 border-l-2 border-r-2 border-primary rounded-b-lg p-2 bg-zinc-50 flex flex-col-reverse gap-1.5 min-h-[180px] shadow-subtle">
          {/* Stack Slots from bottom (0) to top */}
          {Array.from({ length: mode === 'array' ? maxCapacity : Math.max(stack.length, 4) }).map((_, idx) => {
            const hasItem = idx < stack.length;
            const val = hasItem ? stack[idx] : null;
            const isTop = idx === topIndex;

            return (
              <div
                key={idx}
                className={`relative flex items-center justify-between px-3 py-2 rounded border transition-all duration-200 ${
                  hasItem
                    ? isTop
                      ? 'bg-primary text-white border-primary shadow-subtle'
                      : 'bg-white text-primary border-border'
                    : 'bg-transparent border-dashed border-zinc-300 text-muted opacity-40'
                }`}
              >
                <span className="text-[10px] font-mono opacity-60">
                  [{idx}]
                </span>

                <span className="text-sm font-mono font-bold">
                  {hasItem ? val : 'empty'}
                </span>

                {isTop && (
                  <div className="absolute -right-24 flex items-center gap-1 text-accent-blue font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    <ArrowLeft className="w-3.5 h-3.5" /> TOP ({topIndex})
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {stack.length === 0 && (
          <div className="mt-2 text-xs font-mono text-muted flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> top = -1 (Empty Stack)
          </div>
        )}
      </div>

      {/* State Log */}
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-muted shrink-0" />
        <p className="text-xs font-mono text-secondary truncate">
          {log}
        </p>
      </div>
    </div>
  );
}
