import { User, Submission, LeaderboardEntry, EvaluationScheme, StudentFeedback } from './types';
import { DEFAULT_EVALUATION_SCHEME } from './syllabus-data';

export const SEEDED_USERS: User[] = [
  {
    id: "user-our-student-01",
    name: "Aarav Sharma",
    email: "aarav.aids@ourcollege.edu.in",
    role: "student",
    collegeId: "col-our-01",
    collegeName: "Department of Artificial Intelligence & Data Science, Our College",
    departmentId: "dept-aids",
    departmentName: "Artificial Intelligence & Data Science",
    year: "II Year / III Sem",
    section: "AI&DS-A",
    xp: 540,
    streakDays: 4,
    completedExperiments: ["exp-01-simple-c-programs", "exp-02-linked-list-adt", "exp-03-stack-implementation"],
    badges: [
      { id: "b1", name: "Pointer Pioneer", description: "Completed Linked List node pointer analysis", icon: "🔗", category: "mastery", unlockedAt: "2026-08-20" },
      { id: "b2", name: "LIFO Master", description: "Successfully pushed & popped Stack ADT", icon: "📚", category: "progress", unlockedAt: "2026-08-22" },
      { id: "b3", name: "Speed Viva Star", description: "Answered 3 viva questions under 10 seconds", icon: "⚡", category: "viva", unlockedAt: "2026-08-23" }
    ],
    isOurCollege: true,
    createdAt: "2026-08-01"
  },
  {
    id: "user-other-student-02",
    name: "Priya Nair",
    email: "priya.nair@nationaltech.ac.in",
    role: "student",
    collegeId: "col-other-02",
    collegeName: "National Institute of Technology",
    departmentId: "dept-it",
    departmentName: "Information Technology",
    year: "I Year / II Sem",
    xp: 320,
    streakDays: 2,
    completedExperiments: ["exp-01-simple-c-programs"],
    badges: [
      { id: "b1", name: "Pointer Pioneer", description: "Completed Linked List node pointer analysis", icon: "🔗", category: "mastery", unlockedAt: "2026-08-21" }
    ],
    isOurCollege: false,
    createdAt: "2026-08-10"
  },
  {
    id: "user-faculty-01",
    name: "Dr. K. Rajasekaran",
    email: "rajasekaran.hod@ourcollege.edu.in",
    role: "faculty",
    collegeId: "col-our-01",
    collegeName: "Department of Artificial Intelligence & Data Science, Our College",
    departmentId: "dept-aids",
    departmentName: "Artificial Intelligence & Data Science",
    xp: 2500,
    streakDays: 45,
    completedExperiments: [
      "exp-01-simple-c-programs",
      "exp-02-linked-list-adt",
      "exp-03-stack-implementation",
      "exp-04-balanced-parentheses",
      "exp-05-queue-implementation",
      "exp-06-binary-search-tree",
      "exp-07-dijkstras-algorithm",
      "exp-08-minimum-spanning-tree",
      "exp-09-sorting-techniques",
      "exp-10-model-lab-mini-project"
    ],
    badges: [],
    isOurCollege: true,
    createdAt: "2026-01-01"
  }
];

export const SEEDED_COLLEGE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, userId: "u-col-1", name: "Siddharth Verma", avatar: "SV", collegeName: "Our College (AI&DS-A)", isOurCollege: true, xp: 920, badgesCount: 6, experimentsCompleted: 6, weeklyXp: 280 },
  { rank: 2, previousRank: 3, userId: "u-col-2", name: "Deepika Raman", avatar: "DR", collegeName: "Our College (AI&DS-B)", isOurCollege: true, xp: 810, badgesCount: 5, experimentsCompleted: 5, weeklyXp: 220 },
  { rank: 3, previousRank: 2, userId: "u-col-3", name: "Karthik Raja", avatar: "KR", collegeName: "Our College (AI&DS-A)", isOurCollege: true, xp: 690, badgesCount: 4, experimentsCompleted: 4, weeklyXp: 190 },
  { rank: 4, previousRank: 4, userId: "user-our-student-01", name: "Aarav Sharma (You)", avatar: "AS", collegeName: "Our College (AI&DS-A)", isOurCollege: true, xp: 540, badgesCount: 3, experimentsCompleted: 3, weeklyXp: 150 },
  { rank: 5, previousRank: 6, userId: "u-col-5", name: "Ananya Iyer", avatar: "AI", collegeName: "Our College (AI&DS-B)", isOurCollege: true, xp: 480, badgesCount: 3, experimentsCompleted: 3, weeklyXp: 130 }
];

