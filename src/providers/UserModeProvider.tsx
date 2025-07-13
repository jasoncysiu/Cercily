"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

type UserMode = "QuickThinker" | "OverThinker";

interface UserModeContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const [storedMode, setStoredMode] = useLocalStorage<UserMode>("cercily-user-mode", "QuickThinker");
  const [userMode, setUserModeState] = useState<UserMode>(storedMode);

  // Update local storage when userMode changes
  useEffect(() => {
    setStoredMode(userMode);
  }, [userMode, setStoredMode]);

  const setUserMode = useCallback((mode: UserMode) => {
    setUserModeState(mode);
  }, []);

  const value = { userMode, setUserMode };

  return (
    <UserModeContext.Provider value={value}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}