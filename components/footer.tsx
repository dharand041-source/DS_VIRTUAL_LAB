import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary">DATA STRUCTURES VIRTUAL LAB</span>
            <span className="text-[10px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
              C Implementation
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Department of Artificial Intelligence & Data Science (AI&DS) • Anna University Laboratory Regulation Aligned
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary font-medium">
          <Link href="/experiments" className="hover:text-primary transition">
            Experiments
          </Link>
          <Link href="/compiler" className="hover:text-primary transition">
            Online Compiler
          </Link>
          <Link href="/leaderboard" className="hover:text-primary transition">
            Leaderboard
          </Link>
          <Link href="/faculty" className="hover:text-primary transition">
            Faculty
          </Link>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
          <span>Sandboxed C Execution • Turnstile Protected</span>
        </div>
      </div>
    </footer>
  );
}
