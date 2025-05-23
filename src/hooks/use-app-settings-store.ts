
"use client";

import { useState, useEffect, useCallback } from 'react';

const LOCAL_NOTIFICATIONS_KEY = 'guardian_angel_local_notifications_enabled';

type AppSettingsStore = {
  localNotificationsEnabled: boolean;
  toggleLocalNotifications: () => void;
  isInitialized: boolean;
};

export function useAppSettingsStore(): AppSettingsStore {
  const [localNotificationsEnabled, setLocalNotificationsEnabledState] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(LOCAL_NOTIFICATIONS_KEY);
      if (storedValue !== null) {
        setLocalNotificationsEnabledState(storedValue === 'true');
      }
      setIsInitialized(true);
    }
  }, []);

  const toggleLocalNotifications = useCallback(() => {
    setLocalNotificationsEnabledState(prevEnabled => {
      const newEnabled = !prevEnabled;
      localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, newEnabled.toString());
      return newEnabled;
    });
  }, []);

  return {
    localNotificationsEnabled: isInitialized ? localNotificationsEnabled : true,
    toggleLocalNotifications,
    isInitialized,
  };
}
