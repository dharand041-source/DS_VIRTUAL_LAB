'use client';

import React, { useState, useEffect } from 'react';
import { ASTVisualNode } from '@/lib/types';
import {
  Play,
  RotateCcw,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  Search,
  CheckCircle2,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LinkedListVisualizerProps {
  nodes?: ASTVisualNode[];
  activeLine?: number;
  highlightedNodeId?: string;
  onNodeClick?: (node: ASTVisualNode) => void;
}

interface AnimatedLLNode extends ASTVisualNode {
  isNew?: boolean;
  isDeleting?: boolean;
}

export function LinkedListVisualizer({
  nodes: initialNodes,
  activeLine,
  highlightedNodeId,
  onNodeClick
}: LinkedListVisualizerProps) {
  const [nodes, setNodes] = useState<AnimatedLLNode[]>([
    { id: 'n1', value: 20, address: '0x1040', nextAddress: '0x1020', isHead: true },
    { id: 'n2', value: 10, address: '0x1020', nextAddress: '0x1060' },
    { id: 'n3', value: 30, address: '0x1060', nextAddress: '0x1080' },
    { id: 'n4', value: 40, address: '0x1080', nextAddress: 'NULL', isTail: true }
  ]);

  const [traversingIndex, setTraversingIndex] = useState<number | null>(null);
  const [newValueInput, setNewValueInput] = useState<string>('50');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFoundIndex, setSearchFoundIndex] = useState<number | null>(null);
  const [actionLog, setActionLog] = useState<string>(
    'Singly Linked List initialized. Dynamic Heap Allocation via struct Node*.'
  );

  // Sync with code AST state if provided
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes.map((n) => ({ ...n })));
    }
  }, [initialNodes]);

  // Insert at Beginning (O(1)) with Drop-in Animation
  const handleInsertHead = (customVal?: number) => {
    const val = customVal !== undefined ? customVal : (parseInt(newValueInput, 10) || Math.floor(Math.random() * 90) + 10);
    const newAddr = `0x${(0x1000 + Math.floor(Math.random() * 4000)).toString(16)}`;
    const newHeadId = `node-${Date.now()}`;

    const oldHead = nodes[0];
    const newHead: AnimatedLLNode = {
      id: newHeadId,
      value: val,
      address: newAddr,
      nextAddress: oldHead ? oldHead.address : 'NULL',
      isHead: true,
      isNew: true
    };

    const updatedNodes = [newHead, ...nodes.map((n) => ({ ...n, isHead: false }))];
    setNodes(updatedNodes);
    setActionLog(`✨ INSERT_HEAD(${val}): Allocated heap node at ${newAddr}. HEAD -> ${val} (O(1) Time)`);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === newHeadId ? { ...n, isNew: false } : n))
      );
    }, 600);
  };

  // Insert at End (O(n)) with Drop-in Animation
  const handleInsertTail = (customVal?: number) => {
    const val = customVal !== undefined ? customVal : (parseInt(newValueInput, 10) || Math.floor(Math.random() * 90) + 10);
    const newAddr = `0x${(0x1000 + Math.floor(Math.random() * 4000)).toString(16)}`;
    const newTailId = `node-${Date.now()}`;

    if (nodes.length === 0) {
      setNodes([
        {
          id: newTailId,
          value: val,
          address: newAddr,
          nextAddress: 'NULL',
          isHead: true,
          isTail: true,
          isNew: true
        }
      ]);
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
      isTail: true,
      isNew: true
    });

    setNodes(updated);
    setActionLog(`✨ INSERT_TAIL(${val}): Traversed to tail and appended Node(${val}) at ${newAddr}. (O(n) Time)`);

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => (n.id === newTailId ? { ...n, isNew: false } : n))
      );
    }, 600);
  };

  // Delete Head with Fly-out Animation
  const handleDeleteHead = () => {
    if (nodes.length === 0) {
      setActionLog('❌ Underflow: Linked list is already empty.');
      return;
    }

    const deleted = nodes[0];
    setNodes((prev) =>
      prev.map((n, i) => (i === 0 ? { ...n, isDeleting: true } : n))
    );
    setActionLog(`🗑️ DELETE_HEAD: Freeing memory at ${deleted.address} (Value: ${deleted.value}). HEAD moved to next.`);

    setTimeout(() => {
      const remaining = nodes
        .slice(1)
        .map((n, idx) => ({ ...n, isHead: idx === 0, isDeleting: false }));
      setNodes(remaining);
    }, 400);
  };

  // Step-by-Step Traversal Animation
  const handleStartTraversal = () => {
    if (nodes.length === 0) return;
    setTraversingIndex(0);
    setActionLog(`🔍 Traversal: Starting at HEAD Node(${nodes[0].value}) at ${nodes[0].address}...`);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < nodes.length) {
        setTraversingIndex(current);
        setActionLog(
          `🔍 Traversal: Advanced to Node(${nodes[current].value}) via next pointer ${nodes[current].address}...`
        );
      } else {
        clearInterval(interval);
        setTraversingIndex(null);
        setActionLog(`✓ Traversal Complete: Reached NULL (End of Singly Linked List).`);
      }
    }, 800);
  };

  // Search Node by value
  const handleSearch = () => {
    const target = parseInt(searchQuery, 10);
    if (isNaN(target)) return;

    let foundIdx = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].value === target) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx >= 0) {
      setSearchFoundIndex(foundIdx);
      setActionLog(`🎯 Found value ${target} at Node[${foundIdx}] with Address ${nodes[foundIdx].address}!`);
      setTimeout(() => setSearchFoundIndex(null), 2500);
    } else {
      setActionLog(`❌ Value ${target} not found in linked list.`);
    }
  };

  const handleReset = () => {
    setNodes([
      { id: 'n1', value: 20, address: '0x1040', nextAddress: '0x1020', isHead: true },
      { id: 'n2', value: 10, address: '0x1020', nextAddress: '0x1060' },
      { id: 'n3', value: 30, address: '0x1060', nextAddress: '0x1080' },
      { id: 'n4', value: 40, address: '0x1080', nextAddress: 'NULL', isTail: true }
    ]);
    setTraversingIndex(null);
    setActionLog('Linked List reset to default state.');
  };

  return (
    <div className="w-full flex flex-col h-full bg-white select-none">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>Singly Linked List Memory Pipeline</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-border text-secondary">
            {nodes.length} Nodes in Heap
          </span>
        </div>

        {/* Action Controls for User Inputs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 border border-border rounded-lg px-2 py-1 bg-white shadow-xs">
            <span className="text-[11px] text-muted font-mono font-bold">val:</span>
            <input
              type="number"
              value={newValueInput}
              onChange={(e) => setNewValueInput(e.target.value)}
              placeholder="50"
              className="w-12 text-xs font-mono font-bold text-black bg-transparent focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => handleInsertHead()}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-red"
            title="Insert Node at Head (O(1))"
          >
            <Plus className="w-3 h-3" />
            <span>+ Head</span>
          </button>

          <button
            onClick={() => handleInsertTail()}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 transition shadow-subtle"
            title="Insert Node at Tail (O(n))"
          >
            <Plus className="w-3 h-3" />
            <span>+ Tail</span>
          </button>

          <button
            onClick={handleDeleteHead}
            disabled={nodes.length === 0}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-border bg-white text-black hover:bg-red-50 hover:text-red-600 transition shadow-subtle disabled:opacity-50"
            title="Delete Head Node (O(1))"
          >
            <Trash2 className="w-3 h-3" />
            <span>- Head</span>
          </button>

          <button
            onClick={handleStartTraversal}
            disabled={nodes.length === 0 || traversingIndex !== null}
            className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-black bg-white text-black hover:bg-black hover:text-white transition shadow-subtle disabled:opacity-50"
            title="Step-by-step traverse through nodes"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Traverse</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-muted hover:text-black rounded-lg border border-border bg-white transition shadow-subtle"
            title="Reset Linked List"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Linked List Visual Canvas */}
      <div className="flex-1 p-6 flex flex-col justify-center min-h-[300px] overflow-x-auto bg-gradient-to-b from-white via-surface-subtle/30 to-surface relative">
        {nodes.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <span className="text-sm font-mono text-muted">HEAD ➔ NULL (Empty List)</span>
            <p className="text-xs text-secondary">Use "+ Head" or "+ Tail" to allocate dynamic node boxes in RAM.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 min-w-max py-8 px-4">
            {/* HEAD Pointer Label */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-xs font-black font-mono px-2 py-1 rounded-lg bg-black text-white shadow-subtle">
                HEAD
              </span>
              <div className="w-0.5 h-4 bg-black my-0.5"></div>
              <ArrowRight className="w-4 h-4 text-black rotate-90" />
            </div>

            {/* Render Nodes in Sequence */}
            {nodes.map((node, index) => {
              const isTraversing = traversingIndex === index;
              const isFound = searchFoundIndex === index;

              return (
                <React.Fragment key={node.id}>
                  {/* Node Box */}
                  <div
                    className={`relative flex items-stretch rounded-2xl border-2 shadow-card overflow-hidden transition-all duration-300 ${
                      node.isNew
                        ? 'animate-drop-in bg-red-50 border-red-600 shadow-red scale-105'
                        : node.isDeleting
                        ? 'animate-fly-out border-red-400 bg-red-100'
                        : isFound
                        ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-110'
                        : isTraversing
                        ? 'bg-red-50 border-red-600 ring-4 ring-red-200 scale-105'
                        : 'bg-white border-black hover:border-red-600'
                    }`}
                  >
                    {/* Animated Traversal PTR Beacon */}
                    {isTraversing && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 animate-pulse">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                          PTR
                        </span>
                        <div className="w-0.5 h-2 bg-red-600"></div>
                      </div>
                    )}

                    {/* Data Compartment */}
                    <div className="p-3 min-w-[70px] text-center border-r border-border bg-white flex flex-col justify-center">
                      <span className="text-[9px] font-mono uppercase text-muted block mb-0.5">
                        DATA
                      </span>
                      <span className="text-base font-black font-mono text-black">
                        {node.value}
                      </span>
                    </div>

                    {/* Next Pointer Compartment */}
                    <div className="p-3 min-w-[75px] text-center bg-surface flex flex-col justify-center">
                      <span className="text-[9px] font-mono uppercase text-muted block mb-0.5">
                        NEXT
                      </span>
                      <span className="text-[11px] font-mono font-bold text-red-600">
                        {node.nextAddress}
                      </span>
                    </div>

                    {/* Heap Memory Address Badge */}
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted whitespace-nowrap">
                      {node.address}
                    </div>
                  </div>

                  {/* Arrow to Next Node */}
                  <div className="flex items-center px-1 text-black shrink-0">
                    <div className="w-5 h-0.5 bg-black"></div>
                    <ArrowRight className="w-4 h-4 text-black -ml-1" />
                  </div>
                </React.Fragment>
              );
            })}

            {/* NULL Terminator */}
            <div className="flex flex-col items-center shrink-0">
              <span className="text-xs font-mono font-black px-2.5 py-1.5 rounded-xl bg-zinc-200 text-zinc-700 border border-zinc-300">
                NULL
              </span>
              <span className="text-[9px] font-mono text-muted mt-1">0x0</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-Time Action Log Strip */}
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <p className="text-xs font-mono text-black font-medium truncate">
          {actionLog}
        </p>
      </div>
    </div>
  );
}
