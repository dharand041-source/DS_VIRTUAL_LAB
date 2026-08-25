'use client';

import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  GitBranch,
  CheckCircle2,
  Info,
  Layers
} from 'lucide-react';

interface TreeNodeConfig {
  id: string;
  val: number;
  label: string;
  address: string;
  x: number;
  y: number;
  parentId?: string;
  isRoot?: boolean;
}

const TREE_NODES: TreeNodeConfig[] = [
  // Level 0 (Root)
  { id: '50', val: 50, label: 'ROOT', address: '0x1000', x: 320, y: 48, isRoot: true },
  // Level 1 (Children)
  { id: '30', val: 30, label: '< left', address: '0x1020', x: 180, y: 145, parentId: '50' },
  { id: '70', val: 70, label: 'right >', address: '0x1080', x: 460, y: 145, parentId: '50' },
  // Level 2 (Leaves)
  { id: '20', val: 20, label: 'leaf', address: '0x1040', x: 110, y: 250, parentId: '30' },
  { id: '40', val: 40, label: 'leaf', address: '0x1060', x: 250, y: 250, parentId: '30' },
  { id: '60', val: 60, label: 'leaf', address: '0x10A0', x: 390, y: 250, parentId: '70' },
  { id: '80', val: 80, label: 'leaf', address: '0x10C0', x: 530, y: 250, parentId: '70' }
];

const TREE_EDGES = [
  { from: '50', to: '30', label: 'root->left' },
  { from: '50', to: '70', label: 'root->right' },
  { from: '30', to: '20', label: 'left->left' },
  { from: '30', to: '40', label: 'left->right' },
  { from: '70', to: '60', label: 'right->left' },
  { from: '70', to: '80', label: 'right->right' }
];

