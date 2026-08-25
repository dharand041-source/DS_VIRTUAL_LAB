'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Lock, AlertTriangle, Sparkles } from 'lucide-react';

interface BotVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export function BotVerificationModal({
  isOpen,
  onVerified,
  onCancel,
  title = "Academic Integrity: Human Verification",
  subtitle = "Anti-AI & Automated Proxy Detection"
}: BotVerificationModalProps) {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
      setTimeout(() => {
        onVerified();
      }, 400);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-2xl border border-border shadow-floating max-w-md w-full p-6 animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-black tracking-tight">{title}</h3>
            <p className="text-[11px] text-muted font-mono">{subtitle}</p>
          </div>
        </div>

        <div className="p-3 bg-surface rounded-xl border border-border space-y-1 text-xs text-secondary leading-relaxed">
          <div className="flex items-center gap-1.5 text-black font-bold text-[11px]">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Anti-AI Laboratory Policy:</span>
          </div>
          <p className="text-[11px] text-muted">
            To prevent automated AI assistants (ChatGPT, Copilot proxies) from writing code or taking viva tests, please confirm you are a human learner before accessing the compiler and laboratory tools.
          </p>
        </div>

        {/* Turnstile / Captcha Box */}
        <div className="p-4 border-2 border-zinc-200 rounded-xl bg-surface/50 flex items-center justify-between hover:border-zinc-300 transition">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerify}
              disabled={verifying || verified}
              className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition shadow-xs ${
                verified
                  ? 'bg-red-600 border-red-600 text-white'
                  : verifying
                  ? 'border-red-600 bg-white cursor-wait'
                  : 'border-zinc-400 bg-white hover:border-red-600'
              }`}
              title="Click to verify"
            >
              {verifying && <RefreshCw className="w-4 h-4 animate-spin text-red-600" />}
              {verified && <CheckCircle2 className="w-4 h-4 text-white" />}
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black cursor-pointer" onClick={!verifying && !verified ? handleVerify : undefined}>
                {verified ? 'Human Verification Passed' : verifying ? 'Verifying human session...' : "I am not a robot"}
              </span>
              <span className="text-[10px] text-muted font-mono">
                {verified ? 'Integrity token generated' : 'Click checkbox to authenticate'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 pl-2">
            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-700">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Turnstile</span>
            </div>
            <span className="text-[8px] text-muted font-mono">Privacy &amp; Terms</span>
          </div>
        </div>

        {onCancel && !verified && (
          <div className="flex justify-end pt-1">
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-muted hover:text-black transition px-3 py-1.5"
            >
              Cancel &amp; Return
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
