'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getStoredSubmissions, saveSubmission, getStoredFeedbacks, getEnrolledStudentsProgress, getStoredCompletionRules, saveCompletionRules } from '@/lib/storage';
import { DEFAULT_EVALUATION_SCHEME, SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { Submission, EvaluationScheme, StudentFeedback, CompletionRule } from '@/lib/types';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Sliders,
  Sparkles,
  Search,
  CheckCircle,
  Save,
  Info,
  MessageSquare,
  Star,
  Filter,
  Check,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerTopLoadingBar } from '@/components/ui/top-progress-bar';

export default function FacultyDashboardPage() {
  const { user, isFaculty, switchUserRole } = useAuth();
  const [activeFacultyTab, setActiveFacultyTab] = useState<'monitoring' | 'submissions' | 'feedback'>('monitoring');
  const [pendingFacultyTab, setPendingFacultyTab] = useState<'monitoring' | 'submissions' | 'feedback' | null>(null);

  const switchFacultyTab = (tab: 'monitoring' | 'submissions' | 'feedback') => {
    if (tab === activeFacultyTab || pendingFacultyTab) return;
    setPendingFacultyTab(tab);
    triggerTopLoadingBar(() => {
      setActiveFacultyTab(tab);
      setPendingFacultyTab(null);
    }, 1800);
  };

  // Enrolled students progress state
  const [students, setStudents] = useState(getEnrolledStudentsProgress());
  const [searchStudentQuery, setSearchStudentQuery] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>(getStoredSubmissions());
  const [selectedSub, setSelectedSub] = useState<Submission | null>(submissions[0] || null);
  const [evalScheme, setEvalScheme] = useState<EvaluationScheme>(DEFAULT_EVALUATION_SCHEME);
  const [completionRules, setCompletionRules] = useState<CompletionRule>(getStoredCompletionRules());
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  // Editable marks state for active submission
  const [codingMark, setCodingMark] = useState<number>(selectedSub?.marks.coding || 28);
  const [assessmentMark, setAssessmentMark] = useState<number>(selectedSub?.marks.assessment || 18);
  const [vivaMark, setVivaMark] = useState<number>(selectedSub?.marks.viva || 14);
  const [observationMark, setObservationMark] = useState<number>(selectedSub?.marks.facultyObservation || 9);
  const [facultyFeedback, setFacultyFeedback] = useState<string>(selectedSub?.facultyFeedback || '');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Feedback state & filters
  const [feedbacks, setFeedbacks] = useState<StudentFeedback[]>(getStoredFeedbacks());
  const [feedbackExpFilter, setFeedbackExpFilter] = useState<string>('all');
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<string>('all');
  const [showAISummary, setShowAISummary] = useState<boolean>(false);

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.userName.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudentQuery.toLowerCase()) ||
      (s.section && s.section.toLowerCase().includes(searchStudentQuery.toLowerCase()))
    );
  }, [students, searchStudentQuery]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchExp = feedbackExpFilter === 'all' || fb.experimentId === feedbackExpFilter;
      const matchCat = feedbackCategoryFilter === 'all' || fb.category === feedbackCategoryFilter;
      return matchExp && matchCat;
    });
  }, [feedbacks, feedbackExpFilter, feedbackCategoryFilter]);

  // Compute average ratings
  const averageRatings = useMemo(() => {
    if (feedbacks.length === 0) {
      return { aiTeaching: 5, visualization: 5, codeEditor: 5, assessment: 5, viva: 5, overall: 5 };
    }
    const sum = feedbacks.reduce(
      (acc, curr) => {
        acc.aiTeaching += curr.ratings.aiTeaching;
        acc.visualization += curr.ratings.visualization;
        acc.codeEditor += curr.ratings.codeEditor;
        acc.assessment += curr.ratings.assessment;
        acc.viva += curr.ratings.viva;
        acc.overall += curr.ratings.overall;
        return acc;
      },
      { aiTeaching: 0, visualization: 0, codeEditor: 0, assessment: 0, viva: 0, overall: 0 }
    );
    const n = feedbacks.length;
    return {
      aiTeaching: Number((sum.aiTeaching / n).toFixed(1)),
      visualization: Number((sum.visualization / n).toFixed(1)),
      codeEditor: Number((sum.codeEditor / n).toFixed(1)),
      assessment: Number((sum.assessment / n).toFixed(1)),
      viva: Number((sum.viva / n).toFixed(1)),
      overall: Number((sum.overall / n).toFixed(1))
    };
  }, [feedbacks]);

  const handleSaveEvaluation = () => {
    if (!selectedSub) return;
    const total = codingMark + assessmentMark + vivaMark + observationMark;
    const updatedSub: Submission = {
      ...selectedSub,
      status: 'evaluated',
      marks: {
        coding: codingMark,
        assessment: assessmentMark,
        viva: vivaMark,
        facultyObservation: observationMark,
        total
      },
      facultyFeedback,
      evaluatedAt: new Date().toLocaleString()
    };

    saveSubmission(updatedSub);
    const updatedList = submissions.map(s => (s.id === updatedSub.id ? updatedSub : s));
    setSubmissions(updatedList);
    setSelectedSub(updatedSub);
    setSaveSuccess(true);
    confetti({ particleCount: 30, spread: 45 });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveCompletionRules = (e: React.FormEvent) => {
    e.preventDefault();
    saveCompletionRules(completionRules);
    setShowConfigModal(false);
    confetti({ particleCount: 30, spread: 40 });
  };

  return (
    <div className="flex-1 bg-surface-subtle py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-red-600" />
              <span className="text-xs font-mono font-bold text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200">
                FACULTY & INSTRUCTOR PORTAL • N21UIT307
              </span>
            </div>
            <h1 className="text-2xl font-black text-black tracking-tight">
              Data Structures Laboratory Management System
            </h1>
            <p className="text-xs text-secondary mt-1">
              Department of Artificial Intelligence & Data Science (AI&DS) • Dr. K. Rajasekaran (Faculty HOD)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isFaculty && (
              <button
                onClick={() => switchUserRole('faculty')}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-black hover:bg-surface-subtle transition"
              >
                Switch to Faculty Role
              </button>
            )}

            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-black hover:bg-surface transition shadow-subtle"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure LMS Rules ({evalScheme.maxMarks}M)</span>
            </button>
          </div>
        </div>

        {/* Portal Tabs Switcher */}
        <div className="bg-white p-1.5 rounded-xl border border-border shadow-subtle flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => switchFacultyTab('monitoring')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap ${
              activeFacultyTab === 'monitoring'
                ? 'bg-black text-white shadow-subtle'
                : pendingFacultyTab === 'monitoring'
                ? 'bg-red-50 text-red-600 font-bold animate-pulse'
                : 'text-secondary hover:text-black hover:bg-surface'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{pendingFacultyTab === 'monitoring' ? 'Loading Progression Matrix...' : 'Student Learning Progress & Monitoring'}</span>
          </button>

          <button
            onClick={() => switchFacultyTab('submissions')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap ${
              activeFacultyTab === 'submissions'
                ? 'bg-black text-white shadow-subtle'
                : pendingFacultyTab === 'submissions'
                ? 'bg-red-50 text-red-600 font-bold animate-pulse'
                : 'text-secondary hover:text-black hover:bg-surface'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{pendingFacultyTab === 'submissions' ? 'Loading Submissions...' : 'Submissions & 75M Lab Evaluation'}</span>
          </button>

          <button
            onClick={() => switchFacultyTab('feedback')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap ${
              activeFacultyTab === 'feedback'
                ? 'bg-black text-white shadow-subtle'
                : pendingFacultyTab === 'feedback'
                ? 'bg-red-50 text-red-600 font-bold animate-pulse'
                : 'text-secondary hover:text-black hover:bg-surface'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{pendingFacultyTab === 'feedback' ? 'Loading Feedback Analytics...' : `Student Feedback Analytics (${feedbacks.length})`}</span>
          </button>
        </div>

        {/* TAB 1: STUDENT LEARNING PROGRESS & MONITORING */}
        {activeFacultyTab === 'monitoring' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Monitoring Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Enrolled Students</span>
                <span className="text-2xl font-black font-mono text-black mt-1 block">64</span>
                <span className="text-[10px] text-muted">AI&DS Section A & B</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Class Average Progress</span>
                <span className="text-2xl font-black font-mono text-black mt-1 block">52.4%</span>
                <span className="text-[10px] text-accent-emerald font-bold">↑ +8.2% this week</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Submissions Pending</span>
                <span className="text-2xl font-black font-mono text-amber-600 mt-1 block">1</span>
                <span className="text-[10px] text-muted">Awaiting evaluation</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Intervention Alerts</span>
                <span className="text-2xl font-black font-mono text-red-600 mt-1 block">1</span>
                <span className="text-[10px] text-red-700 font-bold">Needs pointer support</span>
              </div>
            </div>

            {/* At-Risk Intervention Alert Card */}
            <div className="academic-card p-4 bg-red-50/50 border border-red-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider font-mono">
                  LMS Academic Early-Intervention Alert
                </h4>
              </div>
              <p className="text-xs text-red-900 leading-relaxed">
                Student <strong className="text-red-950">Ananya Iyer (AI&DS-B)</strong> has attempted the 10s Viva on <em>Binary Search Trees</em> multiple times below the 60% threshold. Recommended action: Assign targeted pointer traversal practice in Experiment 02.
              </p>
            </div>

            {/* Student Progress Monitoring Table */}
            <div className="academic-card bg-white border border-border rounded-xl shadow-subtle overflow-hidden space-y-4 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div>
                  <h3 className="text-sm font-bold text-black">
                    Enrolled Student Learning Progression Matrix
                  </h3>
                  <p className="text-xs text-secondary">
                    Course N21UIT307 • Real-time completion percentages and evaluation readiness
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    value={searchStudentQuery}
                    onChange={(e) => setSearchStudentQuery(e.target.value)}
                    placeholder="Search by student name, section..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-lg text-black focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-surface border-b border-border text-muted font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Section / Class</th>
                      <th className="py-2.5 px-3">Experiments Done</th>
                      <th className="py-2.5 px-3">Course Completion</th>
                      <th className="py-2.5 px-3">Avg Scores</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredStudents.map((s) => (
                      <tr key={s.userId} className="hover:bg-surface-subtle transition">
                        <td className="py-3 px-3">
                          <span className="font-bold text-black block">{s.userName}</span>
                          <span className="text-[10px] text-muted font-mono">{s.email}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-secondary">
                          {s.section || 'General'}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-black">
                          {s.completedExperimentsCount} / 10 Units
                        </td>
                        <td className="py-3 px-3 min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface h-2 rounded-full overflow-hidden border border-border">
                              <div
                                className="bg-red-600 h-full rounded-full"
                                style={{ width: `${s.courseCompletionPercentage}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-black">
                              {s.courseCompletionPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <span className="text-secondary">Viva: {s.averageVivaScore}/15 | Assmt: {s.averageAssessmentScore}/20</span>
                        </td>
                        <td className="py-3 px-3">
                          {s.needsIntervention ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 inline-flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Needs Help
                            </span>
                          ) : s.courseCompletionPercentage >= 60 ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-accent-emerald border border-emerald-200 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> On Track
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface text-secondary border border-border">
                              In Progress
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS & EVALUATION */}
        {activeFacultyTab === 'submissions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Analytics Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Enrolled Students</span>
                <span className="text-xl font-bold font-mono text-black mt-1 block">64</span>
                <span className="text-[10px] text-muted">AI&DS Section A & B</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Submissions Pending</span>
                <span className="text-xl font-bold font-mono text-amber-600 mt-1 block">1</span>
                <span className="text-[10px] text-muted">Awaiting evaluation</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Average Lab Score</span>
                <span className="text-xl font-bold font-mono text-black mt-1 block">68.4 / 75</span>
                <span className="text-[10px] text-accent-emerald font-bold">91.2% pass rate</span>
              </div>

              <div className="academic-card p-4 bg-white border border-border rounded-xl shadow-subtle">
                <span className="text-[10px] font-mono text-muted uppercase block">Common Weak Area</span>
                <span className="text-base font-bold text-red-600 mt-1 block truncate">Pointers & Malloc</span>
                <span className="text-[10px] text-muted">Identified in Viva</span>
              </div>
            </div>

            {/* Submissions Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Submissions Queue List (4 cols) */}
              <div className="lg:col-span-4 academic-card bg-white p-4 space-y-3 border border-border rounded-xl shadow-subtle">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">Submissions Queue</h3>
                  <span className="text-xs font-mono text-muted">{submissions.length} Total</span>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {submissions.map((sub) => {
                    const isSelected = selectedSub?.id === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => {
                          setSelectedSub(sub);
                          setCodingMark(sub.marks.coding);
                          setAssessmentMark(sub.marks.assessment);
                          setVivaMark(sub.marks.viva);
                          setObservationMark(sub.marks.facultyObservation);
                          setFacultyFeedback(sub.facultyFeedback || '');
                        }}
                        className={`p-3 rounded-lg border transition cursor-pointer select-none ${
                          isSelected
                            ? 'bg-red-50 border-red-300 shadow-subtle'
                            : 'bg-white border-border hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-black">{sub.userName}</span>
                          <span className="text-[10px] font-mono text-muted">{sub.submittedAt.split(' ')[0]}</span>
                        </div>
                        <p className="text-xs text-secondary mt-1 truncate">{sub.experimentTitle}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px] font-mono">
                          <span className="text-muted">Tests: {sub.passedCount}/{sub.totalCount}</span>
                          <span className="font-bold text-black">{sub.marks.total} / {evalScheme.maxMarks}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evaluation Workstation (8 cols) */}
              {selectedSub ? (
                <div className="lg:col-span-8 academic-card bg-white p-5 space-y-5 border border-border rounded-xl shadow-subtle">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                    <div>
                      <h2 className="text-base font-bold text-black">{selectedSub.userName}</h2>
                      <span className="text-xs text-secondary">{selectedSub.experimentTitle}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-accent-emerald border border-emerald-200 text-xs font-mono font-bold">
                      Current Score: {codingMark + assessmentMark + vivaMark + observationMark} / {evalScheme.maxMarks}
                    </span>
                  </div>

                  {/* Marks Entry Sliders/Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                        Coding ({evalScheme.codingWeight}M)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={evalScheme.codingWeight}
                        value={codingMark}
                        onChange={(e) => setCodingMark(Number(e.target.value))}
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-black"
                      />
                    </div>

                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                        Assessment ({evalScheme.assessmentWeight}M)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={evalScheme.assessmentWeight}
                        value={assessmentMark}
                        onChange={(e) => setAssessmentMark(Number(e.target.value))}
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-black"
                      />
                    </div>

                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                        Viva Voice ({evalScheme.vivaWeight}M)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={evalScheme.vivaWeight}
                        value={vivaMark}
                        onChange={(e) => setVivaMark(Number(e.target.value))}
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-black"
                      />
                    </div>

                    <div className="p-3 bg-surface rounded-xl border border-border">
                      <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                        Observation ({evalScheme.facultyObservationWeight}M)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={evalScheme.facultyObservationWeight}
                        value={observationMark}
                        onChange={(e) => setObservationMark(Number(e.target.value))}
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-black"
                      />
                    </div>
                  </div>

                  {/* Faculty Qualitative Feedback */}
                  <div>
                    <label className="text-xs font-bold text-black block mb-1.5">
                      Faculty Academic Feedback & Observation Remarks:
                    </label>
                    <textarea
                      rows={3}
                      value={facultyFeedback}
                      onChange={(e) => setFacultyFeedback(e.target.value)}
                      placeholder="Enter specific recommendations for lab record submission..."
                      className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-black focus:ring-1 focus:ring-red-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {saveSuccess ? (
                      <span className="text-xs text-accent-emerald font-bold flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Marks & Feedback Saved to Academic Record!
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted font-mono">
                        Evaluated by Dr. K. Rajasekaran (Faculty HOD)
                      </span>
                    )}

                    <button
                      onClick={handleSaveEvaluation}
                      className="px-5 py-2 rounded-lg border border-black bg-white hover:bg-red-600 hover:text-white hover:border-red-600 text-black text-xs font-bold flex items-center gap-1.5 shadow-subtle transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Finalize Evaluation</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-8 academic-card bg-white p-12 text-center text-xs text-muted border border-border rounded-xl">
                  Select a student submission to evaluate.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENT FEEDBACK & ANALYTICS */}
        {activeFacultyTab === 'feedback' && (
          <div className="space-y-6 animate-fade-in">
            {/* Feedback Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'AI Teaching', val: averageRatings.aiTeaching },
                { label: 'Visualization', val: averageRatings.visualization },
                { label: 'Code Lab', val: averageRatings.codeEditor },
                { label: 'Assessment', val: averageRatings.assessment },
                { label: '10s Viva', val: averageRatings.viva },
                { label: 'Overall Rating', val: averageRatings.overall }
              ].map((item, i) => (
                <div key={i} className="academic-card p-3 bg-white text-center border border-border rounded-xl">
                  <span className="text-[10px] text-muted font-bold uppercase block">{item.label}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-base font-bold font-mono text-black">{item.val}</span>
                    <span className="text-[10px] text-muted">/ 5</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary Section */}
            <div className="academic-card p-5 bg-white border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                    AI Pedagogical Feedback Synthesis
                  </h3>
                </div>
                <button
                  onClick={() => setShowAISummary(!showAISummary)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-black text-xs font-semibold shadow-subtle transition"
                >
                  {showAISummary ? 'Hide AI Summary' : 'Generate AI Summary'}
                </button>
              </div>

              {showAISummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border animate-fade-in">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-xs font-bold text-accent-emerald mb-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Most Common Positive Points
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      Students consistently highlight the real-time pointer arrows and 10-second typing viva as the most effective tools for understanding memory allocation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                    <span className="text-xs font-bold text-accent-amber mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Student Confusion Areas
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      Initial confusion centered on pointer dereferencing syntax (*ptr vs &var) and Dijkstra negative-weight limitations before using the step tracer.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                    <span className="text-xs font-bold text-accent-blue mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Recommended Improvements
                    </span>
                    <p className="text-xs text-blue-950 leading-relaxed">
                      Add custom capacity bounds in stack visualizer and include polynomial multiplication examples in Experiment 02.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Listing with Filters */}
            <div className="academic-card p-5 bg-white border border-border rounded-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                  Student Feedback Logs ({filteredFeedbacks.length})
                </h3>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={feedbackExpFilter}
                    onChange={(e) => setFeedbackExpFilter(e.target.value)}
                    className="text-xs bg-surface border border-border rounded-lg px-2.5 py-1.5 text-secondary font-medium"
                  >
                    <option value="all">All Experiments</option>
                    {SYLLABUS_EXPERIMENTS.map((e) => (
                      <option key={e.id} value={e.id}>
                        EXP {e.expNumber}: {e.shortTitle}
                      </option>
                    ))}
                  </select>

                  <select
                    value={feedbackCategoryFilter}
                    onChange={(e) => setFeedbackCategoryFilter(e.target.value)}
                    className="text-xs bg-surface border border-border rounded-lg px-2.5 py-1.5 text-secondary font-medium"
                  >
                    <option value="all">All Categories</option>
                    <option value="AI_TEACHING">AI Teaching</option>
                    <option value="VISUALIZATION">Visualization</option>
                    <option value="EXPERIMENT_CONTENT">Content</option>
                    <option value="OVERALL">Overall</option>
                  </select>
                </div>
              </div>

              {/* Feedbacks Grid */}
              <div className="space-y-3">
                {filteredFeedbacks.map((fb) => (
                  <div key={fb.id} className="p-4 rounded-xl bg-surface/50 border border-border space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black">
                          {fb.isAnonymous ? 'Anonymous Student' : fb.userName}
                        </span>
                        <span className="text-[10px] font-mono text-muted">
                          &bull; {fb.collegeName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1">{fb.ratings.overall} / 5</span>
                        </div>
                        <span className="text-[10px] font-mono text-muted">{fb.createdAt}</span>
                      </div>
                    </div>

                    <div className="text-xs text-black font-medium">
                      Experiment: <span className="font-bold">{fb.experimentTitle}</span>
                    </div>

                    {fb.helpedMost && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-black">Helped Most:</strong> {fb.helpedMost}
                      </p>
                    )}

                    {fb.difficultPart && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-black">Difficult Area:</strong> {fb.difficultPart}
                      </p>
                    )}

                    {fb.improvementSuggestion && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-black">Suggestion:</strong> {fb.improvementSuggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LMS Evaluation Scheme & Completion Rules Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-border rounded-2xl shadow-floating overflow-hidden relative animate-scale-in">
            <div className="p-6 border-b border-border bg-surface flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-black">
                  Configure LMS Rules & Evaluation Scheme
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Course N21UIT307 • Anna University Regulation 2021
                </p>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1.5 rounded-lg border border-border bg-white text-muted hover:text-black transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompletionRules} className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono mb-2">
                  1. Anna University Marks Distribution (75 Marks)
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-secondary block mb-1">Coding Weight (M):</label>
                    <input
                      type="number"
                      value={evalScheme.codingWeight}
                      onChange={(e) => setEvalScheme({ ...evalScheme, codingWeight: Number(e.target.value) })}
                      className="w-full font-mono font-bold p-2 bg-surface border border-border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="text-secondary block mb-1">Assessment Weight (M):</label>
                    <input
                      type="number"
                      value={evalScheme.assessmentWeight}
                      onChange={(e) => setEvalScheme({ ...evalScheme, assessmentWeight: Number(e.target.value) })}
                      className="w-full font-mono font-bold p-2 bg-surface border border-border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="text-secondary block mb-1">Viva Voice Weight (M):</label>
                    <input
                      type="number"
                      value={evalScheme.vivaWeight}
                      onChange={(e) => setEvalScheme({ ...evalScheme, vivaWeight: Number(e.target.value) })}
                      className="w-full font-mono font-bold p-2 bg-surface border border-border rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="text-secondary block mb-1">Observation Weight (M):</label>
                    <input
                      type="number"
                      value={evalScheme.facultyObservationWeight}
                      onChange={(e) => setEvalScheme({ ...evalScheme, facultyObservationWeight: Number(e.target.value) })}
                      className="w-full font-mono font-bold p-2 bg-surface border border-border rounded-lg text-black"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted font-mono mb-2">
                  2. Experiment Unit Completion Criteria
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completionRules.requireTheory}
                      onChange={(e) => setCompletionRules({ ...completionRules, requireTheory: e.target.checked })}
                      className="rounded border-border text-red-600"
                    />
                    <span className="text-black">Require Theory & Algorithm review</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completionRules.requireCodingTestCases}
                      onChange={(e) => setCompletionRules({ ...completionRules, requireCodingTestCases: e.target.checked })}
                      className="rounded border-border text-red-600"
                    />
                    <span className="text-black">Require passing all Sandbox Test Cases</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completionRules.requireAssessment}
                      onChange={(e) => setCompletionRules({ ...completionRules, requireAssessment: e.target.checked })}
                      className="rounded border-border text-red-600"
                    />
                    <span className="text-black">Require Concept Assessment Quiz (Min {completionRules.minAssessmentScorePercent}%)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completionRules.requireViva}
                      onChange={(e) => setCompletionRules({ ...completionRules, requireViva: e.target.checked })}
                      className="rounded border-border text-red-600"
                    />
                    <span className="text-black">Require 10-Second Typing Viva Voce</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={completionRules.requireSubmission}
                      onChange={(e) => setCompletionRules({ ...completionRules, requireSubmission: e.target.checked })}
                      className="rounded border-border text-red-600"
                    />
                    <span className="text-black">Require Laboratory Record Submission</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-secondary hover:text-black transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-red transition"
                >
                  Save LMS Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
