'use client';

import { createContext, useContext, useEffect } from 'react';

import { type Analytics } from '../types';

const AnalyticsContext = createContext<Analytics | null>(null);

interface AnalyticsProviderProps {
  analytics: Analytics | null;
  children: React.ReactNode;
}

export const AnalyticsProvider = ({ children, analytics }: AnalyticsProviderProps) => {
  useEffect(() => {
    analytics?.initialize();
  }, [analytics]);

  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>;
};

export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
