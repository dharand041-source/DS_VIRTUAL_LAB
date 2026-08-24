'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { useAuth } from '@/lib/auth-context';
import {
  Code2,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  GraduationCap,
  BookOpen,
  Filter,
  Check,
  Zap,
  Terminal,
  ArrowLeft
} from 'lucide-react';

export default function ExperimentsListingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'C Fundamentals & Memory', label: 'Fundamentals & Memory' },
    { id: 'Linear Data Structures', label: 'Linear Structures' },
    { id: 'Applications of Stack', label: 'Stack Applications' },
    { id: 'Hierarchical Data Structures', label: 'Trees & BST' },
    { id: 'Graph Algorithms', label: 'Graph Algorithms' },
    { id: 'Sorting & Searching Algorithms', label: 'Sorting & Searching' },
    { id: 'Applied Projects & Capstone', label: 'Mini-Project / Capstone' }
  ];

  const filteredExperiments = useMemo(() => {
    return SYLLABUS_EXPERIMENTS.filter((exp) => {
      const matchesSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.aim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.dataStructure && exp.dataStructure.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exp.subExperiments && exp.subExperiments.some(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'all' || exp.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === 'all' || exp.difficulty === selectedDifficulty;

      const isCompleted = user.completedExperiments?.includes(exp.id);
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' && isCompleted) ||
        (selectedStatus === 'not_started' && !isCompleted);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus, user]);

  const completedCount = useMemo(() => {
    return SYLLABUS_EXPERIMENTS.filter(e => user.completedExperiments?.includes(e.id)).length;
  }, [user]);

  const displayCompleted = mounted ? completedCount : 0;
  const progressPercent = Math.round((displayCompleted / SYLLABUS_EXPERIMENTS.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-surface-subtle select-none">
      {/* Header Banner */}
      <section className="border-b border-border bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200 bg-red-50 text-xs font-medium text-red-700 mb-3 shadow-subtle">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Course N21UIT307 • Department of AI&DS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-black">
              Data Structures Laboratory Experiments
            </h1>

            <p className="text-sm sm:text-base text-secondary max-w-2xl font-normal mt-2 leading-relaxed">
              Complete the authoritative 10 experiments from the Anna University curriculum with line-by-line AI teaching, real-time memory visualization, typing viva, and assessments.
            </p>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-surface p-4 rounded-xl border border-border flex items-center gap-4 min-w-[240px] shadow-subtle shrink-0">
            <div
              suppressHydrationWarning
              className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center font-mono font-bold text-base shadow-subtle"
            >
              {displayCompleted}/{SYLLABUS_EXPERIMENTS.length}
            </div>
            <div>
              <span className="text-xs font-bold text-black block">
                Laboratory Progress
              </span>
              <span suppressHydrationWarning className="text-[11px] text-red-600 font-mono font-bold">
                {progressPercent}% Completed ({mounted ? user.xp : 0} XP)
              </span>
              <div className="w-28 h-1.5 bg-border rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="border-b border-border bg-white px-4 sm:px-6 py-4 sticky top-14 z-20 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search experiments by name, data structure, algorithm..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-border rounded-lg text-black placeholder:text-muted focus:outline-hidden focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-surface border border-border rounded-lg px-2.5 py-2 text-secondary font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs bg-surface border border-border rounded-lg px-2.5 py-2 text-secondary font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-surface border border-border rounded-lg px-2.5 py-2 text-secondary font-medium focus:ring-1 focus:ring-red-500 focus:outline-hidden"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="not_started">Not Started</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experiments Grid */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {filteredExperiments.length === 0 ? (
          <div className="academic-card p-12 text-center my-8 bg-white border border-border rounded-xl">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-bold text-black">No matching experiments found</h3>
            <p className="text-xs text-secondary mt-1 max-w-md mx-auto">
              Try adjusting your search keywords or resetting category filters to view all 10 laboratory experiments.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedStatus('all');
              }}
              className="mt-4 px-4 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-xs font-semibold text-black transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredExperiments.map((exp) => {
              const isCompleted = mounted && user.completedExperiments?.includes(exp.id);

              return (
                <div
                  key={exp.id}
                  className="academic-card p-5 sm:p-6 flex flex-col justify-between hover:shadow-floating hover:border-red-300 transition-all duration-200 group bg-white border border-border rounded-xl"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-black text-white text-xs font-mono font-bold shadow-subtle group-hover:bg-red-600 transition-colors">
                          EXP {exp.expNumber < 10 ? `0${exp.expNumber}` : exp.expNumber}
                        </span>

                        <span className="text-[11px] font-medium text-secondary px-2 py-0.5 rounded bg-surface border border-border">
                          {exp.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {exp.difficulty && (
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              exp.difficulty === 'Beginner'
                                ? 'bg-blue-50 text-accent-blue border-blue-200'
                                : exp.difficulty === 'Intermediate'
                                ? 'bg-amber-50 text-accent-amber border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            {exp.difficulty}
                          </span>
                        )}

                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Check className="w-3 h-3" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted font-medium px-2 py-0.5 rounded bg-surface border border-border">
                            Not Started
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title & Aim */}
                    <h2 className="text-base sm:text-lg font-bold text-black group-hover:text-red-600 transition-colors">
                      {exp.title}
                    </h2>

                    <p className="text-xs text-secondary mt-2 line-clamp-2 leading-relaxed">
                      {exp.aim}
                    </p>

                    {/* Sub-experiments badges if present */}
                    {exp.subExperiments && exp.subExperiments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1.5">
                          Sub-Modules & Variations:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.subExperiments.map((sub) => (
                            <span
                              key={sub.id}
                              className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border text-secondary"
                            >
                              <strong className="text-black">{sub.subCode}</strong>: {sub.title.replace(/Programs Using |Implementation of /i, '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course Outcomes */}
                    <div className="mt-3 flex items-center gap-1.5">
                      {exp.coMapping.map((co, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border"
                          title={co}
                        >
                          {co.split(' - ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <div className="text-[11px] text-muted font-mono">
                      ⏱ {exp.timeComplexity.average} &bull; 💾 {exp.spaceComplexity.value}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/experiments/${exp.id}`}
                        className="px-4 py-2 rounded-lg border border-black bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-subtle"
                      >
                        <span>Open Experiment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
