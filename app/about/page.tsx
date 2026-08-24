import React from 'react';
import {
  ShieldCheck,
  GraduationCap,
  Lock,
  Sparkles,
  Layers
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex-1 bg-surface py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-xs font-mono font-bold text-muted uppercase">
              ACADEMIC VISION & SYSTEM ARCHITECTURE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            Data Structures Virtual Laboratory
          </h1>
          <p className="text-xs text-secondary mt-1">
            Designed for 11th/12th students, 1st-year undergraduates, college peers, guest learners, and faculty.
          </p>
        </div>

        {/* Academic Source Flow Architecture */}
        <div className="academic-card p-6 bg-white space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-indigo" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              1. The Department Academic Architecture Flow
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            The platform is built strictly upon our faculty's handwritten pedagogical laboratory blueprint:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded bg-surface border border-border">Welcome Page</div>
            <div className="p-2.5 rounded bg-surface border border-border">Lab Definition</div>
            <div className="p-2.5 rounded bg-surface border border-border">Objectives</div>
            <div className="p-2.5 rounded bg-surface border border-border">Student / Staff Auth</div>
            <div className="p-2.5 rounded bg-surface border border-border">Syllabus Grid</div>
            <div className="p-2.5 rounded bg-surface border border-border">Theory & Algorithm</div>
            <div className="p-2.5 rounded bg-surface border border-border">C Monaco Lab</div>
            <div className="p-2.5 rounded bg-surface border border-border">Live AST Visualizer</div>
            <div className="p-2.5 rounded bg-surface border border-border">Sandboxed Run</div>
            <div className="p-2.5 rounded bg-surface border border-border">Assessment Test</div>
            <div className="p-2.5 rounded bg-surface border border-border">10s Typing Viva</div>
            <div className="p-2.5 rounded bg-surface border border-border">Faculty Evaluation</div>
            <div className="p-2.5 rounded bg-surface border border-border">AI Feedback</div>
            <div className="p-2.5 rounded bg-surface border border-border">Weekly Leaderboard</div>
            <div className="p-2.5 rounded bg-surface border border-border">XP & Badges</div>
            <div className="p-2.5 rounded bg-surface border border-border">Next Target</div>
          </div>
        </div>

        {/* Core Pedagogical Innovation */}
        <div className="academic-card p-6 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              2. Real-Time Line-by-Line AST Program State Visualizer
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Unlike static compilers that simply run code at the end, our laboratory features a continuous client-side Abstract Syntax Tree (AST) analyzer. As students type C code line by line, the system interprets pointer updates (<code className="font-mono text-primary font-bold">head = newNode</code>, <code className="font-mono text-primary font-bold">temp-&gt;next</code>), memory allocations (<code className="font-mono text-primary font-bold">malloc</code>), and loop counters (<code className="font-mono text-primary font-bold">for, while</code>), instantaneously animating the visual memory diagram beside the editor.
          </p>
        </div>

        {/* Security & Sandbox Architecture */}
        <div className="academic-card p-6 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-accent-emerald" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              3. Secure C Execution & Academic Integrity
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Untrusted student C code is treated as potentially hazardous and is evaluated strictly within sandboxed workers with memory caps, timeout constraints (2s), syscall filters, and network isolation. Anti-bot protection (Cloudflare Turnstile) and anti-paste restrictions in viva mode safeguard assessment integrity.
          </p>
        </div>

        {/* College Access Control Model */}
        <div className="academic-card p-6 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-blue" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              4. College Access Control Model
            </h2>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            <strong className="text-primary font-semibold">Our College Students</strong> receive full continuous assessment access, 75-mark laboratory records, and College Top 5 Leaderboard entry. <br />
            <strong className="text-primary font-semibold">Students from other colleges</strong> receive public learning access, interactive visualizer tools, and Global Top 10 Leaderboard entry, strictly isolated from our college internal evaluation records.
          </p>
        </div>
      </div>
    </div>
  );
}
