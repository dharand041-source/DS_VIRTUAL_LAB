'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { getStoredSubmissions } from '@/lib/storage';
import {
  ArrowRight,
  BookOpen,
  Play,
  Terminal,
  Sparkles,
  Flame,
  LayoutDashboard,
  Award,
  CheckCircle2,
  Lightbulb,
  Clock,
  Layers,
  ChevronRight,
  Zap,
  MessageSquare
} from 'lucide-react';

import { InteractiveLearningDemo } from '@/components/home/interactive-learning-demo';

export default function HomePage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const submissions = getStoredSubmissions();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalExps = SYLLABUS_EXPERIMENTS.length;
  const completedCount = mounted ? user.completedExperiments?.length || 0 : 0;
  const progressPercent = Math.round((completedCount / totalExps) * 100);

  // Next recommended experiment
  const nextExp =
    SYLLABUS_EXPERIMENTS.find((e) => !user.completedExperiments?.includes(e.id)) ||
    SYLLABUS_EXPERIMENTS[0];

  return (
    <div className="flex-1 flex flex-col bg-white select-none">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-b from-surface-subtle/50 to-white py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Academic Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-xs font-medium text-red-700 mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>Anna University Regulation Aligned • Department of AI&DS</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-black max-w-3xl leading-[1.1] mb-6">
            Data Structures <br />
            <span className="text-red-600 font-black">Virtual Lab</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-secondary max-w-2xl font-normal leading-relaxed mb-8">
            An interactive Data Structures Virtual Lab that explains your C program line by line and visualizes how your data structures change dynamically in memory as you code.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/compiler"
              className="btn btn-outline-danger btn-lg group"
            >
              <Terminal className="w-4 h-4" />
              <span>C Online Compiler</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/experiments"
              className="btn btn-outline-dark btn-lg"
            >
              <Layers className="w-4 h-4" />
              <span>Explore 10 Experiments</span>
            </Link>

            <Link
              href="/dashboard"
              className="btn btn-outline-primary btn-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Student Dashboard</span>
            </Link>
          </div>

          {/* Interactive Beginner Learning Demo with Visualizer */}
          <InteractiveLearningDemo />
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="academic-card p-5 hover:border-red-300 transition-colors">
            <span className="text-2xl mb-3 block">⚡</span>
            <h3 className="text-sm font-bold text-black mb-1">C Sandbox & Line-by-Line AI</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Every line of code is mapped to its syntactic purpose, RAM memory changes, and algorithmic complexity.
            </p>
          </div>

          <div className="academic-card p-5 hover:border-red-300 transition-colors">
            <span className="text-2xl mb-3 block">🎓</span>
            <h3 className="text-sm font-bold text-black mb-1">Our College Evaluation</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Full Anna University curriculum access, 75-mark evaluation scheme, typing viva tests, and internal college leaderboard.
            </p>
          </div>

          <div className="academic-card p-5 hover:border-red-300 transition-colors">
            <span className="text-2xl mb-3 block">🌐</span>
            <h3 className="text-sm font-bold text-black mb-1">Guest & Other Colleges</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Open public demonstrations, interactive C code visualizer, and global learning leaderboard with complete privacy protection.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STUDENT DASHBOARD OVERVIEW
         ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 bg-surface border-t border-border w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Section Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-[11px] font-mono font-bold text-red-700 mb-1.5 shadow-subtle">
                <LayoutDashboard className="w-3.5 h-3.5 text-red-600" />
                <span>STUDENT LEARNING DASHBOARD</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                Welcome back, {user.name}
              </h2>
              <p className="text-xs text-secondary">
                {user.collegeName} &bull; {user.departmentName} ({user.year || 'II Year / III Sem'})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-black hover:border-red-300 hover:text-red-600 transition shadow-subtle flex items-center gap-1.5"
              >
                <span>Full Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics & Progress Tracker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Progress Meter Card */}
            <div className="academic-card p-5 bg-white border border-border rounded-xl shadow-subtle md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                    Laboratory Curriculum Progress
                  </h3>
                  <p className="text-sm font-bold text-black mt-0.5">
                    Course N21UIT307 • Anna University Regulation 2021
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-red-600">
                  {progressPercent}% Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface h-3 rounded-full overflow-hidden border border-border p-0.5">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-secondary pt-2 border-t border-border gap-2">
                <span>
                  Completed: <strong className="text-black font-mono">{completedCount} / {totalExps}</strong> Experiments
                </span>
                <span>
                  Total Earned: <strong className="text-red-600 font-mono font-bold">{user.xp} XP</strong>
                </span>
                <Link
                  href="/experiments"
                  className="text-black hover:text-red-600 font-bold flex items-center gap-1 transition-colors"
                >
                  View all 10 experiments &rarr;
                </Link>
              </div>
            </div>

            {/* Next Recommended Experiment Card */}
            <div className="academic-card p-5 bg-white border border-border rounded-xl shadow-subtle flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 mb-2">
                  <Lightbulb className="w-4 h-4 text-red-600" />
                  <span>Next Recommended Activity</span>
                </div>
                <h4 className="text-sm font-bold text-black line-clamp-1">
                  EXP {nextExp.expNumber < 10 ? `0${nextExp.expNumber}` : nextExp.expNumber}: {nextExp.shortTitle}
                </h4>
                <p className="text-[11px] text-secondary mt-1 line-clamp-2 leading-relaxed">
                  {nextExp.aim}
                </p>
              </div>

              <div className="pt-3 border-t border-border mt-3">
                <Link
                  href={`/experiments/${nextExp.id}`}
                  className="w-full py-2 px-3 rounded-lg bg-black hover:bg-red-600 text-white text-xs font-bold transition shadow-subtle flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-white" />
                  <span>Continue Experiment</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Badges & Recent Achievements Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">Total Experience</span>
                <span className="text-sm font-black font-mono text-black">{user.xp} XP</span>
              </div>
            </div>

            <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-200">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">Active Streak</span>
                <span className="text-sm font-black font-mono text-black">{user.streakDays || 5} Days</span>
              </div>
            </div>

            <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-sm border border-red-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted uppercase block">Earned Badges</span>
                <span className="text-sm font-black font-mono text-black">{user.badges?.length || 4} Badges</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
