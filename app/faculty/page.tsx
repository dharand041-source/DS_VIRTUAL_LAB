'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getStoredSubmissions, saveSubmission } from '@/lib/storage';
import { DEFAULT_EVALUATION_SCHEME, SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { Submission, EvaluationScheme } from '@/lib/types';
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
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FacultyDashboardPage() {
  const { user, isFaculty, switchUserRole } = useAuth();
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
    const updatedList = submissions.map(s => s.id === updatedSub.id ? updatedSub : s);
    setSubmissions(updatedList);
    setSelectedSub(updatedSub);
    setSaveSuccess(true);
    confetti({ particleCount: 30, spread: 45 });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="flex-1 bg-surface py-8 px-4 sm:px-6">
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
              Laboratory Submissions & Assessment
            </h1>
            <p className="text-xs text-secondary mt-1">
              Department of Computer Science & Engineering • Dr. K. Rajasekaran (Faculty Authority)
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

        {/* Quick Analytics Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="academic-card p-4 bg-white">
            <span className="text-[10px] font-mono text-muted uppercase block">Enrolled Students</span>
            <span className="text-xl font-bold font-mono text-primary mt-1 block">64</span>
            <span className="text-[10px] text-muted">CSE Section A & B</span>
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
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-primary bg-zinc-50 font-medium shadow-subtle'
                        : 'border-border bg-white hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-primary mb-1">
                      <span>{sub.userName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface border border-border">
                        {sub.marks.total}/75
                      </span>
                    </div>
                    <p className="text-muted text-[11px] truncate mb-1">{sub.experimentTitle}</p>
                    <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                      <span>{sub.passedCount}/{sub.totalCount} Tests Passed</span>
                      <span>{sub.status.toUpperCase()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Review & Evaluation Workspace (8 cols) */}
          <div className="lg:col-span-8 academic-card bg-white p-6 space-y-5">
            {selectedSub ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                  <div>
                    <span className="text-xs font-mono text-muted uppercase">Evaluating Student Submission</span>
                    <h3 className="text-base font-bold text-primary">{selectedSub.userName}</h3>
                    <p className="text-xs text-muted">{selectedSub.experimentTitle} • {selectedSub.submittedAt}</p>
                  </div>

                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-accent-emerald border border-emerald-200">
                    {selectedSub.status.toUpperCase()}
                  </span>
                </div>

                {/* Submitted Code Preview */}
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-1">
                    Submitted C Source Code
                  </span>
                  <pre className="p-3 bg-surface font-mono text-xs text-primary border border-border rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedSub.code}
                  </pre>
                </div>

                {/* Viva Answers Review with AI Suggestion */}
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                    10-Second Typing Viva Responses
                  </span>

                  <div className="space-y-2">
                    {selectedSub.vivaAttempts.map((viva, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-surface border border-border text-xs">
                        <div className="flex items-center justify-between font-bold text-primary mb-1">
                          <span>Q{idx + 1}: {viva.question}</span>
                          <span className="text-accent-blue font-mono">
                            AI Suggested: {viva.aiSuggestedScore}/5
                          </span>
                        </div>
                        <p className="text-secondary mb-1">
                          <strong className="text-muted">Student Answer:</strong> {viva.studentAnswer}
                        </p>
                        <p className="text-[11px] text-muted font-mono">{viva.aiFeedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anna University Marks Distribution Form */}
                <div className="p-4 rounded-lg bg-surface border border-border space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Continuous Assessment Mark Allocation (Max: {evalScheme.maxMarks})
                    </span>
                    <span className="text-base font-bold font-mono text-primary">
                      Total: {codingMark + assessmentMark + vivaMark + observationMark} / {evalScheme.maxMarks}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] text-muted block mb-1">Coding (Max {evalScheme.codingWeight}):</label>
                      <input
                        type="number"
                        max={evalScheme.codingWeight}
                        value={codingMark}
                        onChange={(e) => setCodingMark(Number(e.target.value))}
                        className="w-full p-2 rounded border border-border font-mono font-bold text-primary bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted block mb-1">Assessment (Max {evalScheme.assessmentWeight}):</label>
                      <input
                        type="number"
                        max={evalScheme.assessmentWeight}
                        value={assessmentMark}
                        onChange={(e) => setAssessmentMark(Number(e.target.value))}
                        className="w-full p-2 rounded border border-border font-mono font-bold text-primary bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted block mb-1">Viva (Max {evalScheme.vivaWeight}):</label>
                      <input
                        type="number"
                        max={evalScheme.vivaWeight}
                        value={vivaMark}
                        onChange={(e) => setVivaMark(Number(e.target.value))}
                        className="w-full p-2 rounded border border-border font-mono font-bold text-primary bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted block mb-1">Observation (Max {evalScheme.facultyObservationWeight}):</label>
                      <input
                        type="number"
                        max={evalScheme.facultyObservationWeight}
                        value={observationMark}
                        onChange={(e) => setObservationMark(Number(e.target.value))}
                        className="w-full p-2 rounded border border-border font-mono font-bold text-primary bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Feedback Box */}
                  <div>
                    <label className="text-[11px] text-muted block mb-1">Faculty Feedback & Recommendations:</label>
                    <textarea
                      value={facultyFeedback}
                      onChange={(e) => setFacultyFeedback(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 text-xs rounded border border-border font-sans bg-white focus:outline-none resize-none"
                      placeholder="Enter feedback for student..."
                    />
                  </div>
                </div>

                {/* Save Evaluation Button */}
                <div className="flex items-center justify-between">
                  {saveSuccess ? (
                    <span className="text-xs font-bold text-accent-emerald flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Marks & Feedback Saved!
                    </span>
                  ) : (
                    <span></span>
                  )}

                  <button
                    onClick={handleSaveEvaluation}
                    className="px-5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition shadow-subtle flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Publish Official Marks</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-muted text-xs">
                Select a submission from the queue to begin evaluation.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evaluation Scheme Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-border shadow-floating max-w-md w-full p-6 animate-fade-in">
            <h3 className="text-base font-bold text-primary mb-1">Configure Evaluation Scheme</h3>
            <p className="text-xs text-muted mb-4">
              Set component weightages according to Anna University regulation.
            </p>

            <div className="space-y-3 text-xs mb-6">
              <div>
                <label className="text-muted block mb-1">Max Total Marks:</label>
                <input
                  type="number"
                  value={evalScheme.maxMarks}
                  onChange={(e) => setEvalScheme({ ...evalScheme, maxMarks: Number(e.target.value) })}
                  className="w-full p-2 rounded border border-border font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-muted block mb-1">Coding (Marks):</label>
                  <input
                    type="number"
                    value={evalScheme.codingWeight}
                    onChange={(e) => setEvalScheme({ ...evalScheme, codingWeight: Number(e.target.value) })}
                    className="w-full p-2 rounded border border-border font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1">Assessment (Marks):</label>
                  <input
                    type="number"
                    value={evalScheme.assessmentWeight}
                    onChange={(e) => setEvalScheme({ ...evalScheme, assessmentWeight: Number(e.target.value) })}
                    className="w-full p-2 rounded border border-border font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1">Viva (Marks):</label>
                  <input
                    type="number"
                    value={evalScheme.vivaWeight}
                    onChange={(e) => setEvalScheme({ ...evalScheme, vivaWeight: Number(e.target.value) })}
                    className="w-full p-2 rounded border border-border font-mono"
                  />
                </div>

                <div>
                  <label className="text-muted block mb-1">Observation (Marks):</label>
                  <input
                    type="number"
                    value={evalScheme.facultyObservationWeight}
                    onChange={(e) => setEvalScheme({ ...evalScheme, facultyObservationWeight: Number(e.target.value) })}
                    className="w-full p-2 rounded border border-border font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-primary hover:bg-surface transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
