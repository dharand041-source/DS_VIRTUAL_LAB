export type UserRole = 'student' | 'faculty' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId: string;
  collegeName: string;
  departmentId?: string;
  departmentName?: string;
  year?: string;
  section?: string;
  avatar?: string;
  xp: number;
  streakDays: number;
  completedExperiments: string[];
  badges: Badge[];
  isOurCollege: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'progress' | 'mastery' | 'viva' | 'streak';
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput: string;
  isPublic: boolean;
  explanation?: string;
}

export interface TestResult {
  testCaseId: string;
  name: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  memoryKb: number;
  errorMessage?: string;
}

export interface VivaQuestion {
  id: string;
  question: string;
  timeLimitSeconds: number; // e.g. 10 seconds
  idealKeywords: string[];
  sampleAnswer: string;
  maxScore: number;
}

export interface AssessmentQuestion {
  id: string;
  type: 'mcq' | 'output_prediction' | 'debug' | 'code_snippet';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export interface Experiment {
  id: string;
  expNumber: number;
  title: string;
  shortTitle: string;
  category: string;
  aim: string;
  objectives: string[];
  definition: string;
  theory: string;
  realWorldExample: {
    title: string;
    analogy: string;
    application: string;
  };
  problemStatement: string;
  algorithm: string[];
  pseudocode: string;
  defaultCode: string;
  starterCode: string;
  lineByLineExplanations: Record<number, {
    purpose: string;
    beginnerFriendly: string;
    whyNeeded: string;
    whatIfRemoved: string;
    astConcept: string;
  }>;
  testCases: TestCase[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
    explanation: string;
  };
  spaceComplexity: {
    value: string;
    explanation: string;
  };
  coMapping: string[]; // Course Outcomes e.g. ["CO1", "CO2"]
  vivaQuestions: VivaQuestion[];
  assessmentQuestions: AssessmentQuestion[];
  visualizationType: 'linked_list' | 'stack_array' | 'stack_linked_list' | 'parentheses';
}

export interface ASTVisualNode {
  id: string;
  value: string | number;
  address?: string;
  nextAddress?: string | null;
  isHead?: boolean;
  isTail?: boolean;
  isHighlighted?: boolean;
  color?: string;
}

export interface ASTStackItem {
  id: string;
  value: string | number;
  index: number;
  isTop?: boolean;
}

export interface ASTVariable {
  name: string;
  type: string;
  value: string | number | null;
  scope: string;
  address?: string;
}

export interface ASTProgramState {
  activeLineNumber: number;
  variables: ASTVariable[];
  nodes: ASTVisualNode[];
  stackItems: ASTStackItem[];
  charBuffer?: string[];
  matchedIndices?: number[];
  activePointerName?: string;
  activePointerTarget?: string | null;
  loopStatus?: {
    variable: string;
    currentIteration: number;
    totalIterations?: number;
    condition: string;
    isTerminated: boolean;
  };
  callStack: string[];
  consoleOutput: string[];
  lineExplanation?: {
    purpose: string;
    beginnerFriendly: string;
    whyNeeded: string;
    whatIfRemoved: string;
  };
  error?: string;
}

export interface VivaAttempt {
  questionId: string;
  question: string;
  studentAnswer: string;
  timeSpentSeconds: number;
  aiSuggestedScore: number;
  aiFeedback: string;
  facultyScore?: number;
  facultyFeedback?: string;
}

export interface Submission {
  id: string;
  userId: string;
  userName: string;
  collegeId: string;
  experimentId: string;
  experimentTitle: string;
  code: string;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  status: 'passed' | 'partial' | 'failed' | 'evaluated';
  marks: {
    coding: number; // Max 30
    assessment: number; // Max 20
    viva: number; // Max 15
    facultyObservation: number; // Max 10
    total: number; // Max 75
  };
  vivaAttempts: VivaAttempt[];
  assessmentScore: number;
  facultyFeedback?: string;
  submittedAt: string;
  evaluatedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  userId: string;
  name: string;
  avatar: string;
  collegeName: string;
  isOurCollege: boolean;
  xp: number;
  badgesCount: number;
  experimentsCompleted: number;
  weeklyXp: number;
}

export interface EvaluationScheme {
  maxMarks: number;
  codingWeight: number;
  assessmentWeight: number;
  vivaWeight: number;
  facultyObservationWeight: number;
  regulation: string; // e.g. "Anna University 2021 Regulation"
}
