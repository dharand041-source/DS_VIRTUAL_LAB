'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  SEEDED_COLLEGE_LEADERBOARD,
  SEEDED_GLOBAL_LEADERBOARD
} from '@/lib/storage';
import {
  Trophy,
  Medal,
  Award,
  Clock,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Info
} from 'lucide-react';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [boardType, setBoardType] = useState<'college' | 'global'>('college');

  const collegeList = SEEDED_COLLEGE_LEADERBOARD; // Top 5
  const globalList = SEEDED_GLOBAL_LEADERBOARD; // Top 10

  const activeList = boardType === 'college' ? collegeList : globalList;

  return (
    <div className="flex-1 bg-surface py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-accent-amber" />
              <h1 className="text-2xl font-bold text-primary tracking-tight">
                WEEKLY LEARNING LEADERBOARD
              </h1>
            </div>
            <p className="text-xs text-secondary">
              Refreshes weekly every Sunday at 23:59 IST • XP earned exclusively from validated learning accomplishments.
            </p>
          </div>

          {/* Weekly Countdown Timer */}
          <div className="bg-surface p-3 rounded-lg border border-border text-left sm:text-right shrink-0">
            <span className="text-[10px] font-mono text-muted uppercase block">Weekly Cycle Ends In</span>
            <span className="text-sm font-bold font-mono text-primary flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-accent-blue" />
              4 Days 11 Hours
            </span>
          </div>
        </div>

        {/* Target Rank Motivation Box */}
        <div className="academic-card p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-subtle border border-border flex items-center justify-center font-bold font-mono text-primary">
              #4
            </div>
            <div>
              <span className="text-xs font-bold text-primary">Your Current College Standing</span>
              <p className="text-xs text-muted">Aarav Sharma • 540 Learning XP</p>
            </div>
          </div>

          <div className="text-xs text-secondary flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent-emerald" />
            <span>Next Target: <strong className="text-primary">Rank #3 (Karthik Raja)</strong> — 150 XP needed</span>
          </div>
        </div>

        {/* Leaderboard Category Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white p-1 rounded-lg border border-border shadow-subtle">
            <button
              onClick={() => setBoardType('college')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                boardType === 'college'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <Medal className="w-3.5 h-3.5" />
              <span>Our College (Top 5 Only)</span>
            </button>

            <button
              onClick={() => setBoardType('global')}
              className={`px-4 py-2 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                boardType === 'global'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Global Standings (Top 10 Only)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Privacy Protected: Private marks & emails hidden</span>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="academic-card bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {boardType === 'college' ? 'Department of CSE • College Top 5' : 'Global Top 10 Learners'}
            </span>
            <span className="text-[11px] font-mono text-muted">
              Cycle: Mon 00:00 - Sun 23:59
            </span>
          </div>

          <div className="divide-y divide-border">
            {activeList.map((entry) => {
              const isCurrentUser = entry.userId === user.id || entry.name.includes('(You)');

              return (
                <div
                  key={entry.userId}
                  className={`px-5 py-3.5 flex items-center justify-between transition ${
                    isCurrentUser ? 'bg-zinc-50 font-semibold' : 'hover:bg-surface-subtle'
                  }`}
                >
                  {/* Left: Rank & Avatar */}
                  <div className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                      entry.rank === 1
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : entry.rank === 2
                        ? 'bg-zinc-200 text-zinc-800 border border-zinc-300'
                        : entry.rank === 3
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-surface text-muted border border-border'
                    }`}>
                      {entry.rank}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-surface-subtle border border-border flex items-center justify-center font-mono font-bold text-xs text-primary">
                      {entry.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{entry.name}</span>
                        {isCurrentUser && (
                          <span className="text-[9px] font-mono bg-primary text-white px-1.5 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted">{entry.collegeName}</span>
                    </div>
                  </div>

                  {/* Right: XP & Badges */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-primary flex items-center justify-end gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent-amber" />
                        {entry.xp} XP
                      </span>
                      <span className="text-[10px] text-muted font-mono">
                        +{entry.weeklyXp} XP this week
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted font-mono bg-surface px-2.5 py-1 rounded border border-border">
                      <Award className="w-3.5 h-3.5 text-muted" />
                      <span>{entry.badgesCount} Badges</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Notice */}
        <div className="p-4 rounded-lg bg-surface border border-border flex items-start gap-2.5 text-xs text-secondary">
          <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-primary font-semibold">Important Academic Notice:</strong> XP is a motivational gamification reward and is <strong>completely separate</strong> from official Anna University laboratory continuous assessment marks. Faculty evaluation remains the sole authority for official academic grades.
          </p>
        </div>
      </div>
    </div>
  );
}
