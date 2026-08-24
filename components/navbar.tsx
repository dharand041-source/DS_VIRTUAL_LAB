'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LoginModal } from '@/components/auth/login-modal';
import {
  Home,
  Layers,
  Terminal,
  Trophy,
  GraduationCap,
  LogIn,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isNotHome = pathname !== '/';

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Experiments', href: '/experiments', icon: Layers },
    { name: 'Online Compiler', href: '/compiler', icon: Terminal },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Faculty', href: '/faculty', icon: GraduationCap }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-md select-none shadow-xs">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Left: Brand Identity, Back Button (on non-home tabs) & Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Universal Back Button for non-home pages */}
            {isNotHome && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-secondary text-xs font-semibold shadow-xs transition"
                title="Go Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}

            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white font-mono font-extrabold text-sm shadow-subtle group-hover:bg-red-600 transition-colors">
                C
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-black tracking-tight leading-none group-hover:text-red-600 transition-colors">
                  DATA STRUCTURES LAB
                </span>
                <span className="text-[9px] font-mono text-muted mt-0.5 leading-none">
                  Department of AI&DS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname === link.href || pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      isActive
                        ? 'bg-red-50 text-red-600 border border-red-200 font-bold shadow-xs'
                        : 'text-secondary hover:text-black hover:bg-surface-subtle'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-600' : 'text-muted'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Only the Login Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-black text-xs font-bold transition shadow-subtle flex items-center gap-2 group"
            >
              <LogIn className="w-3.5 h-3.5 group-hover:text-white text-red-600" />
              <span>Login</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-border bg-white text-secondary hover:text-black transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-3 space-y-1 shadow-floating animate-fade-in">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-red-50 text-red-600 border border-red-200 font-bold'
                      : 'text-secondary hover:text-black hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-muted'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Interactive Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
