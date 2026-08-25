'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Info,
  ArrowLeft
} from 'lucide-react';
import { triggerTopLoadingBar } from '@/components/ui/top-progress-bar';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [boardType, setBoardType] = useState<'college' | 'global'>('college');
  const [pendingBoardType, setPendingBoardType] = useState<'college' | 'global' | null>(null);

  const switchBoard = (type: 'college' | 'global') => {
    if (type === boardType || pendingBoardType) return;
    setPendingBoardType(type);
    triggerTopLoadingBar(() => {
      setBoardType(type);
      setPendingBoardType(null);
    }, 1800);
  };

  // Strictly deduplicated and ranked active leaderboard dataset
  const activeList = React.useMemo(() => {
    const rawList = boardType === 'college' ? SEEDED_COLLEGE_LEADERBOARD : SEEDED_GLOBAL_LEADERBOARD;
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const result: typeof rawList = [];

    for (const entry of rawList) {
      const normalizedName = entry.name.replace(' (You)', '').trim().toLowerCase();
      if (!seenIds.has(entry.userId) && !seenNames.has(normalizedName)) {
        seenIds.add(entry.userId);
        seenNames.add(normalizedName);
        result.push(entry);
      }
    }

    return result.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }, [boardType]);

  return (
    <div className="flex-1 bg-surface-subtle py-8 px-4 sm:px-6 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-red-600" />
              <h1 className="text-2xl font-black text-black tracking-tight">
                Weekly Learning Leaderboard
              </h1>
            </div>
            <p className="text-xs text-secondary">
              Refreshes weekly every Sunday at 23:59 IST • XP earned exclusively from validated learning accomplishments.
            </p>
          </div>

          {/* Weekly Countdown Timer */}
          <div className="bg-surface p-3 rounded-lg border border-border text-left sm:text-right shrink-0">
            <span className="text-[10px] font-mono text-muted uppercase block">Weekly Cycle Ends In</span>
            <span className="text-sm font-bold font-mono text-black flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-red-600" />
              4 Days 11 Hours
            </span>
          </div>
        </div>

        {/* Leaderboard Category Tabs & Filter */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl border border-border shadow-subtle gap-1">
            <button
              onClick={() => switchBoard('college')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                boardType === 'college'
                  ? 'bg-red-600 text-white shadow-red'
                  : pendingBoardType === 'college'
                  ? 'bg-red-50 text-red-600 font-bold animate-pulse'
                  : 'text-secondary hover:text-black hover:bg-surface'
              }`}
            >
              <Medal className="w-3.5 h-3.5" />
              <span>{pendingBoardType === 'college' ? 'Loading Department...' : 'Department Standings (AI&DS)'}</span>
            </button>

            <button
              onClick={() => switchBoard('global')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                boardType === 'global'
                  ? 'bg-black text-white shadow-subtle'
                  : pendingBoardType === 'global'
                  ? 'bg-red-50 text-red-600 font-bold animate-pulse'
                  : 'text-secondary hover:text-black hover:bg-surface'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{pendingBoardType === 'global' ? 'Loading Global...' : 'Global Standings (All Colleges)'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
            <span>Privacy Protected</span>
          </div>
        </div>

        {/* Leaderboard Table Card */}
        <div className="academic-card bg-white border border-border rounded-xl shadow-subtle overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
              {boardType === 'college' ? 'Department of AI&DS • Class Rankings' : 'Global Institution Rankings'}
            </span>
            <span className="text-[11px] font-mono text-muted">
              {activeList.length} Top Learners
            </span>
          </div>

          <div className="divide-y divide-border">
            {activeList.map((entry) => {
              const isCurrentUser = entry.userId === user.id || entry.name.includes('(You)');
              const cleanName = entry.name.replace(' (You)', '');

              return (
                <div
                  key={entry.userId + entry.rank}
                  className={`px-5 py-3.5 flex items-center justify-between transition ${
                    isCurrentUser ? 'bg-red-50/50 border-l-4 border-l-red-600 font-semibold' : 'hover:bg-surface-subtle'
                  }`}
                >
                  {/* Left: Rank & Student Profile */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        entry.rank === 1
                          ? 'bg-red-600 text-white shadow-xs'
                          : entry.rank === 2
                          ? 'bg-zinc-800 text-white'
                          : entry.rank === 3
                          ? 'bg-zinc-600 text-white'
                          : 'bg-surface text-secondary border border-border'
                      }`}
                    >
                      {entry.rank}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black">{cleanName}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-300">
                            (You)
                          </span>
                        )}
                        {entry.rank === 1 && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-700">
                            👑 Rank 1
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-secondary font-mono">
                        {entry.collegeName} &bull; {entry.isOurCollege ? 'AI & DS' : 'Computing Sciences'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Score & Badges */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-red-600">
                      {entry.xp} XP
                    </div>
                    <span className="text-[10px] font-mono text-muted">
                      {entry.experimentsCompleted} Exps Done
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gamification Rules Box */}
        <div className="p-4 bg-white rounded-xl border border-border flex items-start gap-3 shadow-subtle">
          <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-black">Fair Play & Autonomous Scoring Criteria</h4>
            <p className="text-[11px] text-secondary leading-relaxed">
              XP points are automatically awarded on successful execution of C compiler test cases (+50 XP), Assessment Quizzes (+30 XP), 10s Viva challenges (+100 XP), and Educational Feedback (+10 XP). Leaderboards reset every Sunday at midnight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
