'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Sparkles, Shield, Trophy, CheckCircle2, Play, Users, BookOpen } from 'lucide-react';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-surface-subtle/50 to-white py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Academic Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-white text-xs font-medium text-secondary mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse"></span>
            <span>Anna University Regulation Aligned • Department of CSE</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary max-w-3xl leading-[1.1] mb-6">
            Understand Data Structures. <br />
            <span className="text-muted font-bold">Don't Just Run Them.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-secondary max-w-2xl font-normal leading-relaxed mb-8">
            An interactive Data Structures Virtual Lab that explains your C program line by line and visualizes how your data structures change dynamically in memory as you code.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/lab/exp-01-singly-linked-list"
              className="px-6 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition shadow-subtle flex items-center gap-2"
            >
              <span>Launch Flagship Lab (Linked List)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/syllabus"
              className="px-6 py-3 rounded-lg border border-border bg-white text-primary text-sm font-semibold hover:bg-surface transition shadow-subtle flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Full Syllabus</span>
            </Link>
          </div>

          {/* Interactive Hero Split-Screen Visual Demo Preview */}
          <div className="w-full max-w-4xl border border-border rounded-xl bg-white shadow-floating overflow-hidden text-left">
            {/* Window title bar */}
            <div className="px-4 py-2.5 bg-surface border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300"></div>
                <span className="text-xs font-mono font-medium text-muted ml-2">
                  interactive-preview.c
                </span>
              </div>
              <span className="text-[11px] font-mono text-accent-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                AST Memory State Active
              </span>
            </div>

            {/* Split Screen Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              {/* Col 1: C Code Snippet with line highlight */}
              <div className="p-4 bg-surface-subtle font-mono text-xs text-primary space-y-1">
                <div className="text-muted text-[10px] uppercase font-bold tracking-wider mb-2 font-sans">
                  1. C Code Line
                </div>
                <div className="text-muted">struct Node* head = NULL;</div>
                <div className="bg-primary text-white p-1 rounded font-bold">
                  int x = 10;
                </div>
                <div className="text-muted">insertAtBeginning(x);</div>
                <div className="text-muted">display();</div>
              </div>

              {/* Col 2: Live Memory Visualizer */}
              <div className="p-4 bg-white flex flex-col justify-center">
                <div className="text-muted text-[10px] uppercase font-bold tracking-wider mb-3 font-sans">
                  2. Visual State in Heap
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-accent-blue uppercase">HEAD</span>
                  <div className="flex rounded border border-primary overflow-hidden shadow-subtle">
                    <div className="px-2 py-1 bg-white border-r border-border font-mono text-xs font-bold">
                      10
                    </div>
                    <div className="px-2 py-1 bg-surface font-mono text-[10px] text-muted">
                      NULL
                    </div>
                  </div>
                </div>
              </div>

              {/* Col 3: AI Explanation */}
              <div className="p-4 bg-surface font-sans text-xs">
                <div className="text-muted text-[10px] uppercase font-bold tracking-wider mb-2 font-sans flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
                  <span>3. AI Explanation</span>
                </div>
                <p className="text-secondary leading-relaxed">
                  <strong className="text-primary font-semibold">int</strong> tells the program that <code className="font-mono text-primary font-bold">x</code> stores an integer value. <br />
                  <code className="font-mono text-primary font-bold">x = 10</code> gives variable x the value 10 in stack memory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Designed For All Learners</h2>
          <p className="text-2xl font-bold text-primary">Removing the Fear of C Programming & Data Structures</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="academic-card p-5">
            <span className="text-2xl mb-3 block">🎓</span>
            <h3 className="text-sm font-bold text-primary mb-1">11th & 12th Students</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Gentle introduction to variables, loops, memory addresses, and elementary pointers with visual step-by-step guidance.
            </p>
          </div>

          <div className="academic-card p-5">
            <span className="text-2xl mb-3 block">💻</span>
            <h3 className="text-sm font-bold text-primary mb-1">1st-Year Undergrads</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Master dynamic memory allocation (malloc/free), self-referential structures, and pointer manipulation without confusion.
            </p>
          </div>

          <div className="academic-card p-5 border-zinc-400">
            <span className="text-2xl mb-3 block">🏛️</span>
            <h3 className="text-sm font-bold text-primary mb-1">Our College Students</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Full Anna University curriculum access, 75-mark evaluation scheme, typing viva tests, and internal college leaderboard.
            </p>
          </div>

          <div className="academic-card p-5">
            <span className="text-2xl mb-3 block">🌐</span>
            <h3 className="text-sm font-bold text-primary mb-1">Guest & Other Colleges</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Open public demonstrations, interactive C code visualizer, and global learning leaderboard with complete privacy protection.
            </p>
          </div>
        </div>
      </section>

      {/* Complete Academic Learning Flow (Source Architecture) */}
      <section className="py-16 px-4 sm:px-6 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">The Academic Learning Loop</h2>
            <p className="text-2xl font-bold text-primary">From Theory to Interactive Viva & Evaluation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-4 rounded-lg border border-border">
              <span className="text-xs font-mono font-bold text-muted block mb-1">PHASE 01</span>
              <h4 className="text-sm font-bold text-primary mb-1">Write C Code</h4>
              <p className="text-[11px] text-secondary">Monaco C editor with real-time AST line-by-line inspection.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-border">
              <span className="text-xs font-mono font-bold text-muted block mb-1">PHASE 02</span>
              <h4 className="text-sm font-bold text-primary mb-1">Live Visualize</h4>
              <p className="text-[11px] text-secondary">Dynamic linked nodes, pointers, and stack memory frames.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-border">
              <span className="text-xs font-mono font-bold text-muted block mb-1">PHASE 03</span>
              <h4 className="text-sm font-bold text-primary mb-1">10s Typing Viva</h4>
              <p className="text-[11px] text-secondary">Rapid typing responses with anti-paste security.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-border">
              <span className="text-xs font-mono font-bold text-muted block mb-1">PHASE 04</span>
              <h4 className="text-sm font-bold text-primary mb-1">Faculty Evaluation</h4>
              <p className="text-[11px] text-secondary">Anna University 75-mark scheme and personalized feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Syllabus Experiments */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Curriculum Experiments</h2>
            <p className="text-xl font-bold text-primary">Data Structures Laboratory (C)</p>
          </div>
          <Link
            href="/syllabus"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View all experiments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYLLABUS_EXPERIMENTS.map((exp) => (
            <div key={exp.id} className="academic-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted">EXP {exp.expNumber.toString().padStart(2, '0')}</span>
                  <span className="academic-badge">{exp.category}</span>
                </div>
                <h3 className="text-base font-bold text-primary mb-2">{exp.title}</h3>
                <p className="text-xs text-secondary leading-relaxed mb-4">{exp.aim}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
                <div className="flex items-center gap-2">
                  {exp.coMapping.slice(0, 1).map((co, i) => (
                    <span key={i} className="text-[10px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
                      {co.split(' - ')[0]}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/lab/${exp.id}`}
                  className="px-3.5 py-1.5 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition flex items-center gap-1 shadow-subtle"
                >
                  <Play className="w-3 h-3 fill-current" /> Open Lab
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
