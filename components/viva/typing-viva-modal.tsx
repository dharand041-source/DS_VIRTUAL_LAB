'use client';

import React, { useState, useEffect } from 'react';
import { VivaQuestion, VivaAttempt } from '@/lib/types';
import { Clock, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TypingVivaModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: VivaQuestion[];
  experimentTitle: string;
  onComplete: (attempts: VivaAttempt[]) => void;
}

export function TypingVivaModal({
  isOpen,
  onClose,
  questions,
  experimentTitle,
  onComplete
}: TypingVivaModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [answerInput, setAnswerInput] = useState('');
  const [attempts, setAttempts] = useState<VivaAttempt[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const currentQ = questions[currentIndex];

  // 10-Second Countdown Timer
  useEffect(() => {
    if (!isOpen || !hasStarted || isCompleted) return;

    if (timeLeft <= 0) {
      handleNextQuestion(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, hasStarted, timeLeft, isCompleted]);

  if (!isOpen) return null;

  const handleStart = () => {
    setHasStarted(true);
    setTimeLeft(currentQ?.timeLimitSeconds || 10);
    setCurrentIndex(0);
    setAttempts([]);
    setIsCompleted(false);
  };

  const handleNextQuestion = (isTimeOut = false) => {
    if (!currentQ) return;

    // AI provisional grading based on keyword matches
    const studentText = answerInput.trim();
    let matches = 0;
    currentQ.idealKeywords.forEach(kw => {
      if (studentText.toLowerCase().includes(kw.toLowerCase())) {
        matches++;
      }
    });

    const aiScore = Math.min(5, Math.max(1, Math.round((matches / Math.max(1, currentQ.idealKeywords.length)) * 5) + (studentText.length > 15 ? 1 : 0)));

    const attempt: VivaAttempt = {
      questionId: currentQ.id,
      question: currentQ.question,
      studentAnswer: studentText || (isTimeOut ? '[Time Expired - No Answer Submitted]' : '[Skipped]'),
      timeSpentSeconds: 10 - timeLeft,
      aiSuggestedScore: studentText ? aiScore : 0,
      aiFeedback: studentText
        ? `Covered ${matches}/${currentQ.idealKeywords.length} key concepts. Provisional score ${aiScore}/5.`
        : 'No answer submitted within the 10-second limit.'
    };

    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);
    setAnswerInput('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(questions[currentIndex + 1].timeLimitSeconds || 10);
    } else {
      setIsCompleted(true);
      onComplete(newAttempts);
      confetti({ particleCount: 50, spread: 60 });
    }
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

        {!hasStarted ? (
          /* Introduction Screen */
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-surface-subtle border border-border flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">
              Typing-Based Academic Viva
            </h3>
            <p className="text-xs text-muted mb-4">
              {experimentTitle} ({questions.length} Questions)
            </p>

            <div className="bg-surface p-3.5 rounded-lg border border-border text-left text-xs space-y-2 mb-5">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <ShieldAlert className="w-4 h-4 text-accent-amber" />
                <span>Strict Laboratory Viva Rules:</span>
              </div>
              <ul className="list-disc list-inside text-secondary space-y-1">
                <li>Strict <strong className="text-primary">10 seconds timer</strong> per question.</li>
                <li><strong className="text-primary">Typing only</strong> — speech-to-text is disabled.</li>
                <li>Clipboard pasting is restricted in viva mode.</li>
                <li>Provisional AI score will be sent to faculty for final evaluation.</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition shadow-subtle flex items-center justify-center gap-2"
            >
              <span>Begin 10s Typing Viva</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : isCompleted ? (
          /* Completion Summary */
          <div className="py-2">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
              <h3 className="text-base font-bold text-primary">Viva Completed!</h3>
            </div>
            <p className="text-xs text-muted mb-4">
              Your viva responses have been saved and forwarded to the faculty evaluation queue.
            </p>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 mb-5">
              {attempts.map((att, idx) => (
                <div key={idx} className="p-3 bg-surface rounded-lg border border-border text-xs">
                  <div className="flex items-center justify-between font-bold text-primary mb-1">
                    <span>Q{idx + 1}: {att.question}</span>
                    <span className="text-accent-blue font-mono">{att.aiSuggestedScore}/5 pts</span>
                  </div>
                  <p className="text-secondary mb-1">
                    <strong className="text-muted">Your Answer:</strong> {att.studentAnswer}
                  </p>
                  <p className="text-[11px] text-muted font-mono">{att.aiFeedback}</p>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition shadow-subtle"
            >
              Done & Return to Lab
            </button>
          </div>
        ) : (
          /* Active Question & Timer Screen */
          <div>
            {/* Top Timer Bar */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <span className="text-xs font-mono text-muted">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-colors ${
                timeLeft <= 3
                  ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse'
                  : 'bg-surface text-primary border-border'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s remaining</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-primary leading-snug">
                {currentQ.question}
              </h4>
            </div>

            {/* Anti-Paste Typing Area */}
            <div className="mb-4">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                onPaste={(e) => {
                  e.preventDefault();
                  alert('Pasting is restricted in academic viva mode. Please type your answer.');
                }}
                placeholder="Type your answer concisely here..."
                rows={3}
                autoFocus
                className="w-full text-xs p-3 rounded-lg border border-border focus:border-primary focus:outline-none bg-surface-subtle resize-none font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-muted mt-1">
                <span>Anti-paste active</span>
                <span>Press Submit or wait for timer</span>
              </div>
            </div>

            {/* Submit Question */}
            <button
              onClick={() => handleNextQuestion(false)}
              className="w-full py-2 rounded-lg bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition shadow-subtle flex items-center justify-center gap-1.5"
            >
              <span>Submit Answer ({currentIndex + 1}/{questions.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
