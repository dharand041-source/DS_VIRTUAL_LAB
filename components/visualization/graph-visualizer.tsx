'use client';

import React, { useState } from 'react';
import {
  Network,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Share2,
  ArrowRight
} from 'lucide-react';

interface GraphVertex {
  id: number;
  label: string;
  x: number;
  y: number;
  distance: number | string;
  visited: boolean;
  isCurrent?: boolean;
}

interface GraphEdge {
  from: number;
  to: number;
  weight: number;
  isActive?: boolean;
  isShortestPath?: boolean;
}

export function GraphVisualizer({ activeLine }: { activeLine?: number }) {
  const initialVertices: GraphVertex[] = [
    { id: 0, label: 'V0 (Src)', x: 90, y: 155, distance: 0, visited: false },
    { id: 1, label: 'V1', x: 250, y: 65, distance: '∞', visited: false },
    { id: 2, label: 'V2', x: 440, y: 65, distance: '∞', visited: false },
    { id: 3, label: 'V3', x: 550, y: 155, distance: '∞', visited: false },
    { id: 4, label: 'V4', x: 300, y: 245, distance: '∞', visited: false }
  ];

  const initialEdges: GraphEdge[] = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 4, weight: 8 },
    { from: 1, to: 2, weight: 8 },
    { from: 1, to: 4, weight: 11 },
    { from: 2, to: 3, weight: 2 },
    { from: 4, to: 3, weight: 7 },
    { from: 4, to: 2, weight: 1 }
  ];

  const [vertices, setVertices] = useState<GraphVertex[]>(initialVertices);
  const [edges, setEdges] = useState<GraphEdge[]>(initialEdges);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visitedLog, setVisitedLog] = useState<string[]>([]);
  const [statusLog, setStatusLog] = useState<string>(
    'Graph ADT: Vertices connected with weighted bidirectional adjacency edges.'
  );

  // Dijkstra's Shortest Path Animation Step-by-Step
  const runDijkstra = async () => {
    setIsRunning(true);
    setVisitedLog([]);
    handleReset();

    setStatusLog('Step 1: Initialized Source V0 with distance 0; all other vertices with ∞.');
    await new Promise(r => setTimeout(r, 700));

    // Step 1: Visit V0
    setVertices(prev => prev.map(v => v.id === 0 ? { ...v, isCurrent: true, visited: true } : v));
    setVisitedLog(['V0 (d: 0)']);
    setStatusLog('Step 2: Relaxing edges adjacent to V0 ➔ (V0, V1)=4, (V0, V4)=8.');
    setEdges(prev => prev.map(e => e.from === 0 ? { ...e, isActive: true } : e));
    await new Promise(r => setTimeout(r, 800));

    setVertices(prev => prev.map(v => {
      if (v.id === 1) return { ...v, distance: 4 };
      if (v.id === 4) return { ...v, distance: 8 };
      return v;
    }));
    await new Promise(r => setTimeout(r, 700));

    // Step 2: Visit V1 (min unvisited distance = 4)
    setStatusLog('Step 3: Vertex V1 has minimum distance (4). Visiting V1 & relaxing (V1, V2)=4+8=12.');
    setVertices(prev => prev.map(v => v.id === 1 ? { ...v, isCurrent: true, visited: true } : { ...v, isCurrent: false }));
    setEdges(prev => prev.map(e => (e.from === 0 && e.to === 1) ? { ...e, isShortestPath: true } : (e.from === 1 && e.to === 2) ? { ...e, isActive: true } : e));
    setVisitedLog(prev => [...prev, 'V1 (d: 4)']);
    await new Promise(r => setTimeout(r, 800));

    setVertices(prev => prev.map(v => v.id === 2 ? { ...v, distance: 12 } : v));

    // Step 3: Visit V4 (distance 8) -> updates V2 to 8 + 1 = 9!
    setStatusLog('Step 4: Vertex V4 has min distance (8). Relaxing (V4, V2)=8+1=9 < 12! Updating V2 distance to 9.');
    setVertices(prev => prev.map(v => v.id === 4 ? { ...v, isCurrent: true, visited: true } : { ...v, isCurrent: false }));
    setEdges(prev => prev.map(e => (e.from === 0 && e.to === 4) ? { ...e, isShortestPath: true } : (e.from === 4 && e.to === 2) ? { ...e, isActive: true } : e));
    setVisitedLog(prev => [...prev, 'V4 (d: 8)']);
    await new Promise(r => setTimeout(r, 800));

    setVertices(prev => prev.map(v => v.id === 2 ? { ...v, distance: 9 } : v));

    // Step 4: Visit V2 (distance 9) -> updates V3 to 9 + 2 = 11!
    setStatusLog('Step 5: Visiting V2 (dist: 9). Relaxing (V2, V3)=9+2=11. Shortest path to V3 established.');
    setVertices(prev => prev.map(v => v.id === 2 ? { ...v, isCurrent: true, visited: true } : { ...v, isCurrent: false }));
    setEdges(prev => prev.map(e => (e.from === 4 && e.to === 2) ? { ...e, isShortestPath: true } : (e.from === 2 && e.to === 3) ? { ...e, isActive: true } : e));
    setVisitedLog(prev => [...prev, 'V2 (d: 9)']);
    await new Promise(r => setTimeout(r, 800));

    setVertices(prev => prev.map(v => v.id === 3 ? { ...v, distance: 11, visited: true, isCurrent: true } : { ...v, isCurrent: false }));
    setEdges(prev => prev.map(e => (e.from === 2 && e.to === 3) ? { ...e, isShortestPath: true } : e));
    setVisitedLog(prev => [...prev, 'V3 (d: 11)']);

    setStatusLog('🎯 Dijkstra Shortest Path Tree Completed! Optimal paths highlighted in bold red links.');
    setIsRunning(false);
  };

  const handleReset = () => {
    setVertices(initialVertices);
    setEdges(initialEdges);
    setVisitedLog([]);
    setStatusLog('Reset graph to initial unvisited state.');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-gradient-to-b from-white via-surface-subtle/30 to-surface min-h-[460px] select-none">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-black block">Weighted Graph &amp; Edge Network</span>
            <span className="text-[10px] text-muted font-mono">Dijkstra Shortest Path &amp; Greedy Edge Relaxation</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runDijkstra}
            disabled={isRunning}
            className="btn btn-outline-danger"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Dijkstra Shortest Path</span>
          </button>

          <button
            onClick={handleReset}
            className="btn btn-outline-secondary btn-sm"
            title="Reset Graph"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Unified 100% Neatly Arranged SVG Graph Canvas */}
      <div className="w-full my-2 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-border rounded-2xl p-2 shadow-subtle">
          <svg
            viewBox="0 0 640 310"
            className="w-full h-auto max-h-[300px]"
            style={{ display: 'block' }}
          >
            <defs>
              <filter id="nodeShadowG" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
              </filter>
              <filter id="activeShadowG" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#DC2626" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Render Weighted Edges */}
            {edges.map((edge, idx) => {
              const vFrom = vertices.find(v => v.id === edge.from)!;
              const vTo = vertices.find(v => v.id === edge.to)!;
              const midX = (vFrom.x + vTo.x) / 2;
              const midY = (vFrom.y + vTo.y) / 2;

              return (
                <g key={idx}>
                  {/* Clean Edge Line */}
                  <line
                    x1={vFrom.x}
                    y1={vFrom.y}
                    x2={vTo.x}
                    y2={vTo.y}
                    stroke={edge.isShortestPath ? '#DC2626' : edge.isActive ? '#EF4444' : '#CBD5E1'}
                    strokeWidth={edge.isShortestPath ? 4 : edge.isActive ? 2.5 : 1.5}
                    strokeDasharray={edge.isActive && !edge.isShortestPath ? '4 2' : 'none'}
                    className="transition-all duration-300"
                  />

                  {/* Edge Weight Pill Badge */}
                  <rect
                    x={midX - 12}
                    y={midY - 9}
                    width={24}
                    height={18}
                    rx={9}
                    fill="#FFFFFF"
                    stroke={edge.isShortestPath ? '#DC2626' : '#94A3B8'}
                    strokeWidth={1.5}
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill={edge.isShortestPath ? '#DC2626' : '#334155'}
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Render Vertices */}
            {vertices.map((v) => {
              const isCurrent = v.isCurrent;
              const isVisited = v.visited;

              return (
                <g
                  key={v.id}
                  transform={`translate(${v.x}, ${v.y})`}
                  className="cursor-pointer transition-transform duration-300"
                  onClick={() => {
                    setStatusLog(`Vertex V${v.id} clicked. Distance from source: ${v.distance}, Visited: ${v.visited ? 'Yes' : 'No'}.`);
                  }}
                >
                  {/* Outer pulse */}
                  {isCurrent && (
                    <circle
                      r={28}
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth={3}
                      className="animate-ping opacity-40"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r={24}
                    fill={isCurrent ? '#DC2626' : isVisited ? '#000000' : '#FFFFFF'}
                    stroke={isCurrent ? '#DC2626' : isVisited ? '#000000' : '#475569'}
                    strokeWidth={isCurrent ? 3 : 2}
                    filter={isCurrent ? 'url(#activeShadowG)' : 'url(#nodeShadowG)'}
                    className="transition-all duration-300"
                  />

                  {/* Vertex Label */}
                  <text
                    x={0}
                    y={-3}
                    textAnchor="middle"
                    fontSize={12}
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fontWeight="bold"
                    fill={isCurrent || isVisited ? '#FFFFFF' : '#000000'}
                  >
                    V{v.id}
                  </text>

                  {/* Distance Subtext */}
                  <text
                    x={0}
                    y={10}
                    textAnchor="middle"
                    fontSize={8}
                    fontFamily="'JetBrains Mono', Consolas, monospace"
                    fontWeight="bold"
                    fill={isCurrent || isVisited ? '#FED7AA' : '#DC2626'}
                  >
                    d:{v.distance}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Visited Queue Strip */}
      {visitedLog.length > 0 && (
        <div className="mb-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-red-950 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
            <span>Relaxation Sequence:</span>
          </span>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-red-600">
            {visitedLog.map((log, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white border border-red-200 shadow-xs">
                {log}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pedagogical Log */}
      <div className="text-xs font-mono text-black bg-surface p-2.5 rounded-xl border border-border flex items-center gap-2">
        <Info className="w-4 h-4 text-red-600 shrink-0" />
        <span className="leading-snug">{statusLog}</span>
      </div>
    </div>
  );
}
