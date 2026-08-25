'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LMSStage, StageProgress, ExperimentProgress } from './types';
import {
  SEEDED_USERS,
  getStoredUser,
  setStoredUser,
  getStoredStageProgress,
  saveStageProgress,
  getContinueLearningInfo
} from './storage';

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  switchUserRole: (role: UserRole | 'our-student' | 'other-student' | 'faculty' | 'admin') => void;
  addXP: (amount: number, reason?: string) => void;
  markExperimentCompleted: (expId: string) => void;
  trackStageCompletion: (expId: string, stage: LMSStage, data?: Partial<StageProgress>) => ExperimentProgress;
  getExperimentStageProgress: (expId: string) => ExperimentProgress;
  getContinueLearning: () => ReturnType<typeof getContinueLearningInfo>;
  isOurCollegeStudent: boolean;
  isFaculty: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  canAccessCollegeEvaluation: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(SEEDED_USERS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserState(getStoredUser());
    setMounted(true);
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    setStoredUser(newUser);
  };

  const switchUserRole = (target: UserRole | 'our-student' | 'other-student' | 'faculty' | 'admin') => {
    let targetUser: User;
    if (target === 'our-student' || target === 'student') {
      targetUser = SEEDED_USERS[0];
    } else if (target === 'other-student') {
      targetUser = SEEDED_USERS[1];
    } else if (target === 'faculty') {
      targetUser = SEEDED_USERS[2];
    } else if (target === 'admin') {
      targetUser = {
        ...SEEDED_USERS[2],
        id: 'user-admin-01',
        name: 'Dr. K. Rajasekaran (Admin & HOD)',
        role: 'admin'
      };
    } else {
      targetUser = {
        ...SEEDED_USERS[1],
        id: 'guest-user',
        name: 'Guest Learner',
        role: 'guest',
        isOurCollege: false,
        xp: 0
      };
    }
    setUser(targetUser);
  };

  const addXP = (amount: number, reason?: string) => {
    setUserState((prev) => {
      const updated = { ...prev, xp: prev.xp + amount };
      setStoredUser(updated);
      return updated;
    });
  };

  const markExperimentCompleted = (expId: string) => {
    setUserState((prev) => {
      const currentList = prev.completedExperiments || [];
      if (currentList.includes(expId)) return prev;
      const uniqueList = Array.from(new Set([...currentList, expId]));
      const updated = {
        ...prev,
        completedExperiments: uniqueList,
        xp: prev.xp + 100
      };
      setStoredUser(updated);
      return updated;
    });
  };

  const trackStageCompletion = (expId: string, stage: LMSStage, data?: Partial<StageProgress>) => {
    const updatedProgress = saveStageProgress(user.id, expId, stage, data);
    setUserState(getStoredUser());
    return updatedProgress;
  };

  const getExperimentStageProgress = (expId: string) => {
    return getStoredStageProgress(user.id, expId);
  };

  const getContinueLearning = () => {
    return getContinueLearningInfo(user.id);
  };

  const isOurCollegeStudent = user.role === 'student' && user.isOurCollege;
  const isFaculty = user.role === 'faculty' || user.role === 'admin';
  const isAdmin = user.role === 'admin';
  const isGuest = user.role === 'guest';
  const canAccessCollegeEvaluation = isOurCollegeStudent || isFaculty || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchUserRole,
        addXP,
        markExperimentCompleted,
        trackStageCompletion,
        getExperimentStageProgress,
        getContinueLearning,
        isOurCollegeStudent,
        isFaculty,
        isAdmin,
        isGuest,
        canAccessCollegeEvaluation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
