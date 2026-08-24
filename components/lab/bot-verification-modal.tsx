'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle, RefreshCw, Lock } from 'lucide-react';

interface BotVerificationModalProps {
  isOpen: boolean;
  onVerified: () => void;
  onCancel?: () => void;
  title?: string;
}

export function BotVerificationModal({
  isOpen,
  onVerified,
  onCancel,
  title = "Security Verification: Human Check"
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
      }, 500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-border shadow-floating max-w-sm w-full p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">{title}</h3>
            <p className="text-xs text-muted">Cloudflare Turnstile Verification</p>
          </div>
        </div>

        <p className="text-xs text-secondary mb-5 leading-relaxed">
          To maintain laboratory integrity and prevent automated bot execution, please complete the verification below.
        </p>

        {/* Turnstile Box */}
        <div className="p-3 border border-border rounded-lg bg-surface flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVerify}
              disabled={verifying || verified}
              className={`w-6 h-6 rounded border flex items-center justify-center transition ${
                verified
                  ? 'bg-accent-emerald border-accent-emerald text-white'
                  : verifying
                  ? 'border-primary bg-white cursor-wait'
                  : 'border-zinc-400 bg-white hover:border-primary'
              }`}
            >
              {verifying && <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />}
              {verified && <CheckCircle className="w-4 h-4 fill-current" />}
            </button>
            <span className="text-xs font-medium text-primary">
              {verified ? 'Verification Successful' : verifying ? 'Verifying session...' : "I am not a robot"}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <ShieldCheck className="w-4 h-4 text-muted" />
            <span className="text-[9px] text-muted font-mono mt-0.5">Turnstile</span>
          </div>
        </div>

        {onCancel && !verified && (
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="text-xs text-muted hover:text-primary transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
