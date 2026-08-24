'use client';

import React, { useState } from 'react';
import { ASTProgramState, Experiment } from '@/lib/types';
import {
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Cpu,
  Send,
  MessageSquare,
  Zap,
  Info,
  Terminal,
  Flame,
  ArrowRight
} from 'lucide-react';

interface AIExplanationPanelProps {
  astState: ASTProgramState;
  experiment: Experiment;
  activeLineNumber: number;
}

export function AIExplanationPanel({
  astState,
  experiment,
  activeLineNumber
}: AIExplanationPanelProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'beginner' | 'why' | 'remove' | 'memory'>('live');
  const [userQuery, setUserQuery] = useState<string>('');
  const [chatLog, setChatLog] = useState<{ query: string; answer: string }[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);

  const exp = astState.lineExplanation;
  const activeLineText = astState.activeLineText || `Line ${activeLineNumber}`;

  // Smart Contextual AI Answer Generator for student queries
  const handleAskAI = (customPrompt?: string) => {
    const q = (customPrompt || userQuery).trim();
    if (!q) return;

    setIsThinking(true);
    setUserQuery('');

    setTimeout(() => {
      let answer = '';
      const lowerQ = q.toLowerCase();

      if (lowerQ.includes('malloc') || lowerQ.includes('heap') || lowerQ.includes('memory')) {
        answer = `malloc(sizeof(...)) requests dynamic heap memory from the OS at runtime. Unlike local stack variables that vanish when a function returns, heap memory stays alive until you explicitly call free(). In Data Structures, this allows your Linked List or Stack to grow and shrink to any size!`;
      } else if (lowerQ.includes('++top') || lowerQ.includes('top++') || lowerQ.includes('increment')) {
        answer = `++top is pre-increment: it increases top by 1 FIRST, then writes to stack[top]. On the other hand, top++ uses the old value first, then increments. In push(), ++top ensures we place the new element into the next free slot!`;
      } else if (lowerQ.includes('simple') || lowerQ.includes('15') || lowerQ.includes('beginner') || lowerQ.includes('easy')) {
        answer = exp?.beginnerFriendly || `This line tells the computer to perform a step in your C algorithm. It checks conditions, updates pointer arrows, and keeps the data structure healthy!`;
      } else if (lowerQ.includes('bug') || lowerQ.includes('leak') || lowerQ.includes('mistake')) {
        answer = exp?.potentialMistakes && exp.potentialMistakes.length > 0
          ? `Common pitfalls for this line:\n• ${exp.potentialMistakes.join('\n• ')}`
          : `Make sure all opening brackets '{' are closed and every statement ends with a semicolon ';'.`;
      } else if (lowerQ.includes('dry run') || lowerQ.includes('example') || lowerQ.includes('trace')) {
        answer = `Dry run for Line ${activeLineNumber} ("${activeLineText}"):\n• Before: Variables in scope: ${astState.variables.map(v => `${v.name}=${v.value}`).join(', ') || 'top=-1'}\n• Action: Executes "${activeLineText}"\n• Result: ${exp?.whatItDoes || 'State updated.'}`;
      } else {
        answer = `Regarding Line ${activeLineNumber} (\`${activeLineText}\`):\n${exp?.whatItDoes || ''}\n\nKey insight: ${exp?.whyNeeded || 'It is an essential step in this C data structure.'}`;
      }

      setChatLog(prev => [{ query: q, answer }, ...prev]);
      setIsThinking(false);
    }, 400);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Lively Panel Header */}
      <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent-indigo" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-accent-emerald animate-ping"></span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            AI Teaching Assistant
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
          <span className="text-[11px] font-mono text-primary font-bold bg-white px-2 py-0.5 rounded border border-border">
            Line {activeLineNumber}
          </span>
        </div>
      </div>

      {/* Active Code Line High-Impact Banner */}
      <div className="px-3.5 py-2 bg-zinc-900 text-white border-b border-zinc-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] font-mono font-bold text-accent-amber bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
            L{activeLineNumber}
          </span>
          <code className="text-xs font-mono text-emerald-400 font-semibold truncate">
            {activeLineText || '// [Blank Line]'}
          </code>
        </div>
        {exp?.category && (
          <span className="text-[9px] uppercase font-mono tracking-wider text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded shrink-0">
            {exp.category.replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border bg-surface-subtle p-1 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center whitespace-nowrap transition ${
            activeTab === 'live'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Live Breakdown
        </button>

        <button
          onClick={() => setActiveTab('beginner')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center whitespace-nowrap transition ${
            activeTab === 'beginner'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Beginner Analogy
        </button>

        <button
          onClick={() => setActiveTab('why')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center whitespace-nowrap transition ${
            activeTab === 'why'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Why Needed?
        </button>

        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center whitespace-nowrap transition ${
            activeTab === 'remove'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          If Removed?
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center whitespace-nowrap transition ${
            activeTab === 'memory'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Memory
        </button>
      </div>

      {/* Main Continuous Explanation Content */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
        {activeTab === 'live' && (
          <div className="space-y-3 animate-fade-in">
            {/* What this line does */}
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1.5">
                <Zap className="w-3.5 h-3.5 text-accent-amber" />
                <span>What This Line Does:</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed font-sans whitespace-pre-wrap">
                {exp?.whatItDoes || exp?.purpose || 'Executes statement in C runtime.'}
              </p>
            </div>

            {/* Why this line is used */}
            <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-blue mb-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Why This Line Is Used:</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                {exp?.whyUsed || exp?.whyNeeded || 'Essential algorithmic step.'}
              </p>
            </div>

            {/* Deconstructed Symbols & Operators on this Line */}
            {exp?.keySymbols && exp.keySymbols.length > 0 && (
              <div className="p-3 bg-surface rounded-lg border border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2">
                  Keywords & Operators Breakdown:
                </span>
                <div className="space-y-1.5">
                  {exp.keySymbols.map((s, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <code className="font-mono font-bold text-primary bg-white px-1.5 py-0.5 rounded border border-border shrink-0">
                        {s.symbol}
                      </code>
                      <span className="text-secondary text-[11px] leading-tight mt-0.5">
                        {s.meaning}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Pointer or Loop State Highlights */}
            {astState.activePointerName && (
              <div className="p-2.5 bg-surface rounded-lg border border-border flex items-center justify-between text-xs">
                <span className="text-muted">Pointer Update:</span>
                <code className="font-mono font-bold text-primary">
                  {astState.activePointerName} → {astState.activePointerTarget || 'NULL'}
                </code>
              </div>
            )}
          </div>
        )}

        {activeTab === 'beginner' && (
          <div className="p-3.5 bg-surface rounded-lg border border-border space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <HelpCircle className="w-4 h-4 text-accent-blue" />
              <span>Beginner-Friendly Analogy (1st-Year / 11th-12th):</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {exp?.beginnerFriendly || 'Imagine this line as a specific step in an everyday process.'}
            </p>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="p-3.5 bg-amber-50/40 rounded-lg border border-amber-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-amber">
              <BookOpen className="w-4 h-4" />
              <span>Why Is This Line Strictly Required?</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {exp?.whyNeeded || 'Without this line, the C compiler or data structure invariant is violated.'}
            </p>
          </div>
        )}

        {activeTab === 'remove' && (
          <div className="p-3.5 bg-rose-50/40 rounded-lg border border-rose-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-rose">
              <AlertTriangle className="w-4 h-4" />
              <span>Consequence If This Line Is Deleted / Omitted:</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {exp?.whatIfRemoved || 'The program will produce logical errors or memory faults.'}
            </p>
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="p-3.5 bg-surface rounded-lg border border-border space-y-2.5 animate-fade-in text-xs">
            <div className="flex items-center gap-1.5 font-bold text-primary">
              <Cpu className="w-4 h-4 text-accent-indigo" />
              <span>Internal Memory & Hardware Effect:</span>
            </div>
            <p className="text-secondary leading-relaxed font-sans">
              {exp?.internalMemoryEffect || 'Modifies registers or RAM addresses in the current process space.'}
            </p>
            <div className="pt-2 border-t border-border flex justify-between text-[11px] font-mono text-muted">
              <span>Stack Frame: active</span>
              <span>Heap Allocation: tracked</span>
            </div>
          </div>
        )}

        {/* Live Assistant Q&A Chat Log */}
        {chatLog.length > 0 && (
          <div className="pt-2 border-t border-border space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
              Teaching Conversation History:
            </span>
            {chatLog.map((chat, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-surface border border-border text-xs space-y-1">
                <div className="font-bold text-primary flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-accent-blue" />
                  <span>{chat.query}</span>
                </div>
                <p className="text-secondary whitespace-pre-wrap font-sans text-[11px] leading-relaxed">
                  {chat.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Quick Prompts & Chat Input */}
      <div className="p-3 border-t border-border bg-surface space-y-2">
        {/* Quick Click Prompts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => handleAskAI('Explain this line like I am 15')}
            className="text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-white hover:bg-surface-subtle text-primary transition shrink-0"
          >
            👶 Explain like I'm 15
          </button>
          <button
            onClick={() => handleAskAI('Why ++top instead of top++?')}
            className="text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-white hover:bg-surface-subtle text-primary transition shrink-0"
          >
            ⚡ Why ++top vs top++?
          </button>
          <button
            onClick={() => handleAskAI('What happens if I remove this line?')}
            className="text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-white hover:bg-surface-subtle text-primary transition shrink-0"
          >
            ⚠️ If removed?
          </button>
          <button
            onClick={() => handleAskAI('Show dry run example for this line')}
            className="text-[10px] font-medium px-2 py-0.5 rounded border border-border bg-white hover:bg-surface-subtle text-primary transition shrink-0"
          >
            🔍 Dry run
          </button>
        </div>

        {/* Live Query Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI();
          }}
          className="flex items-center gap-1.5"
        >
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder={`Ask AI about Line ${activeLineNumber}...`}
            className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-border bg-white focus:outline-none focus:border-primary text-primary font-sans"
          />
          <button
            type="submit"
            disabled={isThinking || !userQuery.trim()}
            className="p-1.5 rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition shadow-subtle"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
