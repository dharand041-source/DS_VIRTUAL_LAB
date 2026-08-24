'use client';

import React, { useState } from 'react';
import { AssessmentQuestion } from '@/lib/types';
import { CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: AssessmentQuestion[];
  experimentTitle: string;
  onComplete: (score: number, maxScore: number) => void;
}

export function AssessmentRunner({
  isOpen,
  onClose,
  questions,
  experimentTitle,
  onComplete
}: AssessmentRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];
  const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: optIdx });
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
      let earned = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          earned += q.points;
        }
      });
      onComplete(earned, totalPoints);
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  const calculateScore = () => {
    let earned = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        earned += q.points;
      }
    });
    return earned;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-border shadow-floating max-w-lg w-full p-6 animate-fade-in relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!showResult ? (
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
              <div>
                <span className="text-xs font-mono text-muted uppercase">Experiment Assessment</span>
                <h3 className="text-sm font-bold text-primary">{experimentTitle}</h3>
              </div>
              <span className="text-xs font-mono text-primary bg-surface px-2 py-0.5 rounded border border-border">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <span className="text-[10px] font-bold text-accent-blue uppercase tracking-wider block mb-1">
                {currentQ.type.replace('_', ' ')}
              </span>
              <p className="text-sm font-semibold text-primary mb-2">
                {currentQ.question}
              </p>

              {currentQ.codeSnippet && (
                <div className="p-3 bg-surface-subtle border border-border rounded-lg mb-3">
                  <pre className="text-xs font-mono text-primary whitespace-pre-wrap">{currentQ.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedAnswers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-zinc-50 font-semibold shadow-subtle'
                        : 'border-border bg-white hover:border-zinc-300'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-zinc-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentIndex] === undefined}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover disabled:opacity-50 transition shadow-subtle flex items-center justify-center gap-1.5"
            >
              <span>{currentIndex + 1 === questions.length ? 'Finish & Score' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Result Summary */
          <div className="py-2 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-accent-emerald" />
            </div>
            <h3 className="text-base font-bold text-primary mb-1">Assessment Complete!</h3>
            <p className="text-2xl font-bold font-mono text-primary my-2">
              {calculateScore()} / {totalPoints} <span className="text-xs text-muted font-sans">Points Earned</span>
            </p>

            <div className="space-y-2.5 max-h-64 overflow-y-auto text-left my-4 pr-1">
              {questions.map((q, idx) => {
                const isCorrect = selectedAnswers[idx] === q.correctAnswer;
                return (
                  <div key={idx} className={`p-3 rounded-lg border text-xs ${isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span>Q{idx + 1}: {q.question}</span>
                      {isCorrect ? (
                        <span className="text-accent-emerald flex items-center gap-1 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Correct</span>
                      ) : (
                        <span className="text-accent-rose flex items-center gap-1 font-bold"><XCircle className="w-3.5 h-3.5" /> Incorrect</span>
                      )}
                    </div>
                    <p className="text-muted text-[11px] font-mono mt-1">{q.explanation}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition shadow-subtle"
            >
              Done & Return to Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
