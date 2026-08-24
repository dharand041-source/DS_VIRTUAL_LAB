'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SYLLABUS_EXPERIMENTS } from '@/lib/syllabus-data';
import { analyzeCProgramState } from '@/lib/c-ast-interpreter';
import { executeCSandbox, SandboxExecutionResult } from '@/lib/c-sandbox-executor';
import { useAuth } from '@/lib/auth-context';
import { saveSubmission } from '@/lib/storage';
import { Submission, ASTProgramState } from '@/lib/types';
import { CodeEditorPanel } from '@/components/lab/code-editor-panel';
import { VisualizerEngine } from '@/components/visualization/visualizer-engine';
import { AIExplanationPanel } from '@/components/lab/ai-explanation-panel';
import { OutputConsole } from '@/components/lab/output-console';
import { BotVerificationModal } from '@/components/lab/bot-verification-modal';
import { TypingVivaModal } from '@/components/viva/typing-viva-modal';
import { AssessmentRunner } from '@/components/assessment/assessment-runner';
import {
  Play,
  Award,
  HelpCircle,
  Clock,
  CheckCircle,
  FileCheck,
  ArrowLeft,
  Sparkles,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveLabPage() {
  const params = useParams();
  const expId = params?.id as string;
  const { user, addXP, markExperimentCompleted, canAccessCollegeEvaluation } = useAuth();

  const experiment = SYLLABUS_EXPERIMENTS.find(e => e.id === expId) || SYLLABUS_EXPERIMENTS[0];

  const [code, setCode] = useState<string>(experiment.defaultCode);
  const [activeLine, setActiveLine] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<SandboxExecutionResult | null>(null);

  // Modals
  const [isBotVerified, setIsBotVerified] = useState<boolean>(false);
  const [showBotModal, setShowBotModal] = useState<boolean>(false);
  const [showVivaModal, setShowVivaModal] = useState<boolean>(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Mobile active tab: 'code' | 'visual' | 'ai' | 'output'
  const [mobileTab, setMobileTab] = useState<'code' | 'visual' | 'ai' | 'output'>('code');

  // Verify on initial mount
  useEffect(() => {
    // Show bot challenge before entering lab
    setShowBotModal(true);
  }, []);

  // Compute live AST Program State whenever code or active line changes
  const astState: ASTProgramState = useMemo(() => {
    return analyzeCProgramState(code, activeLine);
  }, [code, activeLine]);

  // Handle Run
  const handleRunProgram = async () => {
    setIsRunning(true);
    const result = await executeCSandbox(code, experiment.testCases);
    setExecutionResult(result);
    setIsRunning(false);

    if (result.success) {
      addXP(50, 'Passed Sandbox Test Cases');
      markExperimentCompleted(experiment.id);
    }
  };

  const handleResetCode = () => {
    setCode(experiment.defaultCode);
    setActiveLine(1);
    setExecutionResult(null);
  };

  const handleVivaComplete = (attempts: any[]) => {
    addXP(100, 'Completed Typing Viva');
  };

  const handleAssessmentComplete = (score: number, maxScore: number) => {
    addXP(score * 10, 'Completed Assessment');
  };

  const handleSubmitToFaculty = () => {
    if (!user.isOurCollege && user.role !== 'faculty') {
      alert('Note: Guest/Other College accounts cannot submit to internal college records.');
      return;
    }

    const sub: Submission = {
      id: `sub-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      collegeId: user.collegeId,
      experimentId: experiment.id,
      experimentTitle: experiment.title,
      code,
      passedCount: executionResult ? executionResult.totalPassed : 3,
      totalCount: experiment.testCases.length,
      executionTimeMs: executionResult ? executionResult.executionTimeMs : 3,
      status: 'passed',
      marks: {
        coding: 26,
        assessment: 17,
        viva: 13,
        facultyObservation: 8,
        total: 64
      },
      vivaAttempts: [],
      assessmentScore: 15,
      submittedAt: new Date().toLocaleString(),
    };

    saveSubmission(sub);
    setSubmissionFeedback('Submission successfully logged for Faculty Review!');
    confetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setSubmissionFeedback(null), 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-surface select-none">
      {/* Lab Header */}
      <div className="px-4 py-2.5 bg-white border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href={`/experiments/${experiment.id}`}
            className="text-xs text-muted hover:text-primary transition flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block"></div>

          <div>
            <h1 className="text-xs font-bold text-primary flex items-center gap-2">
              <span>EXP {experiment.expNumber}: {experiment.shortTitle}</span>
              <span className="text-[10px] font-mono text-accent-emerald bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200">
                Live AST Sync
              </span>
            </h1>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAssessmentModal(true)}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary transition shadow-subtle"
          >
            <Award className="w-3.5 h-3.5 text-accent-amber" />
            <span>Assessment</span>
          </button>

          <button
            onClick={() => setShowVivaModal(true)}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-surface text-primary transition shadow-subtle"
          >
            <Clock className="w-3.5 h-3.5 text-accent-blue" />
            <span>10s Typing Viva</span>
          </button>

          <button
            onClick={handleSubmitToFaculty}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-hover transition shadow-subtle"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Submit Lab</span>
          </button>
        </div>
      </div>

      {submissionFeedback && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-accent-emerald flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{submissionFeedback}</span>
        </div>
      )}

      {/* Mobile Tab Bar (Visible on mobile/tablet) */}
      <div className="flex lg:hidden bg-white border-b border-border p-1 gap-1">
        <button
          onClick={() => setMobileTab('code')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded text-center transition ${
            mobileTab === 'code' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
          }`}
        >
          C Code
        </button>
        <button
          onClick={() => setMobileTab('visual')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded text-center transition ${
            mobileTab === 'visual' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
          }`}
        >
          Visualization
        </button>
        <button
          onClick={() => setMobileTab('ai')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded text-center transition ${
            mobileTab === 'ai' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
          }`}
        >
          AI Assistant
        </button>
        <button
          onClick={() => setMobileTab('output')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded text-center transition ${
            mobileTab === 'output' ? 'bg-primary text-white' : 'text-muted hover:text-primary'
          }`}
        >
          Output / Tests
        </button>
      </div>

      {/* Desktop Master 3-Panel + Bottom Console Layout */}
      <div className="flex-1 flex flex-col p-3 gap-3 min-h-0 overflow-y-auto">
        {/* Top 3-Panel Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[460px]">
          {/* Panel 1: Monaco C Code Editor (5 cols) */}
          <div className={`lg:col-span-5 h-[460px] ${mobileTab !== 'code' ? 'hidden lg:block' : 'block'}`}>
            <CodeEditorPanel
              code={code}
              onChange={setCode}
              onCursorLineChange={setActiveLine}
              onRun={handleRunProgram}
              onReset={handleResetCode}
              isRunning={isRunning}
              activeLine={activeLine}
              starterCode={experiment.starterCode}
              solutionCode={experiment.defaultCode}
            />
          </div>

          {/* Panel 2: Live Visualization Engine (4 cols) */}
          <div className={`lg:col-span-4 h-[460px] ${mobileTab !== 'visual' ? 'hidden lg:block' : 'block'}`}>
            <VisualizerEngine
              experiment={experiment}
              astState={astState}
              activeLine={activeLine}
            />
          </div>

          {/* Panel 3: AI Teaching Assistant & Program State (3 cols) */}
          <div className={`lg:col-span-3 h-[460px] ${mobileTab !== 'ai' ? 'hidden lg:block' : 'block'}`}>
            <AIExplanationPanel
              astState={astState}
              experiment={experiment}
              activeLineNumber={activeLine}
            />
          </div>
        </div>

        {/* Bottom Panel: Output Console & Multi-Test Runner */}
        <div className={`h-64 ${mobileTab !== 'output' ? 'hidden lg:block' : 'block'}`}>
          <OutputConsole
            executionResult={executionResult}
            isRunning={isRunning}
          />
        </div>
      </div>

      {/* Cloudflare Turnstile Bot Modal */}
      <BotVerificationModal
        isOpen={showBotModal && !isBotVerified}
        onVerified={() => {
          setIsBotVerified(true);
          setShowBotModal(false);
        }}
        title="Human Verification: Coding Laboratory"
      />

      {/* 10-Second Typing Viva Modal */}
      <TypingVivaModal
        isOpen={showVivaModal}
        onClose={() => setShowVivaModal(false)}
        questions={experiment.vivaQuestions}
        experimentTitle={experiment.title}
        onComplete={handleVivaComplete}
      />

      {/* Experiment Assessment Modal */}
      <AssessmentRunner
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        questions={experiment.assessmentQuestions}
        experimentTitle={experiment.title}
        onComplete={handleAssessmentComplete}
      />
    </div>
  );
}
