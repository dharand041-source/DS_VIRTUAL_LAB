'use client';

import React, { useState } from 'react';
import { ASTProgramState, Experiment } from '@/lib/types';
import { LinkedListVisualizer } from './linked-list-visualizer';
import { StackVisualizer } from './stack-visualizer';
import { ParenthesesVisualizer } from './parentheses-visualizer';
import { Eye, Database, Cpu } from 'lucide-react';

interface VisualizerEngineProps {
  experiment: Experiment;
  astState: ASTProgramState;
  activeLine?: number;
}

export function VisualizerEngine({ experiment, astState, activeLine }: VisualizerEngineProps) {
  const [activeTab, setActiveTab] = useState<'visual' | 'memory'>('visual');

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Top Engine Tabs */}
      <div className="px-4 py-2 border-b border-border bg-white flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Live Program Visualizer
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
          <div className="flex-1 flex flex-col">
            {experiment.visualizationType === 'linked_list' && (
              <LinkedListVisualizer
                nodes={astState.nodes}
                activeLine={activeLine}
              />
            )}

            {experiment.visualizationType === 'stack_array' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="array"
                maxCapacity={5}
              />
            )}

            {experiment.visualizationType === 'stack_linked_list' && (
              <StackVisualizer
                initialItems={astState.stackItems}
                mode="linked_list"
              />
            )}

            {experiment.visualizationType === 'parentheses' && (
              <ParenthesesVisualizer />
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
