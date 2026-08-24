'use client';

import React, { useState } from 'react';
import { ASTProgramState, Experiment } from '@/lib/types';
import { LinkedListVisualizer } from './linked-list-visualizer';
import { StackVisualizer } from './stack-visualizer';
import { ParenthesesVisualizer } from './parentheses-visualizer';
import { Eye, Database, Cpu, ArrowRight, Check, Network, Layers, GitBranch, Binary, Share2 } from 'lucide-react';

interface VisualizerEngineProps {
  experiment: Experiment;
  astState: ASTProgramState;
  activeLine?: number;
}

export function VisualizerEngine({ experiment, astState, activeLine }: VisualizerEngineProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'memory'>('visual');

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg overflow-hidden shadow-subtle select-none">
      {/* Top Engine Tabs */}
      <div className="px-4 py-2 border-b border-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Live Program Visualizer: {experiment.shortTitle}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface-subtle p-0.5 rounded-md border border-border">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition ${
              activeTab === 'visual'
                ? 'bg-white text-primary shadow-subtle font-semibold'
                : 'text-muted hover:text-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Visual State
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition ${
              activeTab === 'memory'
                ? 'bg-white text-primary shadow-subtle font-semibold'
                : 'text-muted hover:text-primary'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Memory Table
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        {activeTab === 'visual' ? (
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            {/* Linked List */}
            {experiment.visualizationType === 'linked_list' && (
              <LinkedListVisualizer
                nodes={astState.nodes}
                activeLine={activeLine}
              />
            )}

            {/* Stack Array */}
            {experiment.visualizationType === 'stack_array' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="array"
                maxCapacity={5}
              />
            )}

            {/* Stack Linked List */}
            {experiment.visualizationType === 'stack_linked_list' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="linked_list"
              />
            )}

            {/* Balanced Parentheses */}
            {experiment.visualizationType === 'parentheses' && (
              <ParenthesesVisualizer />
            )}

            {/* Queue (Array & Linked List) */}
            {(experiment.visualizationType === 'queue_array' || experiment.visualizationType === 'queue_linked_list') && (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                  FIFO Queue Pipeline (Front &rarr; Rear)
                </span>
                <div className="w-full max-w-md border-2 border-primary border-dashed rounded-2xl p-4 bg-surface/30 shadow-card flex items-center justify-start gap-2 overflow-x-auto">
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
                    [10, 20, 30].map((val, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 min-w-[70px] p-2.5 rounded-xl border flex flex-col items-center text-xs font-mono shadow-subtle bg-white border-border`}
                      >
                        {idx === 0 && (
                          <span className="text-[8px] font-bold uppercase text-accent-blue bg-blue-100 px-1 rounded mb-1">
                            FRONT
                          </span>
                        )}
                        <span className="text-sm font-bold text-primary">{val}</span>
                        {idx === 2 && (
                          <span className="text-[8px] font-bold uppercase text-accent-emerald bg-emerald-100 px-1 rounded mt-1">
                            REAR
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Binary Search Tree */}
            {experiment.visualizationType === 'bst' && (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                  Binary Search Tree Hierarchy (Left &lt; Root &lt; Right)
                </span>
                <div className="flex flex-col items-center gap-4">
                  {/* Root Node */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white font-mono font-bold text-sm flex items-center justify-center shadow-card">
                      50
                    </div>
                    <span className="text-[9px] font-mono text-muted mt-0.5">0x4010 (ROOT)</span>
                  </div>

                  {/* Level 1 Children */}
                  <div className="flex items-center gap-16">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-accent-blue font-mono font-bold text-xs flex items-center justify-center border border-blue-300">
                        30
                      </div>
                      <span className="text-[9px] text-muted mt-0.5">Left Child</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-accent-emerald font-mono font-bold text-xs flex items-center justify-center border border-emerald-300">
                        70
                      </div>
                      <span className="text-[9px] text-muted mt-0.5">Right Child</span>
                    </div>
                  </div>

                  {/* Level 2 Leaves */}
                  <div className="flex items-center gap-8 text-[11px] font-mono">
                    <span className="px-2 py-1 rounded bg-surface border border-border">20 (Left-Left)</span>
                    <span className="px-2 py-1 rounded bg-surface border border-border">40 (Left-Right)</span>
                    <span className="px-2 py-1 rounded bg-surface border border-border">60 (Right-Left)</span>
                    <span className="px-2 py-1 rounded bg-surface border border-border">80 (Right-Right)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dijkstra Graph */}
            {experiment.visualizationType === 'dijkstra' && (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                  Dijkstra Shortest Path Distance Relaxation
                </span>
                <div className="grid grid-cols-5 gap-2 w-full max-w-lg mb-4">
                  {[
                    { v: 0, d: 0, note: 'Source' },
                    { v: 1, d: 4, note: 'Edge (0,1)=4' },
                    { v: 2, d: 12, note: 'Via V1' },
                    { v: 3, d: 17, note: 'Via V2' },
                    { v: 4, d: 8, note: 'Edge (0,4)=8' }
                  ].map((node) => (
                    <div key={node.v} className="p-3 bg-white rounded-xl border border-border text-center font-mono shadow-subtle">
                      <span className="text-[9px] text-muted block">V[{node.v}]</span>
                      <span className="text-base font-bold text-primary block mt-0.5">{node.d}</span>
                      <span className="text-[8px] text-secondary block mt-1">{node.note}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted">
                  Greedy selection: Vertex 0 &rarr; Vertex 1 &rarr; Vertex 4 &rarr; Vertex 2 &rarr; Vertex 3
                </span>
              </div>
            )}

            {/* MST (Kruskal / Prim) */}
            {(experiment.visualizationType === 'kruskal' || experiment.visualizationType === 'prim') && (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                  Minimum Spanning Tree (MST Edges & Weights)
                </span>
                <div className="flex flex-wrap items-center justify-center gap-3 max-w-md">
                  {[
                    { edge: '0 - 1', w: 2 },
                    { edge: '1 - 2', w: 3 },
                    { edge: '0 - 3', w: 6 },
                    { edge: '1 - 4', w: 5 }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-border font-mono shadow-subtle text-center min-w-[90px]">
                      <span className="text-xs font-bold text-primary">{item.edge}</span>
                      <span className="text-[10px] text-accent-emerald font-bold block mt-1">Weight: {item.w}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 px-4 py-2 rounded-xl bg-surface border border-border text-xs font-mono font-bold text-primary">
                  Total MST Weight: 16 (4 Edges for 5 Vertices)
                </div>
              </div>
            )}

            {/* Sorting (Insertion / Merge / Quick) */}
            {(experiment.visualizationType === 'insertion_sort' ||
              experiment.visualizationType === 'merge_sort' ||
              experiment.visualizationType === 'quick_sort') && (
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
                  Sorting Sequence & Array Elements
                </span>
                <div className="flex items-end justify-center gap-2 h-36 w-full max-w-md p-4 bg-surface/30 rounded-2xl border border-border">
                  {[
                    { val: 11, h: 25 },
                    { val: 12, h: 35 },
                    { val: 22, h: 55 },
                    { val: 25, h: 65 },
                    { val: 64, h: 100 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-mono font-bold text-primary">{bar.val}</span>
                      <div
                        className="w-full bg-primary rounded-t-lg transition-all duration-500 shadow-subtle"
                        style={{ height: `${bar.h}%` }}
                      />
                      <span className="text-[9px] font-mono text-muted">[{idx}]</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted mt-3">
                  Sorted Ascending Array Elements [11, 12, 22, 25, 64]
                </span>
              </div>
            )}

            {/* Recursion / Structures / Pointers / Project Default View */}
            {(experiment.visualizationType === 'recursion' ||
              experiment.visualizationType === 'structures' ||
              experiment.visualizationType === 'pointers' ||
              experiment.visualizationType === 'project') && (
              <div className="flex-1 flex flex-col justify-center py-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted mb-3 text-center">
                  RAM Memory Offsets & Scope Variables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto w-full">
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
          </div>
        ) : (
          /* Memory Table View */
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Runtime Stack & Heap Variables
              </span>
              <span className="text-[11px] font-mono text-muted">
                Call Stack: {astState.callStack.join(' -> ')}
              </span>
            </div>

            {astState.variables.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted font-mono">
                No local variables declared in current scope.
              </div>
            ) : (
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface border-b border-border text-muted">
                    <tr>
                      <th className="py-2 px-3">Variable</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Address</th>
                      <th className="py-2 px-3">Current Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {astState.variables.map((v, i) => (
                      <tr key={i} className="hover:bg-surface-subtle transition">
                        <td className="py-2 px-3 font-bold text-primary">{v.name}</td>
                        <td className="py-2 px-3 text-secondary">{v.type}</td>
                        <td className="py-2 px-3 text-muted">{v.address}</td>
                        <td className="py-2 px-3 font-semibold text-accent-blue">{String(v.value)}</td>
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
