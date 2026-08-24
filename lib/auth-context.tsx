'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { SEEDED_USERS, getStoredUser, setStoredUser } from './storage';

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  switchUserRole: (role: UserRole | 'our-student' | 'other-student' | 'faculty') => void;
  addXP: (amount: number, reason?: string) => void;
  markExperimentCompleted: (expId: string) => void;
  isOurCollegeStudent: boolean;
  isFaculty: boolean;
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

  const switchUserRole = (target: UserRole | 'our-student' | 'other-student' | 'faculty') => {
    let targetUser: User;
    if (target === 'our-student' || target === 'student') {
      targetUser = SEEDED_USERS[0];
    } else if (target === 'other-student') {
      targetUser = SEEDED_USERS[1];
    } else if (target === 'faculty') {
      targetUser = SEEDED_USERS[2];
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
      if (prev.completedExperiments.includes(expId)) return prev;
      const updated = {
        ...prev,
        completedExperiments: [...prev.completedExperiments, expId],
        xp: prev.xp + 100
      };
      setStoredUser(updated);
      return updated;
    });
  };

  const isOurCollegeStudent = user.role === 'student' && user.isOurCollege;
  const isFaculty = user.role === 'faculty';
  const isGuest = user.role === 'guest';
  const canAccessCollegeEvaluation = isOurCollegeStudent || isFaculty;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchUserRole,
        addXP,
        markExperimentCompleted,
        isOurCollegeStudent,
        isFaculty,
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
