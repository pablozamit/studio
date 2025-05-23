
"use client";

import { useState, useEffect, useCallback } from 'react';

const GUARDIAN_EMAIL_KEY = 'guardian_angel_guardian_email';
const BLOCKED_ATTEMPTS_KEY = 'guardian_angel_blocked_attempts';

type GuardianStore = {
  guardianEmail: string | null;
  isGuardianSet: boolean;
  blockedAttempts: number;
  setGuardianEmail: (email: string) => void;
  incrementBlockedAttempts: () => void;
  clearGuardianData: () => void; // For testing or reset
};

export function useGuardianStore(): GuardianStore {
  const [guardianEmail, setGuardianEmailState] = useState<string | null>(null);
  const [blockedAttempts, setBlockedAttemptsState] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem(GUARDIAN_EMAIL_KEY);
      const storedAttempts = localStorage.getItem(BLOCKED_ATTEMPTS_KEY);
      
      if (storedEmail) {
        setGuardianEmailState(storedEmail);
      }
      if (storedAttempts) {
        setBlockedAttemptsState(parseInt(storedAttempts, 10));
      }
      setIsInitialized(true);
    }
  }, []);

  const setGuardianEmail = useCallback((email: string) => {
    localStorage.setItem(GUARDIAN_EMAIL_KEY, email);
    setGuardianEmailState(email);
  }, []);

  const incrementBlockedAttempts = useCallback(() => {
    setBlockedAttemptsState(prevAttempts => {
      const newAttempts = prevAttempts + 1;
      localStorage.setItem(BLOCKED_ATTEMPTS_KEY, newAttempts.toString());
      return newAttempts;
    });
  }, []);

  const clearGuardianData = useCallback(() => {
    localStorage.removeItem(GUARDIAN_EMAIL_KEY);
    localStorage.removeItem(BLOCKED_ATTEMPTS_KEY);
    setGuardianEmailState(null);
    setBlockedAttemptsState(0);
  }, []);

  return {
    guardianEmail,
    isGuardianSet: !!guardianEmail && isInitialized,
    blockedAttempts: isInitialized ? blockedAttempts : 0,
    setGuardianEmail,
    incrementBlockedAttempts,
    clearGuardianData,
  };
}
