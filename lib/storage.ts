import { User, Submission, LeaderboardEntry, EvaluationScheme } from './types';
import { DEFAULT_EVALUATION_SCHEME } from './syllabus-data';

export const SEEDED_USERS: User[] = [
  {
    id: "user-our-student-01",
    name: "Aarav Sharma",
    email: "aarav.cse@ourcollege.edu.in",
    role: "student",
    collegeId: "col-our-01",
    collegeName: "Department of Computer Science & Engineering, Our College",
    departmentId: "dept-cse",
    departmentName: "Computer Science & Engineering",
    year: "II Year / III Sem",
    section: "CSE-A",
    xp: 540,
    streakDays: 4,
    completedExperiments: ["exp-01-singly-linked-list", "exp-02-stack-using-array"],
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
    completedExperiments: ["exp-01-singly-linked-list"],
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
    collegeName: "Department of Computer Science & Engineering, Our College",
    departmentId: "dept-cse",
    departmentName: "Computer Science & Engineering",
    xp: 2500,
    streakDays: 45,
    completedExperiments: ["exp-01-singly-linked-list", "exp-02-stack-using-array", "exp-03-stack-using-linked-list", "exp-04-balanced-parentheses"],
    badges: [],
    isOurCollege: true,
    createdAt: "2026-01-01"
  }
];

export const SEEDED_COLLEGE_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, userId: "u-col-1", name: "Siddharth Verma", avatar: "SV", collegeName: "Our College (CSE-A)", isOurCollege: true, xp: 920, badgesCount: 6, experimentsCompleted: 4, weeklyXp: 280 },
  { rank: 2, previousRank: 3, userId: "u-col-2", name: "Deepika Raman", avatar: "DR", collegeName: "Our College (CSE-B)", isOurCollege: true, xp: 810, badgesCount: 5, experimentsCompleted: 4, weeklyXp: 220 },
  { rank: 3, previousRank: 2, userId: "u-col-3", name: "Karthik Raja", avatar: "KR", collegeName: "Our College (CSE-A)", isOurCollege: true, xp: 690, badgesCount: 4, experimentsCompleted: 3, weeklyXp: 190 },
  { rank: 4, previousRank: 4, userId: "user-our-student-01", name: "Aarav Sharma (You)", avatar: "AS", collegeName: "Our College (CSE-A)", isOurCollege: true, xp: 540, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 150 },
  { rank: 5, previousRank: 6, userId: "u-col-5", name: "Ananya Iyer", avatar: "AI", collegeName: "Our College (CSE-B)", isOurCollege: true, xp: 480, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 130 }
];

export const SEEDED_GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, userId: "u-glob-1", name: "Alex Mercer", avatar: "AM", collegeName: "Cambridge Tech", isOurCollege: false, xp: 1450, badgesCount: 8, experimentsCompleted: 4, weeklyXp: 410 },
  { rank: 2, previousRank: 2, userId: "u-glob-2", name: "Siddharth Verma", avatar: "SV", collegeName: "Our College", isOurCollege: true, xp: 920, badgesCount: 6, experimentsCompleted: 4, weeklyXp: 280 },
  { rank: 3, previousRank: 4, userId: "u-glob-3", name: "Elena Rostova", avatar: "ER", collegeName: "State Univ", isOurCollege: false, xp: 870, badgesCount: 5, experimentsCompleted: 4, weeklyXp: 240 },
  { rank: 4, previousRank: 3, userId: "u-col-2", name: "Deepika Raman", avatar: "DR", collegeName: "Our College", isOurCollege: true, xp: 810, badgesCount: 5, experimentsCompleted: 4, weeklyXp: 220 },
  { rank: 5, previousRank: 5, userId: "u-glob-5", name: "Chen Wei", avatar: "CW", collegeName: "Pacific Poly", isOurCollege: false, xp: 740, badgesCount: 4, experimentsCompleted: 3, weeklyXp: 200 },
  { rank: 6, previousRank: 6, userId: "u-col-3", name: "Karthik Raja", avatar: "KR", collegeName: "Our College", isOurCollege: true, xp: 690, badgesCount: 4, experimentsCompleted: 3, weeklyXp: 190 },
  { rank: 7, previousRank: 8, userId: "user-other-student-02", name: "Priya Nair", avatar: "PN", collegeName: "National Institute of Tech", isOurCollege: false, xp: 620, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 170 },
  { rank: 8, previousRank: 7, userId: "user-our-student-01", name: "Aarav Sharma (You)", avatar: "AS", collegeName: "Our College", isOurCollege: true, xp: 540, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 150 },
  { rank: 9, previousRank: 9, userId: "u-glob-9", name: "Marcus Brody", avatar: "MB", collegeName: "Urban Tech", isOurCollege: false, xp: 510, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 140 },
  { rank: 10, previousRank: 10, userId: "u-col-5", name: "Ananya Iyer", avatar: "AI", collegeName: "Our College", isOurCollege: true, xp: 480, badgesCount: 3, experimentsCompleted: 2, weeklyXp: 130 }
];

export const SEEDED_SUBMISSIONS: Submission[] = [
  {
    id: "sub-101",
    userId: "user-our-student-01",
    userName: "Aarav Sharma",
    collegeId: "col-our-01",
    experimentId: "exp-01-singly-linked-list",
    experimentTitle: "Implementation of Singly Linked List ADT",
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
        questionId: "viva-01",
        question: "What is a self-referential structure in C and why is it used in Linked Lists?",
        studentAnswer: "A structure containing a pointer to another structure of the same type, allowing nodes to link in memory.",
        timeSpentSeconds: 7,
        aiSuggestedScore: 5,
        aiFeedback: "Accurate and concise explanation of self-referential pointer linkage.",
        facultyScore: 5,
        facultyFeedback: "Excellent conceptual clarity."
      },
      {
        questionId: "viva-02",
        question: "What will happen if you do not set the last node's 'next' pointer to NULL?",
        studentAnswer: "It will point to garbage address and crash the traversal loop.",
        timeSpentSeconds: 6,
        aiSuggestedScore: 5,
        aiFeedback: "Identified undefined pointer behavior correctly.",
        facultyScore: 4.5,
        facultyFeedback: "Good answer."
      }
    ],
    assessmentScore: 15,
    facultyFeedback: "Very clean pointer assignments and dynamic memory management. Verified in laboratory observation.",
    submittedAt: "2026-08-22 14:30",
    evaluatedAt: "2026-08-23 10:15"
  }
];

// Helper functions for localStorage state
export function getStoredUser(): User {
  if (typeof window === 'undefined') return SEEDED_USERS[0];
  const stored = localStorage.getItem('ds_current_user');
  if (stored) {
    try {
      return JSON.parse(stored);
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

export function getStoredSubmissions(): Submission[] {
  if (typeof window === 'undefined') return SEEDED_SUBMISSIONS;
  const stored = localStorage.getItem('ds_submissions');
  if (stored) {
    try {
      return JSON.parse(stored);
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
  }
}
