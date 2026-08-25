'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { useAuth } from '@/lib/auth-context';
import { getStoredStageProgress, DEFAULT_LMS_COURSE } from '@/lib/storage';
import { BookOpen, CheckCircle2, Play, ArrowRight, Layers, FileText, ArrowLeft, Check } from 'lucide-react';

export default function SyllabusPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 bg-surface-subtle py-10 px-4 sm:px-6 select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Course Header Container */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-[11px] font-mono font-bold text-red-700">
                COURSE SYLLABUS: {DEFAULT_LMS_COURSE.code}
              </span>
              <span className="text-xs font-mono text-muted">
                {DEFAULT_LMS_COURSE.regulation}
              </span>
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              {DEFAULT_LMS_COURSE.title}
            </h1>
            <p className="text-xs text-secondary mt-1 max-w-2xl leading-relaxed">
              {DEFAULT_LMS_COURSE.description}
            </p>
          </div>

          <div className="bg-surface p-3 rounded-lg border border-border text-center min-w-[120px] shrink-0">
            <span className="text-[10px] font-mono text-muted uppercase block">Curriculum Total</span>
            <span className="text-sm font-black font-mono text-black mt-0.5 block">
              10 Experiments
            </span>
          </div>
        </div>

        {/* Experiments Grid */}
        <div className="space-y-4">
          {SYLLABUS_EXPERIMENTS.map((exp) => {
            const progress = mounted ? getStoredStageProgress(user.id, exp.id) : null;
            const isCompleted = mounted && user.completedExperiments?.includes(exp.id);
            const isInProgress = progress && progress.overallStatus === 'IN_PROGRESS';

            return (
              <div
                key={exp.id}
                className={`academic-card p-6 bg-white border transition ${
                  isCompleted
                    ? 'border-border bg-white'
                    : isInProgress
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-border'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center font-mono font-bold text-sm shrink-0 mt-0.5">
                      {exp.expNumber.toString().padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                          {exp.category}
                        </span>

                        {isCompleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-accent-amber border border-amber-200">
                            In Progress ({progress?.completionPercentage}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface text-muted">
                            Not Started
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-bold text-black mb-1">
                        {exp.title}
                      </h2>
                      <p className="text-xs text-secondary max-w-2xl mb-3 leading-relaxed">
                        {exp.aim}
                      </p>

                      {/* LMS Learning Unit Stage Checklist */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted font-mono">
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-emerald" /> Theory & Algorithm
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-emerald" /> Line-by-Line C Analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-emerald" /> Live Memory Visualizer
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-emerald" /> 10s Typing Viva
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-accent-emerald" /> Lab Submission
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link
                      href={`/experiments/${exp.id}`}
                      className="px-4 py-2 rounded-lg border border-black bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-black text-xs font-bold transition shadow-subtle flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCompleted ? 'Review Unit' : isInProgress ? 'Continue Learning' : 'Start Unit'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

