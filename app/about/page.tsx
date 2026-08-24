import React from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Layers,
  Terminal,
  BookOpen
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 bg-surface-subtle py-10 px-4 sm:px-6 select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono font-bold text-muted uppercase">
              DEPARTMENT OF ARTIFICIAL INTELLIGENCE & DATA SCIENCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Data Structures Virtual Laboratory
          </h1>
          <p className="text-xs text-secondary mt-1">
            Course Code: N21UIT307 • Anna University Regulation 2021
          </p>
        </div>

        {/* Pedagogical Vision */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl space-y-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Real-Time AST Memory Visualization
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            The platform provides a client-side Abstract Syntax Tree (AST) analyzer. As students type C code line by line, the system interprets pointer updates, dynamic memory allocations (<code className="font-mono text-primary font-bold">malloc</code>), and loop traversals, animating the visual memory diagram beside the editor in real time.
          </p>
        </div>

        {/* Security & Sandboxing */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl space-y-3 shadow-subtle">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-emerald" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Secure Sandboxed C Execution
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Student C code is evaluated within isolated sandboxed execution workers with strict memory limits, execution timeout constraints, and automated test cases.
          </p>
        </div>
      </div>
    </div>
  );
}
