'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { useAuth } from '@/lib/auth-context';
import { saveFeedback } from '@/lib/storage';
import { StudentFeedback, FeedbackCategory } from '@/lib/types';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Sparkles,
  Send,
  HelpCircle,
  Code2,
  Eye,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentFeedbackPage() {
  const { user, addXP } = useAuth();

  const [selectedExpId, setSelectedExpId] = useState<string>(SYLLABUS_EXPERIMENTS[0].id);
  const [category, setCategory] = useState<FeedbackCategory>('OVERALL');
  const [ratings, setRatings] = useState({
    aiTeaching: 5,
    visualization: 5,
    codeEditor: 5,
    assessment: 5,
    viva: 5,
    overall: 5
  });
  const [helpedMost, setHelpedMost] = useState('');
  const [difficultPart, setDifficultPart] = useState('');
  const [improvementSuggestion, setImprovementSuggestion] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<'yes' | 'maybe' | 'no'>('yes');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedExperiment = useMemo(() => {
    return SYLLABUS_EXPERIMENTS.find(e => e.id === selectedExpId) || SYLLABUS_EXPERIMENTS[0];
  }, [selectedExpId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fb: StudentFeedback = {
      id: `fb-${Date.now()}`,
      userId: isAnonymous ? 'anonymous' : user.id,
      userName: isAnonymous ? 'Anonymous Student' : user.name,
      userRole: user.role,
      collegeName: user.collegeName,
      isOurCollege: user.isOurCollege,
      experimentId: selectedExperiment.id,
      experimentTitle: selectedExperiment.title,
      ratings,
      helpedMost,
      difficultPart,
      improvementSuggestion,
      wouldRecommend,
      category,
      isAnonymous,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    saveFeedback(fb);
    addXP(10, 'Submitted Educational Feedback');
    setIsSubmitted(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="flex-1 flex flex-col bg-surface-subtle select-none">
      {/* Header Banner */}
      <section className="border-b border-border bg-white py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-xs font-medium text-secondary mb-3 shadow-subtle">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span>Educational Experience & Quality Feedback</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary">
            Student Feedback & Learning Reflection
          </h1>

          <p className="text-sm sm:text-base text-secondary max-w-2xl font-normal mt-2 leading-relaxed">
            Your feedback directly shapes how our AI Teaching Assistant, live memory animations, and laboratory viva challenges are designed.
          </p>
        </div>
      </section>

      {/* Main Feedback Card */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
        {isSubmitted ? (
          <div className="academic-card p-12 bg-white border border-border rounded-xl shadow-subtle text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-accent-emerald flex items-center justify-center mx-auto shadow-subtle">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-primary">
              Thank You For Your Constructive Feedback!
            </h2>

            <p className="text-xs text-secondary max-w-md mx-auto leading-relaxed">
              Your evaluation for <strong>{selectedExperiment.title}</strong> has been logged in the faculty analytics portal. <strong>+10 XP</strong> has been added to your profile.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setHelpedMost('');
                  setDifficultPart('');
                  setImprovementSuggestion('');
                }}
                className="px-4 py-2 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-semibold shadow-subtle transition"
              >
                Submit Feedback for Another Experiment
              </button>

              <Link
                href="/experiments"
                className="px-5 py-2 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold shadow-subtle transition flex items-center gap-1.5"
              >
                <span>Back to Experiments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="academic-card p-6 sm:p-8 bg-white border border-border rounded-xl shadow-subtle space-y-8 animate-fade-in">
            {/* Step 1: Select Experiment */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                1. Select Experiment to Review:
              </label>
              <select
                value={selectedExpId}
                onChange={(e) => setSelectedExpId(e.target.value)}
                className="w-full text-xs font-medium bg-surface border border-border rounded-lg p-3 text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
              >
                {SYLLABUS_EXPERIMENTS.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    EXP {exp.expNumber < 10 ? `0${exp.expNumber}` : exp.expNumber}: {exp.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Primary Focus Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-2">
                2. Primary Area of Feedback:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'AI_TEACHING', label: 'AI Teaching Assistant' },
                  { id: 'VISUALIZATION', label: 'Memory Visualizer' },
                  { id: 'CODE_EDITOR', label: 'Code Sandbox' },
                  { id: 'EXPERIMENT_CONTENT', label: 'Theory & Aim' },
                  { id: 'ASSESSMENT', label: 'Assessment Quizzes' },
                  { id: 'VIVA', label: '10s Typing Viva' },
                  { id: 'UI_UX', label: 'UI & User Experience' },
                  { id: 'PERFORMANCE', label: 'Sandbox Speed' },
                  { id: 'OVERALL', label: 'Overall Experience' }
                ].map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id as FeedbackCategory)}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left transition ${
                      category === cat.id
                        ? 'bg-primary text-white border-primary shadow-subtle font-bold'
                        : 'bg-surface text-secondary border-border hover:text-primary'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Multi-Dimensional 1-5 Star Ratings */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                3. Rate Individual Lab Features (1 to 5 Stars):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'aiTeaching', label: 'AI Line-by-Line Teaching' },
                  { key: 'visualization', label: 'Data Structure Visualizer' },
                  { key: 'codeEditor', label: 'C Coding Environment' },
                  { key: 'assessment', label: 'Assessment & MCQs' },
                  { key: 'viva', label: '10-Second Typing Viva' },
                  { key: 'overall', label: 'Overall Learning Experience' }
                ].map((item) => (
                  <div key={item.key} className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary">{item.label}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatings(prev => ({ ...prev, [item.key]: star }))}
                          className="text-xs focus:outline-hidden"
                        >
                          <Star
                            className={`w-4 h-4 transition ${
                              (ratings as any)[item.key] >= star
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-zinc-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Written Educational Questions */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-primary block mb-1">
                  What helped you understand this data structure the most?
                </label>
                <textarea
                  rows={3}
                  value={helpedMost}
                  onChange={(e) => setHelpedMost(e.target.value)}
                  placeholder="e.g. The visual arrow diagrams showing how pointers update in RAM..."
                  className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">
                  What was the most difficult or confusing part of this experiment?
                </label>
                <textarea
                  rows={3}
                  value={difficultPart}
                  onChange={(e) => setDifficultPart(e.target.value)}
                  placeholder="e.g. Remembering to allocate memory with malloc() before writing to struct members..."
                  className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-primary block mb-1">
                  What should we improve in the virtual lab?
                </label>
                <textarea
                  rows={3}
                  value={improvementSuggestion}
                  onChange={(e) => setImprovementSuggestion(e.target.value)}
                  placeholder="e.g. Add more intermediate test cases or allow custom tree node counts..."
                  className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 5: Recommendation & Privacy */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-primary">
                  Would you recommend this virtual lab to another student?
                </span>
                <div className="flex gap-2">
                  {[
                    { id: 'yes', label: 'Yes, absolutely' },
                    { id: 'maybe', label: 'Maybe' },
                    { id: 'no', label: 'No' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setWouldRecommend(opt.id as any)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition ${
                        wouldRecommend === opt.id
                          ? 'bg-primary text-white border-primary font-bold shadow-subtle'
                          : 'bg-surface text-secondary border-border hover:text-primary'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Submit anonymously (your name and student ID will not be visible)</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[11px] text-muted font-mono">
                Submitting awards +10 XP to your profile
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center gap-2 shadow-subtle transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback (+10 XP)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
