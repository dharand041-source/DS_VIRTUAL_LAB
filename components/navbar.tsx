'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  Code2,
  BookOpen,
  LayoutDashboard,
  Trophy,
  GraduationCap,
  Sparkles,
  Flame,
  Shield,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, switchUserRole, isOurCollegeStudent, isFaculty, isGuest } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const navLinks = [
    { name: 'Syllabus', href: '/syllabus', icon: BookOpen },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Flagship Lab', href: '/lab/exp-01-singly-linked-list', icon: Code2 },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Faculty Portal', href: '/faculty', icon: GraduationCap, facultyOnly: false },
    { name: 'About', href: '/about', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs shadow-subtle group-hover:bg-primary-hover transition">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary tracking-tight">
                DATA STRUCTURES LAB
              </span>
              <span className="text-[9px] font-mono text-muted -mt-0.5">
                Virtual Laboratory (C)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-surface text-primary font-semibold border border-border'
                      : 'text-secondary hover:text-primary hover:bg-surface-subtle'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Gamification XP & User Role Switcher */}
        <div className="flex items-center gap-3">
          {/* XP & Streak Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-surface text-xs font-mono font-bold text-primary shadow-subtle">
              <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
              <span>{user.xp} XP</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-surface text-xs font-mono font-semibold text-accent-amber shadow-subtle">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{user.streakDays}d Streak</span>
            </div>
          </div>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-white hover:bg-surface transition shadow-subtle text-left"
            >
              <div className="w-6 h-6 rounded-full bg-surface-subtle border border-border flex items-center justify-center text-[10px] font-bold text-primary">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-[11px] font-bold text-primary leading-none truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="text-[9px] text-muted font-mono leading-tight mt-0.5">
                  {user.isOurCollege ? 'Our College' : 'Other College'} • {user.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted" />
            </button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-white shadow-floating p-2 z-50 animate-fade-in"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-2 py-1.5 border-b border-border mb-1">
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                    Switch Test Account / Role
                  </span>
                </div>

                <button
                  onClick={() => switchUserRole('our-student')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col ${
                    user.isOurCollege && user.role === 'student' ? 'bg-surface font-semibold border border-border' : 'hover:bg-surface-subtle'
                  }`}
                >
                  <span className="text-primary font-bold">Aarav Sharma</span>
                  <span className="text-[10px] text-muted">Our College Student (Full Access)</span>
                </button>

                <button
                  onClick={() => switchUserRole('other-student')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col ${
                    !user.isOurCollege && user.role === 'student' ? 'bg-surface font-semibold border border-border' : 'hover:bg-surface-subtle'
                  }`}
                >
                  <span className="text-primary font-bold">Priya Nair</span>
                  <span className="text-[10px] text-muted">Other College (Public Learning Access)</span>
                </button>

                <button
                  onClick={() => switchUserRole('faculty')}
                  className={`w-full text-left p-2 rounded-lg text-xs transition flex flex-col ${
                    user.role === 'faculty' ? 'bg-surface font-semibold border border-border' : 'hover:bg-surface-subtle'
                  }`}
                >
                  <span className="text-primary font-bold">Dr. K. Rajasekaran</span>
                  <span className="text-[10px] text-muted">Faculty / Staff (Full Authority)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
