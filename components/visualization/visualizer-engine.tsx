'use client';

import React, { useState, useEffect } from 'react';
import { ASTProgramState, Experiment } from '@/lib/types';
import { LinkedListVisualizer } from './linked-list-visualizer';
import { StackVisualizer } from './stack-visualizer';
import { ParenthesesVisualizer } from './parentheses-visualizer';
import { TreeVisualizer } from './tree-visualizer';
import { GraphVisualizer } from './graph-visualizer';
import {
  Eye,
  Database,
  Cpu,
  ArrowRight,
  Check,
  Network,
  Layers,
  GitBranch,
  Binary,
  Share2,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  SkipForward,
  Sparkles,
  Info,
  ArrowDown
} from 'lucide-react';

interface VisualizerEngineProps {
  experiment: Experiment;
  astState: ASTProgramState;
  activeLine?: number;
}

export function VisualizerEngine({ experiment, astState, activeLine }: VisualizerEngineProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'memory'>('visual');

  // ==========================================
  // 1. QUEUE STATE & ANIMATIONS (FIFO)
  // ==========================================
  const [queueItems, setQueueItems] = useState<{ id: string; value: number; isNew?: boolean; isRemoving?: boolean }[]>([
    { id: 'q-1', value: 10 },
    { id: 'q-2', value: 20 },
    { id: 'q-3', value: 30 }
  ]);
  const [queueInput, setQueueInput] = useState<string>('40');
  const [queueLog, setQueueLog] = useState<string>('FIFO Queue ready. Enqueue at REAR, Dequeue from FRONT.');

  const handleEnqueue = () => {
    const val = parseInt(queueInput, 10) || Math.floor(Math.random() * 80) + 10;
    const newId = `q-${Date.now()}`;
    const newItem = { id: newId, value: val, isNew: true };

    setQueueItems(prev => [...prev, newItem]);
    setQueueLog(`📥 ENQUEUE(${val}): Inserted at REAR index [${queueItems.length}]. (O(1) Time)`);

    setTimeout(() => {
      setQueueItems(prev => prev.map(it => it.id === newId ? { ...it, isNew: false } : it));
    }, 500);
  };

  const handleDequeue = () => {
    if (queueItems.length === 0) {
      setQueueLog('❌ Queue Underflow! Queue is currently empty.');
      return;
    }
    const removed = queueItems[0];
    setQueueItems(prev => prev.map((it, idx) => idx === 0 ? { ...it, isRemoving: true } : it));
    setQueueLog(`📤 DEQUEUE(): Removed ${removed.value} from FRONT. Remaining elements shifted.`);

    setTimeout(() => {
      setQueueItems(prev => prev.slice(1));
    }, 400);
  };

  // ==========================================
  // 2. ARRAY & SORTING ANIMATION (Swapping Boxes)
  // ==========================================
  const [arrayElements, setArrayElements] = useState<{ id: string; value: number; isComparing?: boolean; isSwapping?: boolean }[]>([
    { id: 'a-1', value: 64 },
    { id: 'a-2', value: 25 },
    { id: 'a-3', value: 12 },
    { id: 'a-4', value: 22 },
    { id: 'a-5', value: 11 }
  ]);
  const [sortStep, setSortStep] = useState<number>(0);
  const [isAutoSorting, setIsAutoSorting] = useState<boolean>(false);
  const [sortLog, setSortLog] = useState<string>('Array initialized. Click "Next Step" to observe physical element swapping.');

  const handleNextSortStep = () => {
    const arr = [...arrayElements];
    let swapped = false;

    // Find next inverted adjacent pair
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].value > arr[i + 1].value) {
        // Highlight compare & swap
        const temp = arr[i];
        arr[i] = { ...arr[i + 1], isSwapping: true };
        arr[i + 1] = { ...temp, isSwapping: true };
        setArrayElements(arr);
        setSortStep(prev => prev + 1);
        setSortLog(`🔄 SWAP: ${temp.value} > ${arr[i].value} ➔ Swapped box at [${i}] with [${i + 1}].`);
        swapped = true;

        setTimeout(() => {
          setArrayElements(prev => prev.map(el => ({ ...el, isSwapping: false, isComparing: false })));
        }, 500);
        break;
      }
    }

    if (!swapped) {
      setSortLog('✓ Array is completely sorted in ascending order!');
      setIsAutoSorting(false);
    }
  };

  const handleResetSort = () => {
    setArrayElements([
      { id: 'a-1', value: 64 },
      { id: 'a-2', value: 25 },
      { id: 'a-3', value: 12 },
      { id: 'a-4', value: 22 },
      { id: 'a-5', value: 11 }
    ]);
    setSortStep(0);
    setIsAutoSorting(false);
    setSortLog('Reset array to unsorted state [64, 25, 12, 22, 11].');
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-subtle select-none">
      {/* Top Engine Tabs */}
      <div className="px-4 py-2.5 border-b border-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span className="text-xs font-black uppercase tracking-wider text-black font-mono">
            LIVE ANIMATED PROGRAM VISUALIZER
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition ${
              activeTab === 'visual'
                ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                : 'text-secondary hover:text-black'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visual Movement</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-md transition ${
              activeTab === 'memory'
                ? 'bg-red-50 text-red-600 border border-red-200 shadow-xs'
                : 'text-secondary hover:text-black'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>RAM Table</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Render Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {activeTab === 'visual' ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* 1. LINKED LIST ADT */}
            {experiment.visualizationType === 'linked_list' && (
              <LinkedListVisualizer
                nodes={astState.nodes}
                activeLine={activeLine}
              />
            )}

            {/* 2. STACK ARRAY ADT */}
            {experiment.visualizationType === 'stack_array' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="array"
                maxCapacity={6}
                activeLine={activeLine}
              />
            )}

            {/* 3. STACK LINKED LIST ADT */}
            {experiment.visualizationType === 'stack_linked_list' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="linked_list"
                maxCapacity={6}
                activeLine={activeLine}
              />
            )}

            {/* 4. BALANCED PARENTHESES */}
            {experiment.visualizationType === 'parentheses' && (
              <ParenthesesVisualizer />
            )}

            {/* 5. QUEUE FIFO (ARRAY & LINKED LIST) WITH SLIDING BOXES */}
            {(experiment.visualizationType === 'queue_array' || experiment.visualizationType === 'queue_linked_list') && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-white via-surface-subtle/30 to-surface min-h-[320px]">
                {/* Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black">FIFO Queue Pipeline</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                      {queueItems.length} Elements
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={queueInput}
                      onChange={(e) => setQueueInput(e.target.value)}
                      placeholder="40"
                      className="w-14 text-xs font-mono font-bold text-black px-2 py-1 bg-white border border-border rounded-lg"
                    />
                    <button
                      onClick={handleEnqueue}
                      className="btn btn-outline-danger btn-sm font-bold"
                    >
                      + Enqueue (Rear)
                    </button>
                    <button
                      onClick={handleDequeue}
                      disabled={queueItems.length === 0}
                      className="btn btn-outline-dark btn-sm font-bold"
                    >
                      - Dequeue (Front)
                    </button>
                  </div>
                </div>

                {/* Queue Conveyor Pipe */}
                <div className="my-6 flex items-center justify-center">
                  <div className="w-full max-w-xl border-4 border-black border-dashed rounded-3xl p-4 bg-white/90 shadow-card flex items-center justify-start gap-3 overflow-x-auto min-h-[120px]">
                    {queueItems.length === 0 ? (
                      <div className="w-full text-center text-xs font-mono text-muted py-4">
                        Queue is empty. Enqueue a number box to start.
                      </div>
                    ) : (
                      queueItems.map((item, idx) => {
                        const isFront = idx === 0;
                        const isRear = idx === queueItems.length - 1;

                        return (
                          <div
                            key={item.id}
                            className={`min-w-[85px] p-3 rounded-2xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-300 shadow-subtle ${
                              item.isNew
                                ? 'animate-slide-in-right bg-red-50 border-red-600 shadow-red'
                                : item.isRemoving
                                ? 'animate-slide-out-left bg-red-100 border-red-400 opacity-30'
                                : isFront
                                ? 'bg-black text-white border-black ring-2 ring-red-400'
                                : 'bg-white text-black border-border'
                            }`}
                          >
                            {isFront && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-red-600 text-white mb-1">
                                FRONT
                              </span>
                            )}
                            <span className="text-base font-black">
                              {item.value}
                            </span>
                            {isRear && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-white mt-1">
                                REAR
                              </span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="text-xs font-mono text-black bg-surface p-2.5 rounded-xl border border-border flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{queueLog}</span>
                </div>
              </div>
            )}

            {/* 6. ARRAY & SORTING WITH SWAPPING PHYSICAL BOXES */}
            {(experiment.visualizationType === 'insertion_sort' ||
              experiment.visualizationType === 'merge_sort' ||
              experiment.visualizationType === 'quick_sort' ||
              experiment.category.includes('Sorting')) && (
              <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-white via-surface-subtle/30 to-surface min-h-[340px]">
                {/* Header Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-black">Sorting Sequence (Element Swap Movement)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                      Step #{sortStep}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleNextSortStep}
                      className="btn btn-outline-danger btn-sm font-bold"
                    >
                      <span>Next Swap Step</span>
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleResetSort}
                      className="btn btn-outline-secondary btn-sm"
                      title="Reset Array"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Array Physical Boxes Container */}
                <div className="my-6 flex items-center justify-center gap-3">
                  {arrayElements.map((el, idx) => (
                    <div
                      key={el.id}
                      className={`relative flex flex-col items-center justify-center w-16 h-20 rounded-2xl border-2 font-mono transition-all duration-500 shadow-subtle ${
                        el.isSwapping
                          ? 'bg-red-50 border-red-600 text-red-950 scale-110 -translate-y-3 shadow-red ring-4 ring-red-200'
                          : 'bg-white border-black text-black hover:border-red-600'
                      }`}
                    >
                      <span className="text-[10px] text-muted font-bold mb-1">
                        [{idx}]
                      </span>
                      <span className="text-lg font-black tracking-tight">
                        {el.value}
                      </span>
                      {el.isSwapping && (
                        <span className="absolute -top-3 text-[9px] font-sans font-bold px-1 rounded bg-red-600 text-white">
                          SWAP
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-xs font-mono text-black bg-surface p-2.5 rounded-xl border border-border flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{sortLog}</span>
                </div>
              </div>
            )}

            {/* 7. BINARY SEARCH TREE (BST) & TREE HIERARCHY WITH FULL POINTER LINKS */}
            {(experiment.visualizationType === 'bst' ||
              experiment.category.includes('Tree') ||
              experiment.category.includes('Hierarchical')) && (
              <TreeVisualizer activeLine={activeLine} />
            )}

            {/* 8. DIJKSTRA, MST & GRAPH TRAVERSAL WITH 2D GEOMETRIC EDGES */}
            {(experiment.visualizationType === 'dijkstra' ||
              experiment.visualizationType === 'kruskal' ||
              experiment.visualizationType === 'prim' ||
              experiment.category.includes('Graph')) && (
              <GraphVisualizer activeLine={activeLine} />
            )}

            {/* 9. UNIVERSAL DYNAMIC MEMORY BOXES FALLBACK FOR ANY USER PROGRAM */}
            {((experiment.visualizationType as string) === 'none' || (experiment.visualizationType as string) === 'general') && (
              <div className="flex-1 p-6 flex flex-col justify-center items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Active Runtime Memory Variables & Registers
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {astState.variables && astState.variables.length > 0 ? (
                    astState.variables.map((v, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl border-2 border-black bg-white shadow-card font-mono text-center min-w-[110px] animate-fade-in hover:border-red-600"
                      >
                        <span className="text-[10px] text-muted uppercase block">{v.type} {v.name}</span>
                        <span className="text-lg font-black text-red-600 block mt-1">{String(v.value)}</span>
                        <span className="text-[9px] text-muted block mt-1">{v.address}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs font-mono text-muted text-center py-8">
                      Run the C program or step through code to inspect dynamic allocated RAM memory boxes.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MEMORY TABLE TAB */
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                Active Memory Call Stack & Heap Blocks
              </span>
              <span className="text-xs font-mono text-black font-bold">
                Call Stack: {astState.callStack.join(' ➔ ')}
              </span>
            </div>

            {astState.variables.length === 0 ? (
              <div className="text-center py-16 text-xs text-muted font-mono">
                No active variables currently in scope.
              </div>
            ) : (
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface border-b border-border text-muted">
                    <tr>
                      <th className="py-2.5 px-3">Variable</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Memory Address</th>
                      <th className="py-2.5 px-3">Current Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {astState.variables.map((v, i) => (
                      <tr key={i} className="hover:bg-surface-subtle transition">
                        <td className="py-2.5 px-3 font-bold text-black">{v.name}</td>
                        <td className="py-2.5 px-3 text-secondary">{v.type}</td>
                        <td className="py-2.5 px-3 text-muted">{v.address}</td>
                        <td className="py-2.5 px-3 font-black text-red-600">{String(v.value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
