'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { getStoredSubmissions } from '@/lib/storage';
import {
  LayoutDashboard,
  CheckCircle2,
  Trophy,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  Play,
  Lightbulb,
  Clock,
  FileCheck,
  ArrowLeft
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const submissions = getStoredSubmissions();

  const totalExps = SYLLABUS_EXPERIMENTS.length;
  const completedCount = user.completedExperiments.length;
  const progressPercent = Math.round((completedCount / totalExps) * 100);

  // Next recommended experiment
  const nextExp = SYLLABUS_EXPERIMENTS.find(e => !user.completedExperiments.includes(e.id)) || SYLLABUS_EXPERIMENTS[0];

  return (
    <div className="flex-1 bg-surface py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
              STUDENT DASHBOARD • {user.isOurCollege ? 'COLLEGE REGULATION ALIGNED' : 'PUBLIC LEARNING ACCESS'}
            </span>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs text-secondary mt-1">
              {user.collegeName} {user.year && `• ${user.year}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface p-3 rounded-lg border border-border text-center">
              <span className="text-[10px] font-mono text-muted uppercase block">Total XP</span>
              <span className="text-base font-bold font-mono text-primary flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
                {user.xp}
              </span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-border text-center">
              <span className="text-[10px] font-mono text-muted uppercase block">Streak</span>
              <span className="text-base font-bold font-mono text-accent-amber flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {user.streakDays} Days
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Next Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Progress Card */}
          <div className="academic-card p-6 bg-white md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Laboratory Progress</h3>
                <p className="text-base font-bold text-primary mt-0.5">Data Structures Lab</p>
              </div>
              <span className="text-sm font-bold font-mono text-primary">{progressPercent}% Completed</span>
            </div>

            {/* Visual Progress Meter */}
            <div className="w-full bg-surface-subtle h-3 rounded-full overflow-hidden border border-border p-0.5">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-border">
              <span>Completed: <strong className="text-primary">{completedCount} / {totalExps}</strong></span>
              <span>Pending: <strong className="text-primary">{totalExps - completedCount} Experiments</strong></span>
            </div>
          </div>

          {/* Recommended Next Action */}
          <div className="academic-card p-6 bg-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-accent-amber mb-2">
                <Lightbulb className="w-4 h-4" />
                <span>AI Recommendation</span>
              </div>
              <h4 className="text-sm font-bold text-primary mb-1">
                {nextExp.title}
              </h4>
              <p className="text-xs text-secondary line-clamp-2">
                {nextExp.aim}
              </p>
            </div>

            <Link
              href={`/lab/${nextExp.id}`}
              className="mt-4 w-full py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition shadow-subtle flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Continue Experiment
            </Link>
          </div>
        </div>

        {/* AI Weak Area & Improvement Diagnostics */}
        <div className="academic-card p-6 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent-indigo" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Personalized Learning Diagnostics
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-emerald-50/40 border border-emerald-200">
              <span className="font-bold text-accent-emerald block mb-1">Demonstrated Strong Areas:</span>
              <ul className="list-disc list-inside text-secondary space-y-1">
                <li>Stack ADT LIFO push/pop boundary checks</li>
                <li>Self-referential structure node definitions</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50/40 border border-amber-200">
              <span className="font-bold text-accent-amber block mb-1">Areas for Practice & Improvement:</span>
              <ul className="list-disc list-inside text-secondary space-y-1">
                <li>Heap memory deallocation with free(temp) to prevent memory leaks</li>
                <li>Multiple pointer traversal boundary conditions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="academic-card p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Laboratory Submissions & Marks</h3>
              <p className="text-sm font-bold text-primary">Anna University 75-Mark Evaluation Scheme</p>
            </div>
            <span className="text-xs text-muted font-mono">{submissions.length} Submissions Logged</span>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface border-b border-border text-muted font-mono">
                <tr>
                  <th className="py-2.5 px-3">Experiment</th>
                  <th className="py-2.5 px-3">Test Cases</th>
                  <th className="py-2.5 px-3">Total Marks (/75)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-subtle transition">
                    <td className="py-3 px-3 font-semibold text-primary">{sub.experimentTitle}</td>
                    <td className="py-3 px-3 font-mono">{sub.passedCount}/{sub.totalCount} Passed</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {sub.marks.total} / 75
                      <span className="text-[10px] text-muted block font-sans">
                        Code: {sub.marks.coding} | Viva: {sub.marks.viva} | Assmt: {sub.marks.assessment}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200">
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted text-[11px] font-mono">{sub.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Badges Showcase */}
        <div className="academic-card p-6 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Earned Academic Badges</h3>
            <span className="text-xs text-muted font-mono">{user.badges.length} Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {user.badges.map((b) => (
              <div key={b.id} className="p-3.5 rounded-lg border border-border bg-surface flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-primary">{b.name}</h4>
                  <p className="text-[11px] text-muted">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