export const SEEDED_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, userId: "u-glob-1", name: "Alex Mercer", avatar: "AM", collegeName: "Cambridge Tech", isOurCollege: false, xp: 1450, badgesCount: 8, experimentsCompleted: 8, weeklyXp: 410 },
  { rank: 2, previousRank: 3, userId: "u-glob-3", name: "Elena Rostova", avatar: "ER", collegeName: "ETH Zurich", isOurCollege: false, xp: 1280, badgesCount: 7, experimentsCompleted: 7, weeklyXp: 350 },
  { rank: 3, previousRank: 2, userId: "u-glob-4", name: "Chen Wei", avatar: "CW", collegeName: "NUS Singapore", isOurCollege: false, xp: 1140, badgesCount: 6, experimentsCompleted: 6, weeklyXp: 310 },
  { rank: 4, previousRank: 5, userId: "u-glob-5", name: "Liam O'Connor", avatar: "LO", collegeName: "Trinity College Dublin", isOurCollege: false, xp: 1050, badgesCount: 6, experimentsCompleted: 6, weeklyXp: 290 },
  { rank: 5, previousRank: 4, userId: "u-col-1", name: "Siddharth Verma", avatar: "SV", collegeName: "Our College (AI&DS)", isOurCollege: true, xp: 920, badgesCount: 6, experimentsCompleted: 6, weeklyXp: 280 },
  { rank: 6, previousRank: 6, userId: "u-glob-6", name: "Marcus Brody", avatar: "MB", collegeName: "UC Berkeley", isOurCollege: false, xp: 860, badgesCount: 5, experimentsCompleted: 5, weeklyXp: 240 },
  { rank: 7, previousRank: 8, userId: "user-other-student-02", name: "Priya Nair", avatar: "PN", collegeName: "NIT Trichy", isOurCollege: false, xp: 780, badgesCount: 4, experimentsCompleted: 4, weeklyXp: 210 },
  { rank: 8, previousRank: 7, userId: "u-glob-7", name: "Yuki Tanaka", avatar: "YT", collegeName: "Tokyo Tech", isOurCollege: false, xp: 710, badgesCount: 4, experimentsCompleted: 4, weeklyXp: 190 },
  { rank: 9, previousRank: 9, userId: "user-our-student-01", name: "Aarav Sharma (You)", avatar: "AS", collegeName: "Our College (AI&DS)", isOurCollege: true, xp: 540, badgesCount: 3, experimentsCompleted: 3, weeklyXp: 150 },
  { rank: 10, previousRank: 10, userId: "u-glob-8", name: "Sophia Martinez", avatar: "SM", collegeName: "Imperial College London", isOurCollege: false, xp: 490, badgesCount: 3, experimentsCompleted: 3, weeklyXp: 140 }
];

