'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { BotVerificationModal } from '@/components/lab/bot-verification-modal';
import {
  BookOpen,
  Play,
  ArrowRight,
  Code2,
  CheckCircle2,
  Cpu,
  Clock,
  HardDrive,
  Lightbulb,
  FileCode,
  ArrowLeft
} from 'lucide-react';

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expId = params?.id as string;
  const [showBotModal, setShowBotModal] = useState(false);

  const experiment = SYLLABUS_EXPERIMENTS.find(e => e.id === expId) || SYLLABUS_EXPERIMENTS[0];

  const handleVerifiedAndEnter = () => {
    setShowBotModal(false);
    router.push(`/lab/${experiment.id}`);
  };

  return (
    <div className="flex-1 bg-surface py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link & Header */}
        <div>
          <Link
            href="/syllabus"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary font-medium mb-3 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border shadow-subtle">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-bold text-muted uppercase">
                  EXPERIMENT {experiment.expNumber.toString().padStart(2, '0')}
                </span>
                <span className="academic-badge">{experiment.category}</span>
              </div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                {experiment.title}
              </h1>
            </div>

            <button
              onClick={() => setShowBotModal(true)}
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition shadow-subtle flex items-center gap-2 shrink-0 self-start sm:self-center"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Interactive Lab</span>
            </button>
          </div>
        </div>

        {/* 1. Aim & Objectives Card */}
        <div className="academic-card p-6 bg-white space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">1. Aim</h3>
            <p className="text-sm text-primary font-medium leading-relaxed">{experiment.aim}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">2. Learning Objectives</h3>
            <ul className="space-y-1.5">
              {experiment.objectives.map((obj, i) => (
                <li key={i} className="text-xs text-secondary flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 2. Definition & Theory */}
        <div className="academic-card p-6 bg-white space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">3. Definition</h3>
            <p className="text-xs text-secondary leading-relaxed">{experiment.definition}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">4. Academic Theory</h3>
            <p className="text-xs text-secondary leading-relaxed">{experiment.theory}</p>
          </div>

          {/* Real World Example Card */}
          <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs font-bold text-accent-amber mb-1">
              <Lightbulb className="w-4 h-4" />
              <span>Real-World Analogy: {experiment.realWorldExample.title}</span>
            </div>
            <p className="text-xs text-secondary mb-2 leading-relaxed">
              {experiment.realWorldExample.analogy}
            </p>
            <p className="text-[11px] text-muted font-mono">
              <strong>Practical Application:</strong> {experiment.realWorldExample.application}
            </p>
          </div>
        </div>

        {/* 3. Algorithm & Pseudocode */}
        <div className="academic-card p-6 bg-white space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">5. Step-by-Step Algorithm</h3>
            <ol className="space-y-2">
              {experiment.algorithm.map((step, idx) => (
                <li key={idx} className="text-xs text-secondary flex items-start gap-2.5">
                  <span className="font-mono font-bold text-primary bg-surface px-1.5 py-0.5 rounded border border-border shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">6. Structured Pseudocode</h3>
            <pre className="p-4 rounded-lg bg-surface font-mono text-xs text-primary border border-border overflow-x-auto whitespace-pre-wrap">
              {experiment.pseudocode}
            </pre>
          </div>
        </div>

        {/* 4. C Implementation Code Preview */}
        <div className="academic-card p-6 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">7. Standard C Program</h3>
            <span className="text-[11px] font-mono text-muted">C99 Standard</span>
          </div>

          <pre className="p-4 rounded-lg bg-surface-subtle font-mono text-xs text-primary border border-border overflow-x-auto whitespace-pre-wrap max-h-96">
            {experiment.defaultCode}
          </pre>
        </div>

        {/* 5. Complexity & CO Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="academic-card p-5 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Time & Space Complexity</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted">Best Case:</span>
                <span className="font-mono font-bold text-primary">{experiment.timeComplexity.best}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted">Average / Worst:</span>
                <span className="font-mono font-bold text-primary">{experiment.timeComplexity.worst}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-1.5">
                <span className="text-muted">Space Complexity:</span>
                <span className="font-mono font-bold text-primary">{experiment.spaceComplexity.value}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted leading-relaxed font-sans">{experiment.timeComplexity.explanation}</p>
          </div>

          <div className="academic-card p-5 bg-white space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Course Outcome (CO) Mapping</h3>
            <ul className="space-y-2">
              {experiment.coMapping.map((co, i) => (
                <li key={i} className="text-xs text-secondary p-2 rounded bg-surface border border-border font-mono">
                  {co}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom CTA to Lab */}
        <div className="text-center py-6">
          <button
            onClick={() => setShowBotModal(true)}
            className="px-8 py-3 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary-hover transition shadow-subtle inline-flex items-center gap-2"
          >
            <span>Proceed to Interactive Coding Lab</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Turnstile Bot Check Modal */}
      <BotVerificationModal
        isOpen={showBotModal}
        onVerified={handleVerifiedAndEnter}
        onCancel={() => setShowBotModal(false)}
        title="Verification Required: Open Coding Lab"
      />
    </div>
  );
}
