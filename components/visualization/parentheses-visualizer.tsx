'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, XCircle, ArrowRight, Info } from 'lucide-react';

export function ParenthesesVisualizer() {
  const [expression, setExpression] = useState<string>('{[()]}');
  const [charIndex, setCharIndex] = useState<number>(-1);
  const [bracketStack, setBracketStack] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'valid' | 'invalid'>('idle');
  const [log, setLog] = useState<string>("Enter an expression and click 'Simulate Evaluation'");

  const handleSimulate = () => {
    setStatus('running');
    setCharIndex(-1);
    setBracketStack([]);
    setLog(`Starting evaluation for expression: ${expression}`);

    let currIdx = 0;
    const stack: string[] = [];

    const interval = setInterval(() => {
      if (currIdx >= expression.length) {
        clearInterval(interval);
        if (stack.length === 0) {
          setStatus('valid');
          setLog('Complete! Stack is empty (top == -1). Expression is perfectly BALANCED.');
        } else {
          setStatus('invalid');
          setLog(`Evaluation finished, but ${stack.length} unclosed opening bracket(s) remain on stack. Expression is UNBALANCED.`);
        }
        return;
      }

      const ch = expression[currIdx];
      setCharIndex(currIdx);

      if (['(', '{', '['].includes(ch)) {
        stack.push(ch);
        setBracketStack([...stack]);
        setLog(`Char '${ch}' at index ${currIdx} is an OPENING bracket -> PUSHed onto stack.`);
      } else if ([')', '}', ']'].includes(ch)) {
        if (stack.length === 0) {
          clearInterval(interval);
          setStatus('invalid');
          setLog(`Found CLOSING bracket '${ch}' at index ${currIdx} but stack is EMPTY (Underflow). Expression is UNBALANCED.`);
          return;
        }

        const topChar = stack[stack.length - 1];
        const isMatch =
          (topChar === '(' && ch === ')') ||
          (topChar === '{' && ch === '}') ||
          (topChar === '[' && ch === ']');

        if (!isMatch) {
          clearInterval(interval);
          setStatus('invalid');
          setLog(`Type Mismatch: Stack top '${topChar}' cannot close with '${ch}' at index ${currIdx}. Expression is UNBALANCED.`);
          return;
        }

        stack.pop();
        setBracketStack([...stack]);
        setLog(`Matched pair '${topChar}' with '${ch}' -> POPped from stack.`);
      }

      currIdx++;
    }, 800);
  };

  const handleReset = () => {
    setCharIndex(-1);
    setBracketStack([]);
    setStatus('idle');
    setLog("Reset to initial state. Ready to simulate.");
  };

  return (
    <div className="w-full flex flex-col h-full bg-white select-none">
      {/* Header Controls */}
      <div className="px-4 py-3 border-b border-border flex flex-wrap items-center justify-between gap-2 bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Algorithm:</span>
          <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-surface-subtle border border-border">
            Balanced Parentheses Checker
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-border rounded-md px-2 py-0.5 bg-white">
            <span className="text-xs text-muted font-mono">Expr:</span>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-24 text-xs font-mono font-bold text-primary bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={handleSimulate}
            disabled={status === 'running'}
            className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition shadow-subtle"
          >
            <Play className="w-3 h-3" /> Simulate
          </button>

          <button
            onClick={handleReset}
            className="p-1 text-muted hover:text-primary transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-around gap-6 min-h-[220px]">
        {/* Expression Tape with Scanner Needle */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase text-muted mb-2">Input Expression Stream</span>
          <div className="flex items-center gap-1.5 p-2 bg-surface-subtle border border-border rounded-lg">
            {expression.split('').map((char, idx) => {
              const isCurrent = idx === charIndex;
              const isProcessed = idx < charIndex;

              return (
                <div
                  key={idx}
                  className={`w-9 h-11 flex flex-col items-center justify-center rounded font-mono font-bold text-base transition-all ${
                    isCurrent
                      ? 'bg-primary text-white scale-110 shadow-card ring-2 ring-primary'
                      : isProcessed
                      ? 'bg-zinc-200 text-zinc-600'
                      : 'bg-white text-primary border border-border'
                  }`}
                >
                  <span>{char}</span>
                  <span className="text-[8px] opacity-70 -mt-1 font-normal">{idx}</span>
                </div>
              );
            })}
          </div>

          {status === 'valid' && (
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-accent-emerald bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4" /> BALANCED EXPRESSION
            </div>
          )}

          {status === 'invalid' && (
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-accent-rose bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              <XCircle className="w-4 h-4" /> NOT BALANCED
            </div>
          )}
        </div>

        {/* Character Stack */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-mono uppercase text-muted mb-2">Character Stack Buffer</span>
          <div className="w-24 h-40 border-b-4 border-l-2 border-r-2 border-primary rounded-b p-1.5 bg-zinc-50 flex flex-col-reverse gap-1 shadow-subtle overflow-y-auto">
            {bracketStack.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] font-mono text-muted text-center">
                Stack Empty
              </div>
            ) : (
              bracketStack.map((b, idx) => (
                <div
                  key={idx}
                  className="w-full py-1 text-center font-mono font-bold text-sm bg-primary text-white rounded shadow-subtle"
                >
                  {b}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* State Log */}
      <div className="px-4 py-2.5 border-t border-border bg-surface flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-muted shrink-0" />
        <p className="text-xs font-mono text-secondary truncate">
          {log}
        </p>
      </div>
    </div>
  );
}
