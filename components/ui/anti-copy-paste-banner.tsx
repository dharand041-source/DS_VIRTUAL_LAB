'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, X } from 'lucide-react';

interface AntiCopyPasteProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  active?: boolean;
}

export function AntiCopyPasteBanner({ active = true }: AntiCopyPasteProps) {
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    const showSecurityWarning = (action: string) => {
      setWarning(`Academic Integrity Protection: ${action} is disabled in this Virtual Lab to prevent automated AI copy-pasting and ensure authentic learning.`);
      setTimeout(() => {
        setWarning(null);
      }, 3500);
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityWarning('Copying code or questions');
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityWarning('Pasting external code');
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      showSecurityWarning('Cutting code');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      if (isCmdOrCtrl && (e.key === 'c' || e.key === 'C' || e.key === 'v' || e.key === 'V' || e.key === 'x' || e.key === 'X')) {
        e.preventDefault();
        showSecurityWarning(e.key.toLowerCase() === 'v' ? 'Pasting external code (Ctrl+V)' : 'Copying content (Ctrl+C)');
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If inside an editor or question area, block context menu
      if (target.closest('.monaco-editor, .viva-container, .code-workspace, textarea, input')) {
        e.preventDefault();
        showSecurityWarning('Right-click context menu');
      }
    };

    window.addEventListener('copy', handleCopy);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('cut', handleCut);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('cut', handleCut);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [active]);

  if (!warning) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[99999] max-w-md animate-slide-up select-none">
      <div className="p-4 rounded-xl bg-red-600 text-white shadow-2xl border border-red-700 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-xs">
          <div className="font-extrabold flex items-center gap-1.5 mb-0.5">
            <Lock className="w-3.5 h-3.5" />
            <span>Anti-Cheating &amp; Anti-AI Protection</span>
          </div>
          <p className="text-white/90 leading-relaxed">
            {warning}
          </p>
        </div>
        <button
          onClick={() => setWarning(null)}
          className="text-white/70 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
