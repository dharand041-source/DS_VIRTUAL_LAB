'use client';

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import type { OnMount } from '@monaco-editor/react';
import { Play, RotateCcw, FileCode, Loader2 } from 'lucide-react';

// Dynamically import Monaco Editor without SSR to prevent vendor-chunk load errors
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-surface-subtle text-muted text-xs font-mono min-h-[300px]">
      <Loader2 className="w-5 h-5 animate-spin text-primary mb-2" />
      <span>Loading C Monaco Editor...</span>
    </div>
  ),
});

interface CodeEditorPanelProps {
  code: string;
  onChange: (value: string) => void;
  onCursorLineChange: (line: number) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning?: boolean;
  activeLine?: number;
  starterCode?: string;
  solutionCode?: string;
}

export function CodeEditorPanel({
  code,
  onChange,
  onCursorLineChange,
  onRun,
  onReset,
  isRunning,
  activeLine = 1,
  starterCode,
  solutionCode
}: CodeEditorPanelProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Track line cursor changes for live AST visual sync
    editor.onDidChangeCursorPosition((e) => {
      onCursorLineChange(e.position.lineNumber);
    });

    // Configure clean typography & theme
    monaco.editor.defineTheme('academic-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717A', fontStyle: 'italic' },
        { token: 'keyword', foreground: '111111', fontStyle: 'bold' },
        { token: 'type', foreground: '2563EB' },
        { token: 'string', foreground: '059669' },
        { token: 'number', foreground: 'D97706' },
      ],
      colors: {
        'editor.background': '#FAFAFA',
        'editor.foreground': '#111111',
        'editorLineNumber.foreground': '#A1A1AA',
        'editorLineNumber.activeForeground': '#111111',
        'editor.lineHighlightBackground': '#F4F4F5',
        'editorCursor.foreground': '#111111',
        'editor.selectionBackground': '#E4E4E7',
      }
    });

    monaco.editor.setTheme('academic-light');
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Editor Header Toolbar */}
      <div className="px-4 py-2.5 border-b border-border bg-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary font-mono">program.c</span>
          <span className="text-[11px] font-mono text-muted bg-surface px-1.5 py-0.5 rounded border border-border">
            Line {activeLine}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {starterCode && (
            <button
              onClick={() => onChange(starterCode)}
              className="text-xs text-muted hover:text-primary transition font-medium px-2 py-1"
              title="Load Starter Template"
            >
              Starter
            </button>
          )}

          {solutionCode && (
            <button
              onClick={() => onChange(solutionCode)}
              className="text-xs text-muted hover:text-primary transition font-medium px-2 py-1"
              title="Load Full Reference Program"
            >
              Reference
            </button>
          )}

          <button
            onClick={onReset}
            title="Reset code"
            className="p-1 text-muted hover:text-primary transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-50 transition shadow-subtle"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isRunning ? 'Compiling...' : 'Run Program'}
          </button>
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          defaultLanguage="c"
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            cursorBlinking: 'smooth',
            lineDecorationsWidth: 10,
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
}
