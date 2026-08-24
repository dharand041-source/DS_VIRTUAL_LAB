'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogIn, X, Sparkles, Mail, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { user, switchUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (email.toLowerCase().includes('faculty') || email.toLowerCase().includes('hod') || email.toLowerCase().includes('prof')) {
      switchUserRole('faculty');
    } else if (email.toLowerCase().includes('guest') || email.toLowerCase().includes('nit') || email.toLowerCase().includes('other')) {
      switchUserRole('other-student');
    } else {
      switchUserRole('our-student');
    }

    setLoginSuccess(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
    }, 1200);
  };

  const handleGoogleLogin = () => {
    switchUserRole('our-student');
    setLoginSuccess(true);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
    }, 1200);
  };

  const handleQuickPersona = (role: 'our-student' | 'other-student' | 'faculty') => {
    switchUserRole(role);
    setLoginSuccess(true);
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => {
      setLoginSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-md bg-white border border-border rounded-2xl shadow-floating overflow-hidden relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-border bg-surface text-muted hover:text-primary transition"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-border bg-gradient-to-b from-surface to-white">
          <div className="w-10 h-10 rounded-xl bg-primary text-white font-mono font-bold flex items-center justify-center text-base shadow-subtle mb-3">
            C
          </div>
          <h2 className="text-xl font-bold text-primary tracking-tight">
            Sign In to Virtual Lab
          </h2>
          <p className="text-xs text-secondary mt-1">
            Department of AI&DS &bull; Course N21UIT307
          </p>
        </div>

        {/* Success Alert */}
        {loginSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200 flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-primary">Signed In Successfully!</h3>
            <p className="text-xs text-secondary">
              Welcome to the laboratory session, <strong>{user.name}</strong>.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Continue with Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-border bg-white hover:bg-surface text-primary text-xs font-bold transition shadow-subtle flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                or with email
              </span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student.aids@ourcollege.edu.in"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-lg text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-lg text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold transition shadow-subtle flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </form>

            {/* Quick Demo Personas */}
            <div className="pt-3 border-t border-border">
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider block mb-2">
                Quick Demo Switcher:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => handleQuickPersona('our-student')}
                  className="p-2 rounded-lg bg-surface border border-border text-[11px] font-semibold text-primary hover:bg-white transition"
                >
                  Student (AI&DS)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona('other-student')}
                  className="p-2 rounded-lg bg-surface border border-border text-[11px] font-semibold text-primary hover:bg-white transition"
                >
                  Guest Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPersona('faculty')}
                  className="p-2 rounded-lg bg-surface border border-border text-[11px] font-semibold text-primary hover:bg-white transition"
                >
                  Faculty HOD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