export const SEEDED_SUBMISSIONS: Submission[] = [
  {
    id: "sub-101",
    userId: "user-our-student-01",
    userName: "Aarav Sharma",
    collegeId: "col-our-01",
    experimentId: "exp-02-linked-list-adt",
    experimentTitle: "Linked List Implementation of List ADT",
    code: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nstruct Node* head = NULL;\n\nvoid insertAtBeginning(int value) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = value;\n    newNode->next = head;\n    head = newNode;\n}\n\nvoid display() {\n    struct Node* temp = head;\n    while (temp != NULL) {\n        printf("%d -> ", temp->data);\n        temp = temp->next;\n    }\n    printf("NULL\\n");\n}\n\nint main() {\n    insertAtBeginning(10);\n    insertAtBeginning(20);\n    display();\n    return 0;\n}`,
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 4,
    status: "evaluated",
    marks: {
      coding: 28,
      assessment: 18,
      viva: 14,
      facultyObservation: 9,
      total: 69
    },
    vivaAttempts: [
      {
        questionId: "viva-02-1",
        question: "What is a self-referential structure in C and why is it used in Linked Lists?",
        studentAnswer: "A structure containing a pointer to another structure of the same type, allowing nodes to link in memory.",
        timeSpentSeconds: 7,
        aiSuggestedScore: 5,
        aiFeedback: "Accurate and concise explanation of self-referential pointer linkage.",
        facultyScore: 5,
        facultyFeedback: "Excellent conceptual clarity."
      }
    ],
    assessmentScore: 15,
    facultyFeedback: "Very clean pointer assignments and dynamic memory management. Verified in laboratory observation.",
    submittedAt: "2026-08-22 14:30",
    evaluatedAt: "2026-08-23 10:15"
  }
];

export const SEEDED_FEEDBACKS: StudentFeedback[] = [
  {
    id: "fb-101",
    userId: "user-our-student-01",
    userName: "Aarav Sharma",
    userRole: "student",
    collegeName: "Department of Artificial Intelligence & Data Science, Our College",
    isOurCollege: true,
    experimentId: "exp-02-linked-list-adt",
    experimentTitle: "Linked List Implementation of List ADT",
    ratings: {
      aiTeaching: 5,
      visualization: 5,
      codeEditor: 4,
      assessment: 4,
      viva: 5,
      overall: 5
    },
    helpedMost: "The live pointer animations and line-by-line explanation of malloc() and temp->next made linked lists finally click!",
    difficultPart: "Pointer dereferencing syntax before seeing the visual diagram.",
    improvementSuggestion: "Add more polynomial multiplication examples.",
    wouldRecommend: "yes",
    category: "AI_TEACHING",
    isAnonymous: false,
    createdAt: "2026-08-23 11:20"
  },
  {
    id: "fb-102",
    userId: "user-other-student-02",
    userName: "Priya Nair",
    userRole: "student",
    collegeName: "National Institute of Technology",
    isOurCollege: false,
    experimentId: "exp-03-stack-implementation",
    experimentTitle: "Implementation of Stack (Array & Linked List)",
    ratings: {
      aiTeaching: 4,
      visualization: 5,
      codeEditor: 4,
      assessment: 4,
      viva: 4,
      overall: 4
    },
    helpedMost: "The 10-second typing viva countdown is very engaging and feels like real university lab exams.",
    difficultPart: "Checking stack overflow boundary on array vs linked list.",
    improvementSuggestion: "Allow custom max capacity in the stack visualizer.",
    wouldRecommend: "yes",
    category: "VISUALIZATION",
    isAnonymous: true,
    createdAt: "2026-08-24 09:45"
  },
  {
    id: "fb-103",
    userId: "u-col-2",
    userName: "Deepika Raman",
    userRole: "student",
    collegeName: "Our College (AI&DS-B)",
    isOurCollege: true,
    experimentId: "exp-07-dijkstras-algorithm",
    experimentTitle: "Dijkstra's Algorithm (Single Source Shortest Path)",
    ratings: {
      aiTeaching: 5,
      visualization: 5,
      codeEditor: 5,
      assessment: 4,
      viva: 5,
      overall: 5
    },
    helpedMost: "Seeing how edge relaxation updates the distance array step-by-step.",
    difficultPart: "Understanding why negative weights fail in greedy algorithms.",
    improvementSuggestion: "Add Bellman-Ford comparison.",
    wouldRecommend: "yes",
    category: "EXPERIMENT_CONTENT",
    isAnonymous: false,
    createdAt: "2026-08-24 15:10"
  }
];

// Helper functions for localStorage state
export function getStoredUser(): User {
  if (typeof window === 'undefined') return SEEDED_USERS[0];
  const stored = localStorage.getItem('ds_current_user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.departmentName === 'Computer Science & Engineering') {
        parsed.departmentName = 'Artificial Intelligence & Data Science';
        parsed.departmentId = 'dept-aids';
        if (parsed.section?.startsWith('CSE')) {
          parsed.section = parsed.section.replace('CSE', 'AI&DS');
        }
        if (parsed.collegeName?.includes('Computer Science')) {
          parsed.collegeName = parsed.collegeName.replace('Department of Computer Science & Engineering', 'Department of Artificial Intelligence & Data Science');
        }
      }
      return parsed;
    } catch {
      // ignore
    }
  }
  return SEEDED_USERS[0];
}

export function setStoredUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('ds_current_user', JSON.stringify(user));
  }
}

export function awardXP(points: number): number {
  if (typeof window === 'undefined') return points;
  const user = getStoredUser();
  user.xp = (user.xp || 0) + points;
  setStoredUser(user);
  return user.xp;
}

export function markExperimentCompleted(expId: string): void {
  if (typeof window === 'undefined') return;
  const user = getStoredUser();
  if (!user.completedExperiments) user.completedExperiments = [];
  if (!user.completedExperiments.includes(expId)) {
    user.completedExperiments.push(expId);
    user.xp = (user.xp || 0) + 50;
    setStoredUser(user);
  }
}

export function getStoredSubmissions(): Submission[] {
  if (typeof window === 'undefined') return SEEDED_SUBMISSIONS;
  const stored = localStorage.getItem('ds_submissions');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure deduplication
      const unique = Array.from(new Map(parsed.map((s: Submission) => [s.id, s])).values());
      return unique as Submission[];
    } catch {
      // ignore
    }
  }
  return SEEDED_SUBMISSIONS;
}

export function saveSubmission(sub: Submission): void {
  if (typeof window !== 'undefined') {
    const existing = getStoredSubmissions();
    const updated = [sub, ...existing.filter(s => s.id !== sub.id)];
    localStorage.setItem('ds_submissions', JSON.stringify(updated));
    awardXP(30);
  }
}

export function getStoredFeedbacks(): StudentFeedback[] {
  if (typeof window === 'undefined') return SEEDED_FEEDBACKS;
  const stored = localStorage.getItem('ds_feedbacks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ensure deduplication
      const unique = Array.from(new Map(parsed.map((f: StudentFeedback) => [f.id, f])).values());
      return unique as StudentFeedback[];
    } catch {
      // ignore
    }
  }
  return SEEDED_FEEDBACKS;
}

export function saveFeedback(fb: StudentFeedback): void {
  if (typeof window !== 'undefined') {
    const existing = getStoredFeedbacks();
    const updated = [fb, ...existing.filter(f => f.id !== fb.id)];
    localStorage.setItem('ds_feedbacks', JSON.stringify(updated));
    awardXP(10);
  }
}
