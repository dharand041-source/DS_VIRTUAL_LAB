'use client';

import React, { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      const hideTimer = setTimeout(() => setIsVisible(false), 400);
      return () => clearTimeout(hideTimer);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center transition-opacity duration-400 select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center max-w-sm px-4">
        {/* Minimal Academic Logo Box */}
        <div className="w-12 h-12 rounded-xl border border-border bg-surface flex items-center justify-center mb-6 shadow-subtle">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h1 className="text-sm font-bold tracking-widest uppercase text-primary mb-1">
          DATA STRUCTURES
        </h1>
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted mb-6">
          VIRTUAL LABORATORY
        </h2>

        <p className="text-xs text-secondary mb-4 font-mono">
          Initializing Laboratory Environment...
        </p>

        {/* Minimal Progress Line */}
        <div className="w-48 h-0.5 bg-surface-subtle overflow-hidden rounded-full">
          <div className="w-full h-full bg-primary animate-pulse"></div>
        </div>

        <span className="text-[10px] text-muted font-mono mt-6">
          C Language AST Engine & Compiler Sandbox
        </span>
      </div>
    </div>
  );
}
