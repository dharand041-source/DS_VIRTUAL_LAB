'use client';

import React, { useState, useEffect } from 'react';
import { ASTStackItem } from '@/lib/types';
import {
  ArrowLeft,
  Plus,
  Trash2,
  RotateCcw,
  Info,
  ArrowDown,
  Sparkles,
  Zap,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface StackVisualizerProps {
  initialItems?: ASTStackItem[];
  mode?: 'array' | 'linked_list';
  maxCapacity?: number;
  activeLine?: number;
}

interface AnimatedStackNode {
  id: string;
  value: number | string;
  address: string;
  isNew?: boolean;
  isPopping?: boolean;
}

export function StackVisualizer({
  initialItems,
  mode = 'array',
  maxCapacity = 6,
  activeLine
}: StackVisualizerProps) {
  const [items, setItems] = useState<AnimatedStackNode[]>([
    { id: 'item-1', value: 10, address: '0x7ffc01' },
    { id: 'item-2', value: 20, address: '0x7ffc05' },
    { id: 'item-3', value: 30, address: '0x7ffc09' }
  ]);

  const [inputValue, setInputValue] = useState<string>('42');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [poppedGhost, setPoppedGhost] = useState<{ value: number | string; address: string } | null>(null);
  const [logMessage, setLogMessage] = useState<string>('Stack ready. LIFO (Last-In, First-Out) discipline.');

  // Sync with code AST state if provided
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setItems(
        initialItems.map((item, idx) => ({
          id: `ast-${idx}-${item.value}`,
          value: item.value,
          address: `0x7ffc${(idx * 4 + 1).toString(16).padStart(2, '0')}`
        }))
      );
    }
  }, [initialItems]);

  const topIndex = items.length - 1;

  // Animate PUSH operation (box drops into stack from above)
  const handlePush = (customVal?: number | string) => {
    if (isAnimating) return;

    if (mode === 'array' && items.length >= maxCapacity) {
      setLogMessage(`❌ STACK OVERFLOW! Capacity (${maxCapacity}) reached. Cannot push.`);
      return;
    }

    const valToPush = customVal !== undefined ? customVal : (parseInt(inputValue, 10) || Math.floor(Math.random() * 80) + 10);
    const newAddr = `0x7ffc${(items.length * 4 + 1).toString(16).padStart(2, '0')}`;
    const newItem: AnimatedStackNode = {
      id: `node-${Date.now()}`,
      value: valToPush,
      address: newAddr,
      isNew: true
    };

    setIsAnimating(true);
    setItems((prev) => [...prev, newItem]);
    setLogMessage(`📥 PUSH(${valToPush}): top moved ${topIndex} ➔ ${items.length}. Allocated at ${newAddr}.`);

    setTimeout(() => {
      setItems((prev) =>
        prev.map((it) => (it.id === newItem.id ? { ...it, isNew: false } : it))
      );
      setIsAnimating(false);
    }, 550);
  };

  // Animate POP operation (box floats up and flies out)
  const handlePop = () => {
    if (isAnimating) return;

    if (items.length === 0) {
      setLogMessage('❌ STACK UNDERFLOW! Stack is empty (top = -1).');
      return;
    }

    const topItem = items[items.length - 1];
    setPoppedGhost({ value: topItem.value, address: topItem.address });
    setIsAnimating(true);

    // Mark popping
    setItems((prev) =>
      prev.map((it, i) => (i === prev.length - 1 ? { ...it, isPopping: true } : it))
    );
    setLogMessage(`📤 POP(): Extracted ${topItem.value} from top (${topIndex}). top decremented to ${topIndex - 1}.`);

    setTimeout(() => {
      setItems((prev) => prev.slice(0, -1));
      setPoppedGhost(null);
      setIsAnimating(false);
    }, 450);
  };

  const handleReset = () => {
    setItems([
      { id: 'item-1', value: 10, address: '0x7ffc01' },
      { id: 'item-2', value: 20, address: '0x7ffc05' },
      { id: 'item-3', value: 30, address: '0x7ffc09' }
    ]);
    setPoppedGhost(null);
    setLogMessage('Stack reset to initial sample state.');
  };

  return (
    <div className="w-full flex flex-col h-full bg-white select-none">
      {/* Visualizer Interactive Control Bar */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>LIFO Stack Memory Cylinder</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-border text-secondary">
            {mode === 'array' ? `Array [MAX=${maxCapacity}]` : 'Dynamic Linked Nodes'}
          </span>
        </div>

        {/* Action Controls for Any User Input */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 border border-border rounded-lg px-2 py-1 bg-white shadow-xs">
            <span className="text-[11px] text-muted font-mono font-bold">val:</span>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              placeholder="42"
              className="w-14 text-xs font-mono font-bold text-black bg-transparent focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => handlePush()}
            disabled={isAnimating || items.length >= maxCapacity}
            className="btn btn-outline-danger btn-sm font-bold"
            title="Push number box into stack"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Push (↓)</span>
          </button>

          <button
            onClick={handlePop}
            disabled={isAnimating || items.length === 0}
            className="btn btn-outline-dark btn-sm font-bold"
            title="Pop number box from top of stack"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Pop (↑)</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-outline-secondary btn-sm"
            title="Reset Stack"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Physics Animated Canvas */}
      <div className="flex-1 p-6 flex flex-col items-center justify-between min-h-[360px] bg-gradient-to-b from-white via-surface-subtle/30 to-surface relative overflow-hidden">
        {/* Popped Ghost Floating Animation */}
        {poppedGhost && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-fly-out">
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-600 text-white mb-1 shadow-red">
              ↑ POPPED [{poppedGhost.value}]
            </span>
            <div className="w-48 p-2.5 rounded-xl border-2 border-red-600 bg-red-50 text-red-700 font-mono font-bold text-center shadow-floating">
              {poppedGhost.value}
            </div>
          </div>
        )}

        {/* Memory Header / Status */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-muted mb-2 max-w-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>Stack Pointer (SP): <strong className="text-black font-bold">{topIndex >= 0 ? `index [${topIndex}]` : '-1 (NULL)'}</strong></span>
          </div>
          <div>
            <span>Occupancy: <strong className="text-red-600 font-bold">{items.length} / {maxCapacity}</strong></span>
          </div>
        </div>

        {/* Stack Physical Container Cylinder */}
        <div className="w-72 border-b-4 border-l-4 border-r-4 border-black rounded-b-2xl p-3 bg-white/90 backdrop-blur-sm flex flex-col-reverse gap-2 min-h-[220px] shadow-floating relative">
          {/* Base Plate Label */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted font-bold tracking-widest uppercase whitespace-nowrap">
            STACK BASE (index 0)
          </div>

          {/* Render Slots */}
          {Array.from({ length: maxCapacity }).map((_, idx) => {
            const hasItem = idx < items.length;
            const item = hasItem ? items[idx] : null;
            const isTop = idx === topIndex;

            if (!item) {
              return (
                <div
                  key={idx}
                  className="h-11 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 flex items-center justify-between px-3 text-zinc-300 font-mono text-xs"
                >
                  <span className="text-[10px] font-mono">[{idx}]</span>
                  <span className="text-[10px] italic">empty slot</span>
                  <span className="text-[10px]">0x---</span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className={`relative h-11 flex items-center justify-between px-3.5 rounded-xl border-2 transition-all duration-300 font-mono text-xs ${
                  item.isNew
                    ? 'animate-drop-in bg-red-50 border-red-600 text-red-950 shadow-red z-10'
                    : item.isPopping
                    ? 'opacity-40 scale-95 border-red-400 bg-red-100'
                    : isTop
                    ? 'bg-black text-white border-black shadow-card'
                    : 'bg-white text-black border-border hover:border-zinc-400'
                }`}
              >
                {/* Index badge */}
                <span className={`text-[10px] font-bold ${isTop ? 'text-red-400' : 'text-muted'}`}>
                  [{idx}]
                </span>

                {/* Main Value Number */}
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black tracking-tight">
                    {item.value}
                  </span>
                  {item.isNew && (
                    <span className="text-[9px] font-sans font-bold px-1 rounded bg-red-600 text-white">
                      NEW
                    </span>
                  )}
                </div>

                {/* Memory Address */}
                <span className={`text-[10px] font-mono ${isTop ? 'text-zinc-300' : 'text-muted'}`}>
                  {item.address}
                </span>

                {/* Animated TOP Pointer Indicator */}
                {isTop && !item.isPopping && (
                  <div className="absolute -right-28 top-1/2 -translate-y-1/2 flex items-center gap-1 font-bold text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-lg shadow-subtle animate-fade-in">
                    <ArrowLeft className="w-3.5 h-3.5 animate-pulse text-red-600" />
                    <span>TOP ({topIndex})</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="mt-4 text-xs font-mono text-muted flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-lg border border-border animate-fade-in">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>top = -1 (Stack is currently empty. Use <strong>Push</strong> above)</span>
          </div>
        )}
      </div>

      {/* Real-Time Action Log Strip */}
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <p className="text-xs font-mono text-black font-medium truncate">
          {logMessage}
        </p>
      </div>
    </div>
  );
}
