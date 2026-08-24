'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { analyzeCProgramState } from '@/lib/c-ast-interpreter';
import { executeCSandbox, SandboxExecutionResult } from '@/lib/c-sandbox-executor';
import { useAuth } from '@/lib/auth-context';
import { saveSubmission, saveFeedback, markExperimentCompleted } from '@/lib/storage';
import { ASTProgramState, StudentFeedback } from '@/lib/types';
import { VisualizerEngine } from '@/components/visualization/visualizer-engine';
import { TypingVivaModal } from '@/components/viva/typing-viva-modal';
import { AssessmentRunner } from '@/components/assessment/assessment-runner';
import {
  BookOpen,
  Target,
  Lightbulb,
  FileCode,
  Code2,
  Eye,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  Star,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Clock,
  Send,
  Award,
  AlertCircle,
  Database,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ExperimentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const expId = params?.id as string;
  const { user, addXP } = useAuth();

  const experimentIndex = useMemo(() => {
    const idx = SYLLABUS_EXPERIMENTS.findIndex(e => e.id === expId);
    return idx >= 0 ? idx : 0;
  }, [expId]);

  const experiment = SYLLABUS_EXPERIMENTS[experimentIndex] || SYLLABUS_EXPERIMENTS[0];
  const prevExp = experimentIndex > 0 ? SYLLABUS_EXPERIMENTS[experimentIndex - 1] : null;
  const nextExp = experimentIndex < SYLLABUS_EXPERIMENTS.length - 1 ? SYLLABUS_EXPERIMENTS[experimentIndex + 1] : null;

  // 4 Tabs: Theory, Lab, Assessment & Viva, Feedback
  const [activeTab, setActiveTab] = useState<'theory' | 'lab' | 'assessment' | 'feedback'>('theory');

  // Sub-experiment selection if applicable
  const [selectedSubExp, setSelectedSubExp] = useState<number>(0);

  // Coding state
  const [code, setCode] = useState<string>(experiment.defaultCode);
  const [activeLine, setActiveLine] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<SandboxExecutionResult | null>(null);

  // Integrated Lab right panel tab: 'visual' | 'ai' | 'output' | 'memory'
  const [labRightTab, setLabRightTab] = useState<'visual' | 'ai' | 'output' | 'memory'>('visual');

  // Editor ref
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<any[]>([]);

  // Modals / Assessment states
  const [showVivaModal, setShowVivaModal] = useState<boolean>(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);

  // Feedback form state
  const [feedbackRatings, setFeedbackRatings] = useState({
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
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Reset state on experiment change
  useEffect(() => {
    setCode(experiment.defaultCode);
    setActiveLine(1);
    setSelectedSubExp(0);
    setExecutionResult(null);
    setFeedbackSubmitted(false);
    setLabRightTab('visual');
    setActiveTab('theory');
  }, [experiment]);

  // Update code when switching sub-experiment
  const handleSubExpChange = (idx: number) => {
    setSelectedSubExp(idx);
    if (experiment.subExperiments && experiment.subExperiments[idx]) {
      setCode(experiment.subExperiments[idx].code);
      setActiveLine(1);
      setExecutionResult(null);
    }
  };

  // Compute live AST Program State
  const astState: ASTProgramState = useMemo(() => {
    return analyzeCProgramState(code, activeLine);
  }, [code, activeLine]);

  // Update error highlighting decorations in Monaco
  useEffect(() => {
    if (!editorRef.current) return;
    const monaco = (window as any).monaco;
    if (!monaco) return;

    if (executionResult && !executionResult.success && executionResult.errorLine) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new monaco.Range(executionResult.errorLine, 1, executionResult.errorLine, 1),
          options: {
            isWholeLine: true,
            className: 'bg-rose-500/20 border-l-4 border-rose-500',
            glyphMarginClassName: 'text-rose-500 font-bold',
            hoverMessage: { value: `**Error:** ${executionResult.compilationError || 'Syntax / Logic error'}` }
          }
        }
      ]);
      editorRef.current.revealLineInCenter(executionResult.errorLine);
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [executionResult]);

  // Run C Sandbox
  const handleRunProgram = async () => {
    setIsRunning(true);
    const result = await executeCSandbox(code, experiment.testCases);
    setExecutionResult(result);
    setIsRunning(false);

    if (result.success) {
      addXP(50, 'Completed Experiment Coding Test Cases');
      markExperimentCompleted(experiment.id);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      setLabRightTab('output');
    } else {
      if (result.errorLine) {
        setActiveLine(result.errorLine);
      }
      setLabRightTab('output');
    }
  };

  const handleResetCode = () => {
    if (experiment.subExperiments && experiment.subExperiments[selectedSubExp]) {
      setCode(experiment.subExperiments[selectedSubExp].code);
    } else {
      setCode(experiment.defaultCode);
    }
    setActiveLine(1);
    setExecutionResult(null);
  };

  const handleVivaComplete = () => {
    addXP(100, 'Completed Typing Viva');
    markExperimentCompleted(experiment.id);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
  };

  const handleAssessmentComplete = (score: number) => {
    addXP(score * 10, 'Completed Assessment');
    markExperimentCompleted(experiment.id);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fb: StudentFeedback = {
      id: `fb-${Date.now()}`,
      userId: isAnonymous ? 'anonymous' : user.id,
      userName: isAnonymous ? 'Anonymous Student' : user.name,
      userRole: user.role,
      collegeName: user.collegeName,
      isOurCollege: user.isOurCollege,
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      ratings: feedbackRatings,
      helpedMost,
      difficultPart,
      improvementSuggestion,
      wouldRecommend,
      category: 'OVERALL',
      isAnonymous,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    saveFeedback(fb);
    addXP(10, 'Submitted Educational Feedback');
    setFeedbackSubmitted(true);
  };

  const isCompleted = user.completedExperiments?.includes(experiment.id);

  return (
    <div className="flex-1 flex flex-col bg-surface-subtle select-none">
      {/* Top Header Bar */}
      <header className="border-b border-border bg-white px-4 sm:px-6 py-3 sticky top-14 z-30 shadow-subtle">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Left: Breadcrumbs & Title */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted font-mono mb-1">
              <Link href="/experiments" className="hover:text-primary transition flex items-center gap-1">
                <span>Experiments</span>
              </Link>
              <span>/</span>
              <span className="text-secondary">N21UIT307</span>
              <span>/</span>
              <span className="text-primary font-bold">
                EXP {experiment.expNumber < 10 ? `0${experiment.expNumber}` : experiment.expNumber}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-xl font-bold text-primary tracking-tight">
                {experiment.title}
              </h1>

              {isCompleted ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed</span>
                </span>
              ) : (
                <span className="text-[11px] text-muted font-medium px-2 py-0.5 rounded bg-surface border border-border">
                  Not Started
                </span>
              )}
            </div>
          </div>

          {/* Right: Prev / Next Navigation Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {prevExp ? (
              <Link
                href={`/experiments/${prevExp.id}`}
                className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-secondary hover:text-primary text-xs font-semibold flex items-center gap-1 transition shadow-subtle"
                title={`Previous: ${prevExp.title}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EXP {prevExp.expNumber}</span>
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-border/40 text-muted/40 text-xs font-semibold flex items-center gap-1 cursor-not-allowed">
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </span>
            )}

            {nextExp ? (
              <Link
                href={`/experiments/${nextExp.id}`}
                className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-semibold flex items-center gap-1 transition shadow-subtle"
                title={`Next: ${nextExp.title}`}
              >
                <span className="hidden sm:inline">EXP {nextExp.expNumber}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <span className="px-3 py-1.5 rounded-lg border border-border/40 text-muted/40 text-xs font-semibold flex items-center gap-1 cursor-not-allowed">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Primary Tabs Strip: Theory, Lab, Assignment & Viva, Feedback */}
      <div className="border-b border-border bg-surface px-4 sm:px-6">
        <div className="w-full flex items-center gap-2 py-2 overflow-x-auto">
          {[
            {
              id: 'theory',
              label: 'Theory, Aim & Algorithm',
              subtitle: 'Aim, Theory, Procedure & Analysis',
              icon: BookOpen
            },
            {
              id: 'lab',
              label: 'Interactive Lab & Visualizer',
              subtitle: 'Code Editor, AST Engine, AI Teacher & Output',
              icon: Code2
            },
            {
              id: 'assessment',
              label: 'Assignment & Viva',
              subtitle: 'Quiz & 10s Viva Voice Challenge',
              icon: FileCheck
            },
            {
              id: 'feedback',
              label: 'Student Feedback',
              subtitle: 'Review & XP Rating (+10 XP)',
              icon: MessageSquare
            }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-primary border border-border shadow-subtle font-bold'
                    : 'text-secondary hover:text-primary hover:bg-white/60 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted'}`} />
                <div className="text-left">
                  <span className="block font-bold">{tab.label}</span>
                  <span className="text-[10px] text-muted font-normal hidden sm:block">
                    {tab.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* =========================================================================
            TAB 1: UNIFIED ALL-IN-ONE THEORY, AIM & ALGORITHM
           ========================================================================= */}
        {activeTab === 'theory' && (
          <div className="space-y-6 animate-fade-in">
            {/* 1. Overview & Complexity Card */}
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="px-2.5 py-1 rounded bg-surface border border-border text-xs font-mono font-bold text-primary">
                  Course Code: N21UIT307 • Anna University Regulation 2021
                </span>

                <div className="flex items-center gap-2">
                  {experiment.coMapping.map((co, idx) => (
                    <span key={idx} className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                      {co.split(' - ')[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary mb-2">
                  {experiment.title}
                </h2>
                <p className="text-sm text-secondary leading-relaxed">
                  {experiment.definition}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                    <span>Learning Objectives</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-secondary">
                    {experiment.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary font-bold">&bull;</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-surface/50 border border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-accent-amber" />
                    <span>Complexity & Characteristics</span>
                  </h3>
                  <div className="space-y-2 text-xs text-secondary font-mono">
                    <div><strong>Time Complexity:</strong> {experiment.timeComplexity.average} ({experiment.timeComplexity.explanation})</div>
                    <div><strong>Space Complexity:</strong> {experiment.spaceComplexity.value} ({experiment.spaceComplexity.explanation})</div>
                    <div><strong>Data Structure:</strong> {experiment.dataStructure || experiment.category}</div>
                  </div>
                </div>
              </div>

              {/* Real World Analogy */}
              <div className="p-4 rounded-xl bg-surface/60 border border-border space-y-2">
                <h3 className="text-xs font-bold text-primary flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent-amber" />
                  <span>Real-World Analogy: {experiment.realWorldExample.title}</span>
                </h3>
                <p className="text-xs text-secondary leading-relaxed">
                  {experiment.realWorldExample.analogy}
                </p>
                <div className="p-2.5 bg-white rounded-lg border border-border text-xs text-primary font-mono">
                  <strong>Industry Application:</strong> {experiment.realWorldExample.application}
                </div>
              </div>
            </div>

            {/* 2. Official Aim & Problem Statement */}
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
                  Official Laboratory Aim
                </h3>
              </div>

              <div className="p-4 bg-surface rounded-xl border border-border text-sm font-serif italic text-primary leading-relaxed">
                &ldquo;{experiment.aim}&rdquo;
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted block">
                  Problem Statement
                </span>
                <p className="text-xs text-secondary leading-relaxed bg-surface/40 p-4 rounded-xl border border-border">
                  {experiment.problemStatement}
                </p>
              </div>
            </div>

            {/* 3. Theory & Conceptual Architecture */}
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
                  Conceptual Theory & Memory Model
                </h3>
              </div>

              <p className="text-xs text-secondary leading-relaxed">
                {experiment.theory}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    1. WHAT is this Data Structure?
                  </span>
                  <p className="text-xs text-secondary leading-relaxed">
                    {experiment.definition}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    2. WHY do we need it?
                  </span>
                  <p className="text-xs text-secondary leading-relaxed">
                    {experiment.objectives[0] || 'Provides dynamic O(1) operations and optimized memory allocation.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    3. WHERE is it applied?
                  </span>
                  <p className="text-xs text-secondary leading-relaxed">
                    {experiment.realWorldExample.application}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface/50 border border-border space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    4. HOW does it operate in RAM?
                  </span>
                  <p className="text-xs text-secondary leading-relaxed font-mono">
                    {experiment.spaceComplexity.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Step-by-Step Algorithmic Procedure & Pseudocode */}
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-5">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
                  Step-by-Step Algorithmic Procedure
                </h3>
              </div>

              {/* Numbered Steps */}
              <div className="space-y-2.5">
                {experiment.algorithm.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border bg-surface/40 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="text-xs text-primary font-medium leading-relaxed">
                      {step}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pseudocode */}
              <div className="pt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-2 font-mono">
                  Formal Algorithm Pseudocode
                </span>
                <pre className="p-4 rounded-xl bg-surface border border-border text-xs font-mono text-primary overflow-x-auto leading-relaxed">
                  {experiment.pseudocode}
                </pre>
              </div>
            </div>

            {/* Bottom Proceed CTA */}
            <div className="p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary">Theory & Algorithm Understood?</h4>
                <p className="text-xs text-secondary mt-0.5">
                  Launch the interactive coding lab to write C code, visualize pointers in real-time, and run test cases.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('lab')}
                className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold flex items-center gap-2 shadow-subtle transition shrink-0"
              >
                <span>Proceed to Interactive Coding Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: INTERACTIVE CODING LAB & REAL-TIME VISUALIZER
           ========================================================================= */}
        {activeTab === 'lab' && (
          <div className="space-y-4 animate-fade-in">
            {/* Sub-experiment switcher if applicable */}
            {experiment.subExperiments && experiment.subExperiments.length > 0 && (
              <div className="p-3 bg-white border border-border rounded-xl shadow-subtle flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary font-mono">
                    Select Sub-Experiment Module:
                  </span>
                  <div className="flex gap-1.5">
                    {experiment.subExperiments.map((sub, idx) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubExpChange(idx)}
                        className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border transition ${
                          selectedSubExp === idx
                            ? 'bg-primary text-white border-primary shadow-subtle'
                            : 'bg-surface text-secondary border-border hover:text-primary'
                        }`}
                      >
                        {sub.subCode}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-xs text-secondary font-medium">
                  {experiment.subExperiments[selectedSubExp]?.title}
                </span>
              </div>
            )}

            {/* Error Diagnostics Alert Banner if Code Execution Failed */}
            {executionResult && !executionResult.success && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-subtle animate-fade-in space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-accent-rose font-bold text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      Compilation / Execution Error {executionResult.errorLine && `at Line ${executionResult.errorLine}`}
                    </span>
                  </div>
                  {executionResult.errorLine && (
                    <button
                      onClick={() => {
                        setActiveLine(executionResult.errorLine!);
                        if (editorRef.current) {
                          editorRef.current.revealLineInCenter(executionResult.errorLine);
                        }
                      }}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 font-bold hover:bg-rose-200 transition"
                    >
                      Jump to Line {executionResult.errorLine} &rarr;
                    </button>
                  )}
                </div>

                <pre className="text-xs font-mono text-rose-950 bg-rose-100/60 p-2.5 rounded-lg whitespace-pre-wrap">
                  {executionResult.compilationError || executionResult.stdout}
                </pre>

                {executionResult.beginnerErrorExplanation && (
                  <div className="text-xs text-rose-900 bg-white/80 p-2.5 rounded-lg border border-rose-200/80">
                    <strong className="text-rose-950">💡 Why this error happened & How to fix it:</strong>{' '}
                    {executionResult.beginnerErrorExplanation}
                  </div>
                )}
              </div>
            )}

            {/* Split Screen Lab Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
              {/* Left Column: Monaco Code Editor (6 cols) */}
              <div className="lg:col-span-6 flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-subtle">
                {/* Editor Header */}
                <div className="px-4 py-2.5 border-b border-border bg-surface flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-primary font-mono">
                      {experiment.shortTitle.toLowerCase().replace(/\s+/g, '_')}.c
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCode}
                      className="p-1.5 rounded-md border border-border bg-white hover:bg-surface text-muted hover:text-primary text-xs transition"
                      title="Reset Code to Default"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleRunProgram}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center gap-1.5 shadow-subtle transition disabled:opacity-50"
                    >
                      {isRunning ? (
                        <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current text-primary" />
                      )}
                      <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 min-h-[440px] relative">
                  <Editor
                    height="100%"
                    language="c"
                    theme="light"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      fontSize: 13,
                      fontFamily: "'JetBrains Mono', Consolas, monospace",
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      glyphMargin: true,
                      automaticLayout: true,
                      padding: { top: 12, bottom: 12 }
                    }}
                    onMount={(editor) => {
                      editorRef.current = editor;
                      editor.onMouseDown((e) => {
                        if (e.target.position) {
                          setActiveLine(e.target.position.lineNumber);
                        }
                      });
                    }}
                  />
                </div>

                {/* Active Line Synchronizer Footer */}
                <div className="p-2.5 bg-surface border-t border-border flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] uppercase font-bold text-muted px-1.5 py-0.5 rounded bg-white border border-border">
                      L{activeLine}
                    </span>
                    <span className="truncate text-primary font-semibold">
                      {astState.activeLineText || '// (empty line)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-accent-emerald font-sans font-semibold shrink-0">
                    ✨ AI Synchronized
                  </span>
                </div>
              </div>

              {/* Right Column: Multi-Panel Workspace (Visualizer, AI Teacher, Output, Memory) */}
              <div className="lg:col-span-6 flex flex-col bg-white border border-border rounded-xl overflow-hidden shadow-subtle">
                {/* Right Panel Tabs Switcher */}
                <div className="px-3 py-2 border-b border-border bg-surface flex items-center justify-between gap-1 overflow-x-auto">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLabRightTab('visual')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        labRightTab === 'visual'
                          ? 'bg-white text-primary border border-border shadow-subtle'
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Visualizer</span>
                    </button>

                    <button
                      onClick={() => setLabRightTab('ai')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        labRightTab === 'ai'
                          ? 'bg-white text-primary border border-border shadow-subtle'
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
                      <span>AI Teacher</span>
                    </button>

                    <button
                      onClick={() => setLabRightTab('output')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        labRightTab === 'output'
                          ? 'bg-white text-primary border border-border shadow-subtle'
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5 text-accent-emerald" />
                      <span>Output & Tests</span>
                    </button>

                    <button
                      onClick={() => setLabRightTab('memory')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                        labRightTab === 'memory'
                          ? 'bg-white text-primary border border-border shadow-subtle'
                          : 'text-secondary hover:text-primary'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Memory Table</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-mono text-muted hidden sm:inline">
                    Line {activeLine}
                  </span>
                </div>

                {/* Right Panel Tab Contents */}
                <div className="flex-1 flex flex-col min-h-[460px] p-4 overflow-y-auto">
                  {/* PANEL 1: LIVE VISUALIZER */}
                  {labRightTab === 'visual' && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                          Real-Time AST Memory State
                        </span>
                        <span className="text-[10px] font-mono text-accent-emerald bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                          ● Active AST Engine
                        </span>
                      </div>
                      <div className="flex-1 border border-border rounded-xl overflow-hidden min-h-[400px]">
                        <VisualizerEngine
                          experiment={experiment}
                          astState={astState}
                          activeLine={activeLine}
                        />
                      </div>
                    </div>
                  )}

                  {/* PANEL 2: AI LINE-BY-LINE TEACHER */}
                  {labRightTab === 'ai' && (
                    <div className="space-y-3">
                      {astState.lineExplanation ? (
                        <>
                          <div className="p-3.5 bg-surface rounded-xl border border-border">
                            <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                              Purpose & What It Does
                            </span>
                            <p className="text-xs text-primary font-semibold">
                              {astState.lineExplanation.purpose}
                            </p>
                            <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                              {astState.lineExplanation.whatItDoes}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-border bg-white">
                            <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                              💡 Beginner Conceptual Analogy
                            </span>
                            <p className="text-xs text-secondary leading-relaxed">
                              {astState.lineExplanation.beginnerFriendly}
                            </p>
                          </div>

                          <div className="p-3.5 rounded-xl border border-border bg-white">
                            <span className="text-[10px] font-bold uppercase text-muted block mb-1">
                              ⚙️ Internal RAM / CPU Memory Effect
                            </span>
                            <p className="text-xs text-secondary font-mono leading-relaxed">
                              {astState.lineExplanation.internalMemoryEffect}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16 text-xs text-muted">
                          Click on any line of code in the editor to inspect line-by-line pedagogical breakdown.
                        </div>
                      )}
                    </div>
                  )}

                  {/* PANEL 3: OUTPUT & TEST RUNNER */}
                  {labRightTab === 'output' && (
                    <div className="space-y-4">
                      {executionResult ? (
                        <>
                          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                            executionResult.success
                              ? 'bg-emerald-50 border-emerald-200 text-accent-emerald'
                              : 'bg-rose-50 border-rose-200 text-accent-rose'
                          }`}>
                            <div className="flex items-center gap-2 font-bold text-xs">
                              {executionResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              <span>
                                {executionResult.success
                                  ? 'All Test Cases Passed (+50 XP)'
                                  : `Failed: ${executionResult.totalPassed} / ${executionResult.totalTests} Passed`}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono">
                              ⏱ {executionResult.executionTimeMs}ms
                            </span>
                          </div>

                          {/* Console Output Block */}
                          <div>
                            <span className="text-[10px] font-bold uppercase text-muted block mb-1 font-mono">
                              Program Standard Output (stdout):
                            </span>
                            <pre className="p-3 rounded-xl bg-surface border border-border text-xs font-mono text-primary whitespace-pre-wrap leading-relaxed">
                              {executionResult.stdout || 'Program exited cleanly with code 0.'}
                            </pre>
                          </div>

                          {/* Test Cases List */}
                          <div>
                            <span className="text-[10px] font-bold uppercase text-muted block mb-1.5 font-mono">
                              Test Cases Breakdown:
                            </span>
                            <div className="space-y-2">
                              {executionResult.results.map((r, i) => (
                                <div key={i} className="p-3 bg-surface/50 rounded-xl border border-border text-xs font-mono space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-primary">{r.name}</span>
                                    <span className={r.passed ? 'text-accent-emerald font-bold' : 'text-accent-rose font-bold'}>
                                      {r.passed ? '✓ PASSED' : '✗ FAILED'}
                                    </span>
                                  </div>
                                  {!r.passed && r.errorMessage && (
                                    <p className="text-accent-rose text-[11px] pt-1">
                                      {r.errorMessage}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-16 space-y-2 text-xs text-muted">
                          <Terminal className="w-8 h-8 text-muted/40 mx-auto" />
                          <p>Click <strong>"Run Code"</strong> in the editor toolbar to compile and test against test cases.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PANEL 4: MEMORY TABLE */}
                  {labRightTab === 'memory' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono">
                          Active Stack & Heap Variables
                        </span>
                        <span className="text-[11px] font-mono text-muted">
                          Call Stack: {astState.callStack.join(' -> ')}
                        </span>
                      </div>

                      {astState.variables.length === 0 ? (
                        <div className="text-center py-12 text-xs text-muted font-mono">
                          No active variables in current line scope.
                        </div>
                      ) : (
                        <div className="border border-border rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-surface border-b border-border text-muted">
                              <tr>
                                <th className="py-2 px-3">Variable</th>
                                <th className="py-2 px-3">Type</th>
                                <th className="py-2 px-3">Address</th>
                                <th className="py-2 px-3">Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {astState.variables.map((v, i) => (
                                <tr key={i} className="hover:bg-surface-subtle transition">
                                  <td className="py-2 px-3 font-bold text-primary">{v.name}</td>
                                  <td className="py-2 px-3 text-secondary">{v.type}</td>
                                  <td className="py-2 px-3 text-muted">{v.address}</td>
                                  <td className="py-2 px-3 font-bold text-accent-blue">{String(v.value)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Proceed CTA to Assignment & Viva */}
            <div className="p-4 bg-white border border-border rounded-xl shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-primary">Lab Code Complete?</h4>
                <p className="text-[11px] text-secondary">
                  Proceed to take the assessment quiz and 10-second typing viva challenge.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('assessment')}
                className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold flex items-center gap-1.5 shadow-subtle transition shrink-0"
              >
                <span>Take Assignment & Viva</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: ASSIGNMENT & VIVA EVALUATION
           ========================================================================= */}
        {activeTab === 'assessment' && (
          <div className="space-y-6 animate-fade-in">
            {/* Assessment & Viva Header Banner */}
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <FileCheck className="w-5 h-5 text-primary" />
                <span className="text-xs font-mono font-bold text-muted uppercase">
                  ACADEMIC EVALUATION & VIVA VOCE • N21UIT307
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary tracking-tight">
                Assignment Assessment & Laboratory Viva: {experiment.shortTitle}
              </h2>
              <p className="text-xs text-secondary leading-relaxed">
                Demonstrate your practical understanding through structured assessment questions and high-speed Anna University viva voce challenges.
              </p>
            </div>

            {/* Assessment & Viva Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Part 1: Assignment / Assessment Quiz */}
              <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent-blue flex items-center justify-center font-bold text-sm border border-blue-200">
                        1
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary">
                          Concept & Code Assessment
                        </h3>
                        <span className="text-[11px] font-mono text-muted">
                          {experiment.assessmentQuestions.length} Questions &bull; +30 XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">
                    Evaluates algorithmic properties, code output prediction, pointer manipulations, and error debugging for {experiment.title}.
                  </p>

                  <div className="p-3 bg-surface rounded-xl border border-border text-xs font-mono space-y-1">
                    <div className="text-primary font-bold">Evaluation Criteria:</div>
                    <div className="text-secondary text-[11px]">&bull; Output prediction under test inputs</div>
                    <div className="text-secondary text-[11px]">&bull; Pointer link traversal accuracy</div>
                    <div className="text-secondary text-[11px]">&bull; Time & Space complexity analysis</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAssessmentModal(true)}
                  className="w-full py-3 rounded-xl border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center justify-center gap-2 shadow-subtle transition group"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-primary group-hover:scale-110 transition" />
                  <span>Launch Assessment Quiz (+30 XP)</span>
                </button>
              </div>

              {/* Part 2: 10-Second Typing Viva */}
              <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm border border-amber-200">
                        2
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary">
                          10-Second Typing Viva Voce
                        </h3>
                        <span className="text-[11px] font-mono text-muted">
                          {experiment.vivaQuestions.length} Questions &bull; +100 XP
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">
                    Experience authentic Anna University viva voce conditions. Type concise technical answers before the 10-second countdown expires!
                  </p>

                  <div className="p-3 bg-surface rounded-xl border border-border text-xs font-mono space-y-1">
                    <div className="text-primary font-bold">Viva Examination Rules:</div>
                    <div className="text-secondary text-[11px]">&bull; Strict 10-second countdown per question</div>
                    <div className="text-secondary text-[11px]">&bull; Real-time AI keyword & semantic matching</div>
                    <div className="text-secondary text-[11px]">&bull; Instant Anna University marks attribution</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowVivaModal(true)}
                  className="w-full py-3 rounded-xl border border-border bg-white hover:bg-surface text-primary text-xs font-bold flex items-center justify-center gap-2 shadow-subtle transition group"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-primary group-hover:scale-110 transition" />
                  <span>Start 10s Viva Challenge (+100 XP)</span>
                </button>
              </div>
            </div>

            {/* Bottom Proceed CTA to Feedback */}
            <div className="p-6 bg-white border border-border rounded-xl shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-primary">Completed Assessment & Viva?</h4>
                <p className="text-xs text-secondary mt-0.5">
                  Submit your learning feedback to earn +10 XP and complete this experiment module.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('feedback')}
                className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold flex items-center gap-2 shadow-subtle transition shrink-0"
              >
                <span>Proceed to Student Feedback</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: STUDENT FEEDBACK
           ========================================================================= */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fade-in">
            <div className="academic-card p-6 bg-white border border-border rounded-xl shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-base font-bold text-primary">
                    Educational Experience Feedback: {experiment.shortTitle}
                  </h2>
                </div>
                <span className="text-xs font-mono text-muted">
                  Earn +10 XP
                </span>
              </div>

              {feedbackSubmitted ? (
                <div className="p-8 text-center bg-surface rounded-xl border border-border space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-accent-emerald mx-auto" />
                  <h3 className="text-sm font-bold text-primary">Thank You for Your Feedback!</h3>
                  <p className="text-xs text-secondary max-w-md mx-auto">
                    Your feedback has been submitted to the Department of AI&DS curriculum evaluation system and +10 XP has been awarded to your profile.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted block mb-3">
                      Rate Your Learning Experience (1 to 5 Stars):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { key: 'aiTeaching', label: 'AI Teaching Assistant' },
                        { key: 'visualization', label: 'Memory Visualizer' },
                        { key: 'codeEditor', label: 'Coding Lab & Sandbox' },
                        { key: 'assessment', label: 'Assessment Quizzes' },
                        { key: 'viva', label: '10s Typing Viva' },
                        { key: 'overall', label: 'Overall Experience' }
                      ].map((item) => (
                        <div key={item.key} className="p-3 bg-surface rounded-xl border border-border flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">{item.label}</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() =>
                                  setFeedbackRatings(prev => ({ ...prev, [item.key]: star }))
                                }
                                className="text-xs focus:outline-hidden"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    (feedbackRatings as any)[item.key] >= star
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-primary block mb-1">
                        What helped you understand the concept most?
                      </label>
                      <textarea
                        rows={3}
                        value={helpedMost}
                        onChange={(e) => setHelpedMost(e.target.value)}
                        placeholder="e.g. Line-by-line explanation of pointers and the animated node boxes..."
                        className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-primary block mb-1">
                        What was difficult or confusing?
                      </label>
                      <textarea
                        rows={3}
                        value={difficultPart}
                        onChange={(e) => setDifficultPart(e.target.value)}
                        placeholder="e.g. Understanding why malloc() returns a void pointer..."
                        className="w-full text-xs p-3 bg-surface border border-border rounded-xl text-primary focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                    <label className="flex items-center gap-2 text-xs font-medium text-secondary cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span>Submit anonymously (identity hidden from peer leaderboard)</span>
                    </label>

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
        )}
      </div>

      {/* Typing Viva Modal */}
      {showVivaModal && (
        <TypingVivaModal
          isOpen={showVivaModal}
          experimentTitle={experiment.title}
          questions={experiment.vivaQuestions}
          onComplete={handleVivaComplete}
          onClose={() => setShowVivaModal(false)}
        />
      )}

      {/* Assessment Quiz Modal */}
      {showAssessmentModal && (
        <AssessmentRunner
          isOpen={showAssessmentModal}
          onClose={() => setShowAssessmentModal(false)}
          questions={experiment.assessmentQuestions}
          experimentTitle={experiment.title}
          onComplete={handleAssessmentComplete}
        />
      )}
    </div>
  );
}
