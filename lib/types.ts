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

export interface LinePedagogicalExplanation {
  rawLine: string;
  lineNumber: number;
  category: 'preprocessor' | 'struct_type' | 'pointer_op' | 'dynamic_memory' | 'stack_op' | 'loop_control' | 'conditional' | 'function' | 'io' | 'assignment' | 'general';
  purpose: string;
  whatItDoes: string;
  whyUsed: string;
  whyNeeded: string;
  whatIfRemoved: string;
  internalMemoryEffect: string;
  beginnerFriendly: string;
  keySymbols?: { symbol: string; meaning: string }[];
  potentialMistakes?: string[];
}

export interface SubExperiment {
  id: string;
  subCode: string; // e.g. "1A", "1B", "1C"
  title: string;
  aim: string;
  code: string;
  starterCode?: string;
  algorithm: string[];
}

export type FeedbackCategory =
  | 'AI_TEACHING'
  | 'VISUALIZATION'
  | 'CODE_EDITOR'
  | 'EXPERIMENT_CONTENT'
  | 'ALGORITHM'
  | 'ASSESSMENT'
  | 'VIVA'
  | 'UI_UX'
  | 'PERFORMANCE'
  | 'OVERALL';

export interface StudentFeedback {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  collegeName: string;
  isOurCollege: boolean;
  experimentId: string;
  experimentTitle: string;
  ratings: {
    aiTeaching: number;
    visualization: number;
    codeEditor: number;
    assessment: number;
    viva: number;
    overall: number;
  };
  helpedMost?: string;
  difficultPart?: string;
  improvementSuggestion?: string;
  wouldRecommend: 'yes' | 'maybe' | 'no';
  category: FeedbackCategory;
  isAnonymous: boolean;
  createdAt: string;
}

export interface FeedbackAnalytics {
  experimentId: string;
  averageRatings: {
    aiTeaching: number;
    visualization: number;
    codeEditor: number;
    assessment: number;
    viva: number;
    overall: number;
  };
  totalResponses: number;
  categoryBreakdown: Record<FeedbackCategory, number>;
}

export interface Experiment {
  id: string;
  expNumber: number;
  title: string;
  shortTitle: string;
  category: string;
  dataStructure?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  aim: string;
  objectives: string[];
  definition: string;
  theory: string;
  subExperiments?: SubExperiment[];
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
    astConcept?: string;
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
  visualizationType:
    | 'linked_list'
    | 'stack_array'
    | 'stack_linked_list'
    | 'parentheses'
    | 'queue_array'
    | 'queue_linked_list'
    | 'bst'
    | 'dijkstra'
    | 'kruskal'
    | 'prim'
    | 'insertion_sort'
    | 'merge_sort'
    | 'quick_sort'
    | 'recursion'
    | 'structures'
    | 'pointers'
    | 'project';
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

export interface ASTArrayItem {
  index: number;
  value: string | number;
  address: string;
  isHighlighted?: boolean;
}

export interface ASTQueueItem {
  index: number;
  value: string | number;
  isFront?: boolean;
  isRear?: boolean;
}

export interface ASTTreeNode {
  id: string;
  value: number | string;
  leftId?: string | null;
  rightId?: string | null;
  address: string;
}

export interface ASTHeapBlock {
  address: string;
  sizeBytes: number;
  type: string;
  label: string;
  value?: any;
  freed: boolean;
}

export interface ASTProgramState {
  activeLineNumber: number;
  activeLineText: string;
  variables: ASTVariable[];
  nodes: ASTVisualNode[];
  stackItems: ASTStackItem[];
  arrayItems?: ASTArrayItem[];
  queueItems?: ASTQueueItem[];
  treeNodes?: ASTTreeNode[];
  heapBlocks?: ASTHeapBlock[];
  detectedStructure?: 'linked_list' | 'stack' | 'queue' | 'array' | 'tree' | 'pointers' | 'general';
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
  lineExplanation?: LinePedagogicalExplanation;
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

// =========================================================================
// LMS ARCHITECTURAL MODELS
// =========================================================================

export type LMSStage =
  | 'aim_theory'
  | 'algorithm'
  | 'coding'
  | 'visualization'
  | 'practice'
  | 'assessment'
  | 'viva'
  | 'submission'
  | 'feedback';

export type LMSStageStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface StageProgress {
  stage: LMSStage;
  name: string;
  status: LMSStageStatus;
  completedAt?: string;
  score?: number;
  maxScore?: number;
  meta?: Record<string, any>;
}

export interface ExperimentProgress {
  experimentId: string;
  overallStatus: LMSStageStatus;
  completionPercentage: number;
  stages: Record<LMSStage, StageProgress>;
  lastAccessedStage: LMSStage;
  lastAccessedAt: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  regulation: string;
  department: string;
  institution: string;
  description: string;
  totalExperiments: number;
  credits: number;
}

export interface CompletionRule {
  requireTheory: boolean;
  requireAlgorithm: boolean;
  requireCodingTestCases: boolean;
  requireAssessment: boolean;
  minAssessmentScorePercent: number;
  requireViva: boolean;
  minVivaScorePercent: number;
  requireSubmission: boolean;
}

export interface StudentProgressSummary {
  userId: string;
  userName: string;
  email: string;
  collegeName: string;
  departmentName: string;
  year: string;
  section?: string;
  isOurCollege: boolean;
  xp: number;
  completedExperimentsCount: number;
  courseCompletionPercentage: number;
  experimentProgress: Record<string, ExperimentProgress>;
  pendingSubmissionsCount: number;
  averageVivaScore: number;
  averageAssessmentScore: number;
  needsIntervention: boolean;
  interventionReason?: string;
}

export interface LearningRecommendation {
  id: string;
  experimentId: string;
  experimentTitle: string;
  experimentNumber: number;
  topic: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'practice' | 'viva' | 'next_unit';
  actionUrl: string;
}

