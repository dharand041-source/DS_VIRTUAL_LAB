'use client';

import React, { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fade, setFade] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing AI&DS Virtual Laboratory...');

  useEffect(() => {
    // 3000ms duration with smooth progress updates
    const startTime = Date.now();
    const duration = 3000; // Exactly 3 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < 1000) {
        setStatusText('Initializing AI&DS Virtual Laboratory...');
      } else if (elapsed < 2000) {
        setStatusText('Loading AST Memory Visualizer & C Sandbox...');
      } else {
        setStatusText('Entering Laboratory Environment...');
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setFade(true);

        setTimeout(() => {
          setIsVisible(false);
        }, 350);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-300 select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center max-w-sm px-6">
        {/* Minimal Academic Logo Box */}
        <div className="relative w-14 h-14 rounded-2xl border border-border bg-surface flex items-center justify-center mb-6 shadow-subtle">
          <span className="text-xl font-extrabold text-primary">C</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent-emerald animate-pulse"></div>
        </div>

        <h1 className="text-base font-extrabold tracking-tight uppercase text-primary mb-0.5">
          DATA STRUCTURES LAB
        </h1>
        <h2 className="text-[11px] font-semibold tracking-wider uppercase text-muted mb-6">
          Department of AI&DS • Virtual Laboratory
        </h2>

        {/* 3-Second Progress Bar */}
        <div className="w-56 h-1.5 bg-surface-subtle overflow-hidden rounded-full border border-border/60 mb-3">
          <div
            className="h-full bg-primary transition-all duration-75 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Status indicator & Percentage */}
        <div className="flex items-center justify-between w-56 text-[10px] font-mono text-muted mb-4">
          <span className="truncate">{statusText}</span>
          <span className="font-bold text-primary ml-2">{progress}%</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-[10px] text-secondary font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-ping"></span>
          <span>Anna University Regulation 2021</span>
        </div>
      </div>
    </div>
  );
}
