'use client';

import React, { useState } from 'react';
import { ASTProgramState, Experiment } from '@/lib/types';
import { Sparkles, HelpCircle, AlertTriangle, Lightbulb, CheckCircle2, BookOpen } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'line' | 'beginner' | 'why' | 'remove'>('line');

  // Look up pre-defined explanation or fall back to simulated AST analysis
  const staticExp = experiment.lineByLineExplanations[activeLineNumber];
  const dynamicExp = astState.lineExplanation;

  const purpose = staticExp?.purpose || dynamicExp?.purpose || `Executing line ${activeLineNumber}`;
  const beginner = staticExp?.beginnerFriendly || dynamicExp?.beginnerFriendly || `This line performs operations in the C runtime.`;
  const whyNeeded = staticExp?.whyNeeded || dynamicExp?.whyNeeded || `Ensures correct memory linkages and pointer flow.`;
  const whatIfRemoved = staticExp?.whatIfRemoved || dynamicExp?.whatIfRemoved || `The algorithm will fail to complete the required data structure operation.`;

  return (
    <div className="w-full h-full flex flex-col bg-white border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Panel Header */}
      <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-accent-indigo" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            AI Teaching Assistant
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted bg-white px-2 py-0.5 rounded border border-border">
          Active Line: {activeLineNumber}
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-border bg-surface-subtle p-1 gap-1">
        <button
          onClick={() => setActiveTab('line')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center transition ${
            activeTab === 'line'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Line Purpose
        </button>

        <button
          onClick={() => setActiveTab('beginner')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center transition ${
            activeTab === 'beginner'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Beginner View
        </button>

        <button
          onClick={() => setActiveTab('why')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center transition ${
            activeTab === 'why'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          Why Needed?
        </button>

        <button
          onClick={() => setActiveTab('remove')}
          className={`flex-1 text-[11px] font-medium py-1 px-1.5 rounded text-center transition ${
            activeTab === 'remove'
              ? 'bg-white text-primary font-semibold shadow-subtle border border-border'
              : 'text-muted hover:text-primary'
          }`}
        >
          If Removed?
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === 'line' && (
          <div className="space-y-3">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-accent-amber" />
                <span>What this line does:</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed font-sans">
                {purpose}
              </p>
            </div>

            {astState.activePointerName && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-blue mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Pointer Mutation:</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Pointer <code className="font-mono text-primary font-bold">{astState.activePointerName}</code> updated to point to <code className="font-mono text-primary font-bold">{astState.activePointerTarget || 'NULL'}</code>.
                </p>
              </div>
            )}

            {astState.loopStatus && (
              <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-emerald mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Loop Execution State:</span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Iterating variable <code className="font-mono font-bold">{astState.loopStatus.variable} = {astState.loopStatus.currentIteration}</code> under condition <code className="font-mono font-bold">{astState.loopStatus.condition}</code>.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'beginner' && (
          <div className="p-3 bg-surface rounded-lg border border-border">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-accent-blue" />
              <span>Simple 1st-Year Explanation:</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {beginner}
            </p>
          </div>
        )}

        {activeTab === 'why' && (
          <div className="p-3 bg-amber-50/40 rounded-lg border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-amber mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why is this line strictly required?</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {whyNeeded}
            </p>
          </div>
        )}

        {activeTab === 'remove' && (
          <div className="p-3 bg-rose-50/40 rounded-lg border border-rose-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-rose mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Consequence if this line is deleted:</span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-sans">
              {whatIfRemoved}
            </p>
          </div>
        )}

        {/* Quick Question Prompts */}
        <div className="pt-2 border-t border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2">
            Ask Teaching Assistant:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveTab('beginner')}
              className="text-[11px] px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-subtle text-primary transition"
            >
              👶 Explain like I'm 15
            </button>
            <button
              onClick={() => setActiveTab('why')}
              className="text-[11px] px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-subtle text-primary transition"
            >
              ❓ Why malloc?
            </button>
            <button
              onClick={() => setActiveTab('remove')}
              className="text-[11px] px-2.5 py-1 rounded border border-border bg-surface hover:bg-surface-subtle text-primary transition"
            >
              ⚠️ What if removed?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
