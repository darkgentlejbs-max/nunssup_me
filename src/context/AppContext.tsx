import React from 'react';
import { useAppStore } from '../store/useAppStore';

// Re-export AppStore type for components that might need it
export type { AppStore } from '../store/useAppStore';

/**
 * @deprecated Use `useAppStore` directly instead for better render performance.
 * This remains for backward compatibility.
 */
export const useApp = () => {
  return useAppStore();
};

/**
 * @deprecated The app now uses Zustand which doesn't require a Context Provider.
 * This component is kept to prevent breaking changes in `main.tsx` or `App.tsx`
 * during the migration phase.
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
