'use client';

import React, { useState } from 'react';
import { ASTVisualNode } from '@/lib/types';
import { Play, RotateCcw, Plus, Trash2, ArrowRight, Info } from 'lucide-react';

interface LinkedListVisualizerProps {
  nodes: ASTVisualNode[];
  activeLine?: number;
  highlightedNodeId?: string;
  onNodeClick?: (node: ASTVisualNode) => void;
}

export function LinkedListVisualizer({
  nodes: initialNodes,
  activeLine,
  highlightedNodeId,
  onNodeClick
}: LinkedListVisualizerProps) {
  const [nodes, setNodes] = useState<ASTVisualNode[]>(
    initialNodes && initialNodes.length > 0
      ? initialNodes
      : [
          { id: 'n1', value: 20, address: '0x1040', nextAddress: '0x1020', isHead: true },
          { id: 'n2', value: 10, address: '0x1020', nextAddress: '0x1060' },
          { id: 'n3', value: 30, address: '0x1060', nextAddress: '0x1080' },
          { id: 'n4', value: 40, address: '0x1080', nextAddress: 'NULL', isTail: true }
        ]
  );

  const [traversingIndex, setTraversingIndex] = useState<number | null>(null);
  const [newValueInput, setNewValueInput] = useState<string>('50');
  const [actionLog, setActionLog] = useState<string>('Linked List initialized. HEAD -> 20 -> 10 -> 30 -> 40 -> NULL');

  // Insert at Beginning (O(1))
  const handleInsertHead = () => {
    const val = parseInt(newValueInput, 10) || Math.floor(Math.random() * 90) + 10;
    const newAddr = `0x${(0x1000 + Math.floor(Math.random() * 4000)).toString(16)}`;
    const newHeadId = `node-${Date.now()}`;
    
    const oldHead = nodes[0];
    const newHead: ASTVisualNode = {
      id: newHeadId,
      value: val,
      address: newAddr,
      nextAddress: oldHead ? oldHead.address : 'NULL',
      isHead: true
    };

    const updatedNodes = [newHead, ...nodes.map(n => ({ ...n, isHead: false }))];
    setNodes(updatedNodes);
    setActionLog(`Allocated Node(${val}) at ${newAddr}. Updated HEAD -> ${val}. (O(1) Time)`);
  };

  // Insert at End (O(n))
  const handleInsertTail = () => {
    const val = parseInt(newValueInput, 10) || Math.floor(Math.random() * 90) + 10;
    const newAddr = `0x${(0x1000 + Math.floor(Math.random() * 4000)).toString(16)}`;
    const newTailId = `node-${Date.now()}`;

    if (nodes.length === 0) {
      setNodes([{ id: newTailId, value: val, address: newAddr, nextAddress: 'NULL', isHead: true, isTail: true }]);
      return;
    }

    const updated = nodes.map((n, idx) => {
      if (idx === nodes.length - 1) {
        return { ...n, nextAddress: newAddr, isTail: false };
      }
      return n;
    });

    updated.push({
      id: newTailId,
      value: val,
      address: newAddr,
      nextAddress: 'NULL',
      isTail: true
    });

    setNodes(updated);
    setActionLog(`Traversed to tail and appended Node(${val}) at ${newAddr}. (O(n) Time)`);
  };

  // Delete Head (O(1))
  const handleDeleteHead = () => {
    if (nodes.length === 0) {
      setActionLog('Underflow: Linked list is already empty.');
      return;
    }
    const deleted = nodes[0];
    const remaining = nodes.slice(1).map((n, idx) => ({ ...n, isHead: idx === 0 }));
    setNodes(remaining);
    setActionLog(`Freed memory at ${deleted.address} (Value: ${deleted.value}). HEAD moved to next node.`);
  };

  // Step-by-step traversal
  const handleStartTraversal = () => {
    setTraversingIndex(0);
    setActionLog(`Starting traversal from HEAD (${nodes[0]?.address || 'NULL'})...`);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < nodes.length) {
        setTraversingIndex(idx);
        setActionLog(`Visiting Node ${idx + 1}: Value = ${nodes[idx].value}, Address = ${nodes[idx].address}, Next = ${nodes[idx].nextAddress}`);
      } else {
        setTraversingIndex(null);
        setActionLog('Reached NULL terminator. Traversal complete.');
        clearInterval(interval);
      }
    }, 700);
  };

  const handleReset = () => {
    setNodes([
      { id: 'n1', value: 20, address: '0x1040', nextAddress: '0x1020', isHead: true },
      { id: 'n2', value: 10, address: '0x1020', nextAddress: '0x1060' },
      { id: 'n3', value: 30, address: '0x1060', nextAddress: '0x1080' },
      { id: 'n4', value: 40, address: '0x1080', nextAddress: 'NULL', isTail: true }
    ]);
    setTraversingIndex(null);
    setActionLog('Reset to default linked list state.');
  };

  return (
    <div className="w-full flex flex-col h-full bg-white select-none">
      {/* Visualizer Header Controls */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Data Structure:</span>
          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-subtle border border-border">
            Singly Linked List ({nodes.length} Nodes)
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 border border-border rounded-md px-1.5 py-0.5 bg-white">
            <span className="text-[11px] text-muted font-mono">val:</span>
            <input
              type="number"
              value={newValueInput}
              onChange={(e) => setNewValueInput(e.target.value)}
              className="w-12 text-xs font-mono text-primary bg-transparent focus:outline-none"
              placeholder="val"
            />
          </div>

          <button
            onClick={handleInsertHead}
            title="Insert at Head: O(1)"
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-primary text-white hover:bg-primary-hover transition shadow-subtle"
          >
            <Plus className="w-3 h-3" /> Insert Head
          </button>

          <button
            onClick={handleInsertTail}
            title="Insert at Tail: O(n)"
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-border text-primary border border-border transition"
          >
            <Plus className="w-3 h-3" /> Insert Tail
          </button>

          <button
            onClick={handleDeleteHead}
            title="Delete Head: O(1)"
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-rose-50 text-rose-600 border border-border transition"
          >
            <Trash2 className="w-3 h-3" /> Delete Head
          </button>

          <button
            onClick={handleStartTraversal}
            title="Traverse List"
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-surface-subtle hover:bg-border text-primary border border-border transition"
          >
            <Play className="w-3 h-3" /> Traverse
          </button>

          <button
            onClick={handleReset}
            title="Reset"
            className="p-1 text-muted hover:text-primary transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 p-6 overflow-x-auto overflow-y-auto flex items-center justify-start min-h-[220px]">
        {nodes.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-muted py-12">
            <p className="text-sm font-mono">HEAD → NULL (Empty Linked List)</p>
            <button
              onClick={handleInsertHead}
              className="mt-3 text-xs text-primary font-medium underline"
            >
              Add first node
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* HEAD Pointer */}
            <div className="flex flex-col items-center mr-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-accent-blue bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                HEAD
              </span>
              <div className="w-0.5 h-4 bg-accent-blue my-0.5"></div>
              <ArrowRight className="w-4 h-4 text-accent-blue rotate-90 -mt-1" />
            </div>

            {/* Nodes Sequence */}
            {nodes.map((node, index) => {
              const isCurrentTraversal = traversingIndex === index;
              const isHead = node.isHead || index === 0;

              return (
                <React.Fragment key={node.id}>
                  {/* Single Node Card */}
                  <div
                    onClick={() => onNodeClick && onNodeClick(node)}
                    className={`flex flex-col cursor-pointer transition-all duration-300 transform ${
                      isCurrentTraversal
                        ? 'scale-105 ring-2 ring-primary ring-offset-2'
                        : 'hover:-translate-y-1'
                    }`}
                  >
                    {/* Node Memory Address Badge */}
                    <div className="text-[9px] font-mono text-muted text-center mb-1">
                      {node.address || `0x${(0x1000 + index * 0x20).toString(16)}`}
                    </div>

                    {/* Node Structure Box: [ Data | Next Pointer ] */}
                    <div
                      className={`flex rounded-lg overflow-hidden border transition-shadow ${
                        isCurrentTraversal
                          ? 'border-primary bg-zinc-50 shadow-card'
                          : isHead
                          ? 'border-zinc-400 bg-white shadow-subtle'
                          : 'border-border bg-white shadow-subtle'
                      }`}
                    >
                      {/* Data compartment */}
                      <div className="w-14 h-14 flex flex-col items-center justify-center border-r border-border px-2">
                        <span className="text-[9px] font-mono text-muted uppercase">data</span>
                        <span className="text-sm font-bold font-mono text-primary">{node.value}</span>
                      </div>

                      {/* Next Pointer compartment */}
                      <div className="w-14 h-14 flex flex-col items-center justify-center px-1 bg-surface">
                        <span className="text-[9px] font-mono text-muted uppercase">next</span>
                        <div className="flex items-center justify-center mt-0.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-white"></div>
                          </div>
                        </div>
                        <span className="text-[8px] font-mono text-muted mt-0.5 truncate max-w-[48px]">
                          {node.nextAddress || (index === nodes.length - 1 ? 'NULL' : '0x...')}
                        </span>
                      </div>
                    </div>

                    {/* Role indicator */}
                    <div className="text-center mt-1">
                      {isHead && (
                        <span className="text-[9px] font-medium text-accent-blue">First Node</span>
                      )}
                      {node.isTail && (
                        <span className="text-[9px] font-medium text-muted">Last Node</span>
                      )}
                    </div>
                  </div>

                  {/* Arrow Link to Next Node or NULL */}
                  <div className="flex items-center text-muted px-1">
                    <div className="w-6 h-0.5 bg-primary"></div>
                    <ArrowRight className="w-4 h-4 text-primary -ml-1.5" />
                  </div>
                </React.Fragment>
              );
            })}

            {/* NULL Terminator Box */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-10 rounded border border-dashed border-border flex items-center justify-center bg-surface-subtle">
                <span className="text-xs font-mono font-bold text-muted">NULL</span>
              </div>
              <span className="text-[9px] font-mono text-muted mt-1">End of List</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time State Log */}
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-muted shrink-0" />
        <p className="text-xs font-mono text-secondary truncate">
          {actionLog}
        </p>
      </div>
    </div>
  );
}
