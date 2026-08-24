'use client';

import React from 'react';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, CheckCircle2, Play, ArrowRight, Layers, FileText } from 'lucide-react';

export default function SyllabusPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-surface py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-extrabold text-primary tracking-tight">
              DATA STRUCTURES LAB → SYLLABUS
            </h1>
          </div>
          <p className="text-xs text-secondary max-w-2xl">
            Anna University Laboratory Syllabus Aligned • Practical experiments implemented in C with live memory state visualization and typing viva assessment.
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="space-y-4">
          {SYLLABUS_EXPERIMENTS.map((exp) => {
            const isCompleted = user.completedExperiments.includes(exp.id);

            return (
              <div
                key={exp.id}
                className={`academic-card p-6 bg-white border ${
                  isCompleted ? 'border-zinc-300' : 'border-border'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center font-mono font-bold text-sm text-primary shrink-0">
                      {exp.expNumber.toString().padStart(2, '0')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="academic-badge">{exp.category}</span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        )}
                      </div>

                      <h2 className="text-base font-bold text-primary mb-1">
                        {exp.title}
                      </h2>
                      <p className="text-xs text-secondary max-w-2xl mb-3">
                        {exp.aim}
                      </p>

                      {/* Experiment Checklist */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Theory & Algorithm
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Line-by-Line C Analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> Live Memory Visualizer
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald" /> 10s Typing Viva
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link
                      href={`/experiments/${exp.id}`}
                      className="px-3.5 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-surface transition shadow-subtle flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Theory & Code</span>
                    </Link>

                    <Link
                      href={`/lab/${exp.id}`}
                      className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition shadow-subtle flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Coding Lab</span>
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
