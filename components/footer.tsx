import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center p-0.5 shadow-subtle overflow-hidden">
              <Image
                src="/logo.png"
                alt="Data Structures Virtual Lab"
                width={20}
                height={20}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xs font-black text-black">DATA STRUCTURES VIRTUAL LAB</span>
            <span className="text-[10px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 font-bold">
              C Implementation
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Department of Artificial Intelligence & Data Science (AI&DS) • Anna University Regulation Aligned
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-secondary font-medium">
          <Link href="/experiments" className="hover:text-red-600 transition">
            Experiments
          </Link>
          <Link href="/compiler" className="hover:text-red-600 transition">
            Online Compiler
          </Link>
          <Link href="/leaderboard" className="hover:text-red-600 transition">
            Leaderboard
          </Link>
          <Link href="/faculty" className="hover:text-red-600 transition">
            Faculty
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between w-full pt-4 border-t border-border/50 text-[11px] text-muted gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Sandboxed C Execution • Department of AI&DS</span>
          </div>
          <div>
            <a 
              href="https://www.flaticon.com/free-icons/education" 
              title="education icons"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline text-muted hover:text-secondary transition"
            >
              Education icons created by Magnific - Flaticon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
