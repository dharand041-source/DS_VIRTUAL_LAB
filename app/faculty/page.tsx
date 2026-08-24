'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { getStoredSubmissions, saveSubmission, getStoredFeedbacks } from '@/lib/storage';
import { DEFAULT_EVALUATION_SCHEME, SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { Submission, EvaluationScheme, StudentFeedback } from '@/lib/types';
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
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FacultyDashboardPage() {
  const { user, isFaculty, switchUserRole } = useAuth();
  const [activeFacultyTab, setActiveFacultyTab] = useState<'submissions' | 'feedback'>('submissions');

  // Submissions state
  const [submissions, setSubmissions] = useState<Submission[]>(getStoredSubmissions());
  const [selectedSub, setSelectedSub] = useState<Submission | null>(submissions[0] || null);
  const [evalScheme, setEvalScheme] = useState<EvaluationScheme>(DEFAULT_EVALUATION_SCHEME);
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

  return (
    <div className="flex-1 bg-surface py-8 px-4 sm:px-6 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono font-bold text-muted uppercase">
                FACULTY PORTAL • ANNA UNIVERSITY EVALUATION SYSTEM
              </span>
            </div>
            <h1 className="text-2xl font-bold text-primary tracking-tight">
              Laboratory Submissions & Academic Feedback
            </h1>
            <p className="text-xs text-secondary mt-1">
              Department of Artificial Intelligence & Data Science (AI&DS) • Dr. K. Rajasekaran (Faculty Authority)
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isFaculty && (
              <button
                onClick={() => switchUserRole('faculty')}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-semibold text-primary hover:bg-surface-subtle transition"
              >
                Switch to Faculty Role
              </button>
            )}

            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-white text-xs font-semibold text-primary hover:bg-surface transition shadow-subtle"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Configure Scheme ({evalScheme.maxMarks} Marks)</span>
            </button>
          </div>
        </div>

        {/* Portal Tabs Switcher */}
        <div className="bg-white p-1.5 rounded-xl border border-border shadow-subtle flex items-center gap-1.5">
          <button
            onClick={() => setActiveFacultyTab('submissions')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition ${
              activeFacultyTab === 'submissions'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-secondary hover:text-primary hover:bg-surface'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Student Submissions & Evaluation</span>
          </button>

          <button
            onClick={() => setActiveFacultyTab('feedback')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition ${
              activeFacultyTab === 'feedback'
                ? 'bg-primary text-white shadow-subtle'
                : 'text-secondary hover:text-primary hover:bg-surface'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Educational Feedback Analytics ({feedbacks.length})</span>
          </button>
        </div>

        {/* TAB 1: SUBMISSIONS & EVALUATION */}
        {activeFacultyTab === 'submissions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Analytics Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="academic-card p-4 bg-white">
                <span className="text-[10px] font-mono text-muted uppercase block">Enrolled Students</span>
                <span className="text-xl font-bold font-mono text-primary mt-1 block">64</span>
                <span className="text-[10px] text-muted">AI&DS Section A & B</span>
              </div>

              <div className="academic-card p-4 bg-white">
                <span className="text-[10px] font-mono text-muted uppercase block">Submissions Pending</span>
                <span className="text-xl font-bold font-mono text-accent-amber mt-1 block">1</span>
                <span className="text-[10px] text-muted">Awaiting evaluation</span>
              </div>

              <div className="academic-card p-4 bg-white">
                <span className="text-[10px] font-mono text-muted uppercase block">Average Lab Score</span>
                <span className="text-xl font-bold font-mono text-primary mt-1 block">68.4 / 75</span>
                <span className="text-[10px] text-accent-emerald">91.2% pass rate</span>
              </div>

              <div className="academic-card p-4 bg-white">
                <span className="text-[10px] font-mono text-muted uppercase block">Common Weak Area</span>
                <span className="text-base font-bold text-accent-rose mt-1 block truncate">Pointers & Malloc</span>
                <span className="text-[10px] text-muted">Identified in Viva</span>
              </div>
            </div>

            {/* Submissions Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Submissions Queue List (4 cols) */}
              <div className="lg:col-span-4 academic-card bg-white p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Submissions Queue</h3>
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
                            ? 'bg-surface border-primary shadow-subtle'
                            : 'bg-white border-border hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">{sub.userName}</span>
                          <span className="text-[10px] font-mono text-muted">{sub.submittedAt.split(' ')[0]}</span>
                        </div>
                        <p className="text-xs text-secondary mt-1 truncate">{sub.experimentTitle}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px] font-mono">
                          <span className="text-muted">Tests: {sub.passedCount}/{sub.totalCount}</span>
                          <span className="font-bold text-primary">{sub.marks.total} / {evalScheme.maxMarks}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evaluation Workstation (8 cols) */}
              {selectedSub ? (
                <div className="lg:col-span-8 academic-card bg-white p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
                    <div>
                      <h2 className="text-base font-bold text-primary">{selectedSub.userName}</h2>
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
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-primary"
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
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-primary"
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
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-primary"
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
                        className="w-full font-mono text-sm font-bold p-1.5 bg-white border border-border rounded-lg text-primary"
                      />
                    </div>
                  </div>

                  {/* Faculty Qualitative Feedback */}
                  <div>
                    <label className="text-xs font-bold text-primary block mb-1.5">
                      Faculty Academic Feedback & Observation Remarks:
                    </label>
                    <textarea
                      rows={3}
                      value={facultyFeedback}
                      onChange={(e) => setFacultyFeedback(e.target.value)}
                      placeholder="Enter specific recommendations for lab record submission..."
                      className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
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
                      className="px-5 py-2 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center gap-1.5 shadow-subtle transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save & Finalize Evaluation</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-8 academic-card bg-white p-12 text-center text-xs text-muted">
                  Select a student submission to evaluate.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT FEEDBACK & ANALYTICS */}
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
                <div key={i} className="academic-card p-3 bg-white text-center">
                  <span className="text-[10px] text-muted font-bold uppercase block">{item.label}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-base font-bold font-mono text-primary">{item.val}</span>
                    <span className="text-[10px] text-muted">/ 5</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary Section */}
            <div className="academic-card p-5 bg-white border border-border rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-indigo" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                    AI Pedagogical Feedback Synthesis
                  </h3>
                </div>
                <button
                  onClick={() => setShowAISummary(!showAISummary)}
                  className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-semibold shadow-subtle transition"
                >
                  {showAISummary ? 'Hide AI Summary' : 'Generate AI Summary'}
                </button>
              </div>

              {showAISummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border animate-fade-in">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-xs font-bold text-accent-emerald block mb-1 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Most Common Positive Points
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      Students consistently highlight the real-time pointer arrows and 10-second typing viva as the most effective tools for understanding memory allocation.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
                    <span className="text-xs font-bold text-accent-amber block mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Student Confusion Areas
                    </span>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      Initial confusion centered on pointer dereferencing syntax (*ptr vs &var) and Dijkstra negative-weight limitations before using the step tracer.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                    <span className="text-xs font-bold text-accent-blue block mb-1 flex items-center gap-1.5">
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
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
                        <span className="text-xs font-bold text-primary">
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

                    <div className="text-xs text-primary font-medium">
                      Experiment: <span className="font-bold">{fb.experimentTitle}</span>
                    </div>

                    {fb.helpedMost && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-primary">Helped Most:</strong> {fb.helpedMost}
                      </p>
                    )}

                    {fb.difficultPart && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-primary">Difficult Area:</strong> {fb.difficultPart}
                      </p>
                    )}

                    {fb.improvementSuggestion && (
                      <p className="text-xs text-secondary leading-relaxed">
                        <strong className="text-primary">Suggestion:</strong> {fb.improvementSuggestion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
