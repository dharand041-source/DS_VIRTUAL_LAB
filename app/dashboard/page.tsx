'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import {
  getStoredSubmissions,
  getContinueLearningInfo,
  getStoredStageProgress,
  getPersonalizedRecommendations,
  DEFAULT_LMS_COURSE,
  LMS_STAGE_ORDER,
  LMS_STAGE_METADATA
} from '@/lib/storage';
import { LMSStage, LMSStageStatus } from '@/lib/types';
import {
  BookOpen,
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
  Code2,
  Eye,
  Check,
  Layers,
  GraduationCap,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const submissions = getStoredSubmissions();
  const continueInfo = getContinueLearningInfo(user.id);
  const recommendations = getPersonalizedRecommendations(user.id);

  const totalExps = SYLLABUS_EXPERIMENTS.length;
  const completedCount = user.completedExperiments?.length || 0;
  const progressPercent = Math.round((completedCount / totalExps) * 100);

  // Active experiment for continue learning
  const activeExp = SYLLABUS_EXPERIMENTS.find(e => e.id === continueInfo.experimentId) || SYLLABUS_EXPERIMENTS[0];

  return (
    <div className="flex-1 bg-surface-subtle py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* =========================================================================
            LMS COURSE CONTAINER HEADER BANNER
           ========================================================================= */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-[11px] font-mono font-bold text-red-700">
                COURSE: {DEFAULT_LMS_COURSE.code} • {DEFAULT_LMS_COURSE.regulation}
              </span>
              <span className="text-xs font-mono text-muted">
                {user.isOurCollege ? 'COLLEGE REGULATION ALIGNED' : 'OPEN ACCESS LEARNER'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              {DEFAULT_LMS_COURSE.title}
            </h1>
            <p className="text-xs text-secondary mt-1">
              {user.name} &bull; {user.collegeName} {user.year && `• ${user.year}`} {user.section && `(${user.section})`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface p-3 rounded-lg border border-border text-center min-w-[80px]">
              <span className="text-[10px] font-mono text-muted uppercase block">Total XP</span>
              <span className="text-base font-black font-mono text-black flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-red-600" />
                {mounted ? user.xp : 0}
              </span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-border text-center min-w-[80px]">
              <span className="text-[10px] font-mono text-muted uppercase block">Streak</span>
              <span className="text-base font-black font-mono text-red-600 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {user.streakDays || 5} Days
              </span>
            </div>

            <div className="bg-surface p-3 rounded-lg border border-border text-center min-w-[80px]">
              <span className="text-[10px] font-mono text-muted uppercase block">Rank</span>
              <span className="text-base font-black font-mono text-black flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                #4
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONTINUE LEARNING & COURSE PROGRESS GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Prominent Continue Learning Card (7 cols) */}
          <div className="lg:col-span-7 academic-card p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                  <Play className="w-4 h-4 fill-current" />
                  <span className="uppercase tracking-wider font-mono">CONTINUE LEARNING</span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                  {continueInfo.completionPercentage}% Unit Complete
                </span>
              </div>

              <h2 className="text-lg font-black text-black">
                EXP {activeExp.expNumber < 10 ? `0${activeExp.expNumber}` : activeExp.expNumber}: {activeExp.title}
              </h2>
              <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                {activeExp.aim}
              </p>

              {/* Learning Stages Checklist Progress Indicator */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono block">
                  Learning Unit Stage Progression:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'aim_theory', label: 'Theory & Aim', icon: BookOpen },
                    { id: 'algorithm', label: 'Algorithm', icon: Layers },
                    { id: 'coding', label: 'C Code Lab', icon: Code2 },
                    { id: 'visualization', label: 'Visualizer', icon: Eye },
                    { id: 'practice', label: 'Practice Tests', icon: Play },
                    { id: 'assessment', label: 'Assessment', icon: FileCheck },
                    { id: 'viva', label: '10s Viva', icon: Clock },
                    { id: 'submission', label: 'Lab Submit', icon: Award },
                    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
                  ].map((st) => {
                    const status = (continueInfo.stagesStatus as Record<string, LMSStageStatus>)[st.id] || 'NOT_STARTED';
                    const isCurrent = continueInfo.activeStage === st.id;
                    const isDone = status === 'COMPLETED';

                    return (
                      <div
                        key={st.id}
                        className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
                          isDone
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-bold'
                            : isCurrent
                            ? 'bg-red-50 border-red-300 text-red-700 font-bold shadow-xs'
                            : 'bg-surface border-border text-muted font-medium'
                        }`}
                      >
                        {isDone ? (
                          <Check className="w-3.5 h-3.5 text-accent-emerald shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping shrink-0" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                        )}
                        <span className="truncate text-[11px]">{st.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <div className="text-xs text-secondary">
                Next up: <strong className="text-black">{continueInfo.activeStageName}</strong>
              </div>

              <Link
                href={`/experiments/${activeExp.id}`}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-red transition shrink-0"
              >
                <span>Resume {continueInfo.activeStageName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Overall Course Progress & Metrics (5 cols) */}
          <div className="lg:col-span-5 academic-card p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                    LMS Course Completion
                  </h3>
                  <p className="text-base font-black text-black mt-0.5">
                    Data Structures Laboratory
                  </p>
                </div>
                <span className="text-lg font-black font-mono text-red-600">
                  {progressPercent}%
                </span>
              </div>

              {/* Visual Progress Meter */}
              <div className="w-full bg-surface h-3 rounded-full overflow-hidden border border-border p-0.5 my-3">
                <div
                  className="bg-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/60">
                  <span className="text-secondary">Completed Experiments:</span>
                  <strong className="text-black font-mono">{completedCount} of {totalExps}</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/60">
                  <span className="text-secondary">Pending Experiments:</span>
                  <strong className="text-red-600 font-mono">{totalExps - completedCount} Units</strong>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/60">
                  <span className="text-secondary">Evaluated Lab Records:</span>
                  <strong className="text-black font-mono">{submissions.filter(s => s.status === 'evaluated').length} Records</strong>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary">Academic Viva Star Rating:</span>
                  <strong className="text-emerald-700 font-mono">100% Viva Success</strong>
                </div>
              </div>
            </div>

            <Link
              href="/syllabus"
              className="w-full py-2.5 rounded-lg border border-black bg-white hover:bg-black hover:text-white text-black text-xs font-bold flex items-center justify-center gap-2 transition shadow-subtle mt-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Full Course Syllabus</span>
            </Link>
          </div>
        </div>

        {/* =========================================================================
            LMS EXPERIMENT LEARNING UNITS MATRIX (ALL 10 EXPERIMENTS)
           ========================================================================= */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black text-black">
                  Curriculum Learning Units & Stage Status
                </h3>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Anna University N21UIT307 • Complete all 9 stages in each experiment module
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-muted">
              {completedCount} / 10 Units Mastered
            </span>
          </div>

          <div className="space-y-3">
            {SYLLABUS_EXPERIMENTS.map((exp) => {
              const progress = getStoredStageProgress(user.id, exp.id);
              const isCompleted = user.completedExperiments?.includes(exp.id);

              return (
                <div
                  key={exp.id}
                  className={`p-4 rounded-xl border transition ${
                    isCompleted
                      ? 'bg-surface/50 border-border'
                      : progress.overallStatus === 'IN_PROGRESS'
                      ? 'bg-red-50/30 border-red-200'
                      : 'bg-white border-border hover:border-zinc-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-black text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {exp.expNumber < 10 ? `0${exp.expNumber}` : exp.expNumber}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-surface border border-border text-secondary">
                            {exp.category}
                          </span>

                          {isCompleted ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          ) : progress.overallStatus === 'IN_PROGRESS' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-accent-amber border border-amber-200">
                              In Progress ({progress.completionPercentage}%)
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface text-muted">
                              Not Started
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-black">{exp.title}</h4>
                        <p className="text-xs text-secondary mt-0.5 line-clamp-1">{exp.aim}</p>

                        {/* Stage Dots */}
                        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-border/40 text-[11px] font-mono text-muted">
                          <span className={progress.stages.aim_theory.status === 'COMPLETED' ? 'text-accent-emerald font-bold' : ''}>
                            {progress.stages.aim_theory.status === 'COMPLETED' ? '✓' : '○'} Theory
                          </span>
                          <span>&bull;</span>
                          <span className={progress.stages.coding.status === 'COMPLETED' ? 'text-accent-emerald font-bold' : ''}>
                            {progress.stages.coding.status === 'COMPLETED' ? '✓' : '○'} C Code
                          </span>
                          <span>&bull;</span>
                          <span className={progress.stages.assessment.status === 'COMPLETED' ? 'text-accent-emerald font-bold' : ''}>
                            {progress.stages.assessment.status === 'COMPLETED' ? '✓' : '○'} Assessment
                          </span>
                          <span>&bull;</span>
                          <span className={progress.stages.viva.status === 'COMPLETED' ? 'text-accent-emerald font-bold' : ''}>
                            {progress.stages.viva.status === 'COMPLETED' ? '✓' : '○'} 10s Viva
                          </span>
                          <span>&bull;</span>
                          <span className={progress.stages.submission.status === 'COMPLETED' ? 'text-accent-emerald font-bold' : ''}>
                            {progress.stages.submission.status === 'COMPLETED' ? '✓' : '○'} Lab Submit
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <Link
                        href={`/experiments/${exp.id}`}
                        className="px-3.5 py-1.5 rounded-lg border border-black bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-black text-xs font-bold transition shadow-subtle flex items-center gap-1"
                      >
                        <span>{isCompleted ? 'Review Unit' : 'Open Unit'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            AI PERSONALIZED LEARNING RECOMMENDATIONS
           ========================================================================= */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-base font-black text-black">
                Personalized Learning Diagnostic Recommendations
              </h3>
              <p className="text-xs text-secondary">
                Rule-based diagnostic feedback pointing directly to relevant syllabus units
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-border bg-surface/50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 uppercase">
                      EXP {rec.experimentNumber < 10 ? `0${rec.experimentNumber}` : rec.experimentNumber} &bull; {rec.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase font-mono">
                      {rec.priority} Priority
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-black">{rec.topic}</h4>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">{rec.reason}</p>
                </div>

                <Link
                  href={rec.actionUrl}
                  className="w-full py-1.5 px-3 rounded-lg border border-border bg-white hover:bg-surface text-black text-xs font-bold transition shadow-subtle flex items-center justify-center gap-1"
                >
                  <span>Open {rec.experimentTitle.slice(0, 22)}...</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            RECENT SUBMISSIONS & FACULTY MARKS (ANNA UNIVERSITY 75M SCHEME)
           ========================================================================= */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                Official Laboratory Records & Faculty Evaluation
              </h3>
              <p className="text-sm font-bold text-black">Anna University 75-Mark Evaluation Scheme</p>
            </div>
            <span className="text-xs text-muted font-mono">{submissions.length} Records Logged</span>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface border-b border-border text-muted font-mono">
                <tr>
                  <th className="py-2.5 px-3">Experiment Unit</th>
                  <th className="py-2.5 px-3">Test Cases</th>
                  <th className="py-2.5 px-3">Total Marks (/75)</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-subtle transition">
                    <td className="py-3 px-3 font-semibold text-black">{sub.experimentTitle}</td>
                    <td className="py-3 px-3 font-mono">{sub.passedCount}/{sub.totalCount} Passed</td>
                    <td className="py-3 px-3 font-mono font-bold text-black">
                      {sub.marks.total} / 75
                      <span className="text-[10px] text-muted block font-sans">
                        Code: {sub.marks.coding} | Viva: {sub.marks.viva} | Assmt: {sub.marks.assessment} | Obs: {sub.marks.facultyObservation}
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

        {/* =========================================================================
            EARNED ACADEMIC BADGES
           ========================================================================= */}
        <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
              Earned Academic Badges & Milestones
            </h3>
            <span className="text-xs text-muted font-mono">{user.badges?.length || 0} Unlocked</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {user.badges?.map((b) => (
              <div key={b.id} className="p-3.5 rounded-lg border border-border bg-surface flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-black">{b.name}</h4>
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

