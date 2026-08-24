'use client';

import React from 'react';
import Link from 'next/link';
import { UniversalCCompiler } from '@/components/compiler/universal-c-compiler';
import { Terminal, BookOpen, ArrowRight, ShieldCheck, Cpu, Code2, Sparkles, ArrowLeft } from 'lucide-react';

export default function CompilerPage() {
  return (
    <div className="flex-1 flex flex-col bg-surface-subtle">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-border bg-white px-4 sm:px-6 py-2.5 select-none">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <span>/</span>
            <span className="text-primary font-bold">C Online Compiler</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/syllabus"
              className="text-secondary hover:text-primary transition flex items-center gap-1 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lab Syllabus</span>
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/lab/exp-01-singly-linked-list"
              className="text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>Flagship Linked List Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col">
        <UniversalCCompiler />
      </div>
    </div>
  );
}