export function TreeVisualizer({ activeLine }: { activeLine?: number }) {
  const [inputVal, setInputVal] = useState<string>('30');
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [activeEdges, setActiveEdges] = useState<string[]>([]);
  const [traversalSequence, setTraversalSequence] = useState<number[]>([]);
  const [currentStepText, setCurrentStepText] = useState<string>(
    'Binary Search Tree (BST) visualizer ready. Nodes connected with pointer links (left*, right*).'
  );
  const [isTraversing, setIsTraversing] = useState<boolean>(false);

  // Search in BST with step-by-step branch animation
  const handleSearch = async () => {
    const target = parseInt(inputVal, 10);
    if (isNaN(target)) return;

    setIsTraversing(true);
    setTraversalSequence([]);
    setActiveEdges([]);
    setCurrentStepText(`🔍 BST Search: Evaluating Root (50) for target ${target}...`);
    setActiveNodeId('50');

    await new Promise(r => setTimeout(r, 700));

    if (target === 50) {
      setCurrentStepText(`🎯 Target ${target} found at ROOT node (0x1000)! O(1) comparison.`);
      setIsTraversing(false);
      return;
    }

    if (target < 50) {
      setActiveEdges(['50-30']);
      setCurrentStepText(`← ${target} < 50: Traversing root->left pointer to Node 30...`);
      await new Promise(r => setTimeout(r, 700));
      setActiveNodeId('30');

      if (target === 30) {
        setCurrentStepText(`🎯 Target ${target} matched at Left Child (0x1020)!`);
        setIsTraversing(false);
        return;
      }

      if (target < 30) {
        setActiveEdges(['50-30', '30-20']);
        setCurrentStepText(`← ${target} < 30: Traversing left->left pointer to Node 20...`);
        await new Promise(r => setTimeout(r, 700));
        setActiveNodeId('20');
        setCurrentStepText(target === 20 ? `🎯 Target 20 matched at Leaf (0x1040)!` : `❌ Value ${target} not in tree. Reached NULL.`);
      } else {
        setActiveEdges(['50-30', '30-40']);
        setCurrentStepText(`→ ${target} > 30: Traversing left->right pointer to Node 40...`);
        await new Promise(r => setTimeout(r, 700));
        setActiveNodeId('40');
        setCurrentStepText(target === 40 ? `🎯 Target 40 matched at Leaf (0x1060)!` : `❌ Value ${target} not in tree. Reached NULL.`);
      }
    } else {
      setActiveEdges(['50-70']);
      setCurrentStepText(`→ ${target} > 50: Traversing root->right pointer to Node 70...`);
      await new Promise(r => setTimeout(r, 700));
      setActiveNodeId('70');

      if (target === 70) {
        setCurrentStepText(`🎯 Target ${target} matched at Right Child (0x1080)!`);
        setIsTraversing(false);
        return;
      }

      if (target < 70) {
        setActiveEdges(['50-70', '70-60']);
        setCurrentStepText(`← ${target} < 70: Traversing right->left pointer to Node 60...`);
        await new Promise(r => setTimeout(r, 700));
        setActiveNodeId('60');
        setCurrentStepText(target === 60 ? `🎯 Target 60 matched at Leaf (0x10A0)!` : `❌ Value ${target} not in tree.`);
      } else {
        setActiveEdges(['50-70', '70-80']);
        setCurrentStepText(`→ ${target} > 70: Traversing right->right pointer to Node 80...`);
        await new Promise(r => setTimeout(r, 700));
        setActiveNodeId('80');
        setCurrentStepText(target === 80 ? `🎯 Target 80 matched at Leaf (0x10C0)!` : `❌ Value ${target} not in tree.`);
      }
    }

    setIsTraversing(false);
  };

  // Traversals: Inorder (Left, Root, Right), Preorder (Root, Left, Right), Postorder (Left, Right, Root)
  const runTraversal = async (type: 'inorder' | 'preorder' | 'postorder') => {
    setIsTraversing(true);
    setActiveEdges([]);
    let order: { id: string; val: number }[] = [];

    if (type === 'inorder') {
      order = [
        { id: '20', val: 20 },
        { id: '30', val: 30 },
        { id: '40', val: 40 },
        { id: '50', val: 50 },
        { id: '60', val: 60 },
        { id: '70', val: 70 },
        { id: '80', val: 80 }
      ];
      setCurrentStepText('Running INORDER Traversal (Left ➔ Root ➔ Right) ➔ Produces strictly sorted ascending order [20, 30, 40, 50, 60, 70, 80]!');
    } else if (type === 'preorder') {
      order = [
        { id: '50', val: 50 },
        { id: '30', val: 30 },
        { id: '20', val: 20 },
        { id: '40', val: 40 },
        { id: '70', val: 70 },
        { id: '60', val: 60 },
        { id: '80', val: 80 }
      ];
      setCurrentStepText('Running PREORDER Traversal (Root ➔ Left ➔ Right) ➔ [50, 30, 20, 40, 70, 60, 80].');
    } else {
      order = [
        { id: '20', val: 20 },
        { id: '40', val: 40 },
        { id: '30', val: 30 },
        { id: '60', val: 60 },
        { id: '80', val: 80 },
        { id: '70', val: 70 },
        { id: '50', val: 50 }
      ];
      setCurrentStepText('Running POSTORDER Traversal (Left ➔ Right ➔ Root) ➔ [20, 40, 30, 60, 80, 70, 50].');
    }

    const seq: number[] = [];
    for (const step of order) {
      setActiveNodeId(step.id);
      seq.push(step.val);
      setTraversalSequence([...seq]);
      await new Promise(r => setTimeout(r, 600));
    }

    setActiveNodeId(null);
    setIsTraversing(false);
  };

  const handleReset = () => {
    setActiveNodeId(null);
    setActiveEdges([]);
    setTraversalSequence([]);
    setCurrentStepText('Reset BST to initial state.');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-white via-surface-subtle/30 to-surface min-h-[460px] select-none">
      {/* Top Header & Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-black block">Binary Search Tree (Parent ➔ Child Pointer Structure)</span>
            <span className="text-[10px] text-muted font-mono">struct TreeNode &#123; int data; struct TreeNode *left, *right; &#125;;</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="30"
            className="w-16 text-xs font-mono font-bold text-black px-2.5 py-1.5 bg-white border border-border rounded-lg shadow-xs focus:ring-1 focus:ring-red-500 focus:outline-hidden"
          />

          <button
            onClick={handleSearch}
            disabled={isTraversing}
            className="btn btn-outline-danger btn-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Path</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-outline-secondary btn-sm"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Traversal Algorithm Toolstrip */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-border/60 bg-surface/50 px-3 rounded-xl my-2">
        <span className="text-[11px] font-bold text-black font-mono">
          Traversals:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => runTraversal('inorder')}
            disabled={isTraversing}
            className="btn btn-outline-primary btn-sm"
          >
            Inorder (L-Root-R)
          </button>
          <button
            onClick={() => runTraversal('preorder')}
            disabled={isTraversing}
            className="btn btn-outline-success btn-sm"
          >
            Preorder (Root-L-R)
          </button>
          <button
            onClick={() => runTraversal('postorder')}
            disabled={isTraversing}
            className="btn btn-outline-warning btn-sm"
          >
            Postorder (L-R-Root)
          </button>
        </div>
      </div>

      {/* 100% Neatly Arranged Unified SVG Tree Canvas */}
      <div className="w-full my-2 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-border rounded-2xl p-2 shadow-subtle">
          <svg
            viewBox="0 0 640 310"
            className="w-full h-auto max-h-[300px]"
            style={{ display: 'block' }}
          >
            <defs>
              {/* Drop Shadow for Nodes */}
              <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
              <filter id="activeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#DC2626" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Render Precise Branch Connector Lines */}
            {TREE_EDGES.map((edge) => {
              const fromNode = TREE_NODES.find(n => n.id === edge.from)!;
              const toNode = TREE_NODES.find(n => n.id === edge.to)!;
              const edgeKey = `${edge.from}-${edge.to}`;
              const isActive = activeEdges.includes(edgeKey);

              const midX = (fromNode.x + toNode.x) / 2;
              const midY = (fromNode.y + toNode.y) / 2;

              return (
                <g key={edgeKey}>
                  {/* Clean Connecting Pointer Line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isActive ? '#DC2626' : '#94A3B8'}
                    strokeWidth={isActive ? 3.5 : 2}
                    strokeDasharray={isActive ? '4 2' : 'none'}
                    className="transition-all duration-300"
                  />

                  {/* Pointer Label Pill Badge */}
                  <rect
                    x={midX - 24}
                    y={midY - 8}
                    width={48}
                    height={16}
                    rx={8}
                    fill="#FFFFFF"
                    stroke={isActive ? '#DC2626' : '#CBD5E1'}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fontSize="8"
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fontWeight="bold"
                    fill={isActive ? '#DC2626' : '#64748B'}
                  >
                    {edge.label.split('->')[1] || 'ptr*'}
                  </text>
                </g>
              );
            })}

            {/* Render Perfectly Centered Tree Nodes */}
            {TREE_NODES.map((node) => {
              const isActive = activeNodeId === node.id;
              const isRoot = node.isRoot;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => {
                    setActiveNodeId(node.id);
                    setCurrentStepText(`Node (${node.val}) selected at RAM Address ${node.address}. Data: ${node.val}, Type: struct TreeNode.`);
                  }}
                >
                  {/* Outer Glowing Ring for Active State */}
                  {isActive && (
                    <circle
                      r={isRoot ? 32 : 28}
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth={3}
                      className="animate-ping opacity-40"
                    />
                  )}

                  {/* Node Background Box */}
                  <rect
                    x={isRoot ? -28 : -24}
                    y={isRoot ? -28 : -24}
                    width={isRoot ? 56 : 48}
                    height={isRoot ? 56 : 48}
                    rx={14}
                    fill={isActive ? '#DC2626' : isRoot ? '#000000' : '#FFFFFF'}
                    stroke={isActive ? '#DC2626' : isRoot ? '#000000' : '#475569'}
                    strokeWidth={isActive ? 3 : 2}
                    filter={isActive ? 'url(#activeShadow)' : 'url(#nodeShadow)'}
                    className="transition-all duration-300"
                  />

                  {/* Node Value */}
                  <text
                    x={0}
                    y={-2}
                    textAnchor="middle"
                    fontSize={isRoot ? 16 : 14}
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fontWeight="900"
                    fill={isActive || isRoot ? '#FFFFFF' : '#000000'}
                  >
                    {node.val}
                  </text>

                  {/* Role Tag & Memory Address */}
                  <text
                    x={0}
                    y={12}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    fill={isActive || isRoot ? '#E2E8F0' : '#64748B'}
                  >
                    {node.label}
                  </text>

                  <text
                    x={0}
                    y={20}
                    textAnchor="middle"
                    fontSize={6.5}
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fill={isActive || isRoot ? '#CBD5E1' : '#94A3B8'}
                  >
                    {node.address}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Traversal Output Sequence */}
      {traversalSequence.length > 0 && (
        <div className="mb-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-950 font-mono">Visited Sequence:</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-xs font-black text-red-600">
            {traversalSequence.map((num, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white border border-red-200 shadow-xs animate-scale-in">
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Educational Pedagogical Status Banner */}
      <div className="text-xs font-mono text-black bg-surface p-2.5 rounded-xl border border-border flex items-center gap-2">
        <Info className="w-4 h-4 text-red-600 shrink-0" />
        <span className="leading-snug">{currentStepText}</span>
      </div>
    </div>
  );
}
