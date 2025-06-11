
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";
type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // The resolved theme ('light' or 'dark')
  preference: ThemePreference; // The user's selected preference
  setThemePreference: (newPreference: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to get initial preference (runs client-side)
const getInitialPreference = (): ThemePreference => {
  if (typeof window === 'undefined') {
    return 'light'; // Default for SSR, will be corrected by inline script + client hydration
  }
  try {
    const storedPref = localStorage.getItem('theme') as ThemePreference | null;
    if (storedPref && ['light', 'dark', 'system'].includes(storedPref)) {
      return storedPref;
    }
  } catch (e) {
    // Ignore localStorage errors (e.g., in private browsing)
  }
  return 'light'; // Default to 'light' if no valid preference found or 'system' is implicitly default
};

// Helper function to resolve theme based on preference (runs client-side)
const calculateResolvedTheme = (pref: ThemePreference): Theme => {
  if (typeof window === 'undefined') {
    return 'light'; // SSR default
  }
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  // For 'system'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with functions that run on the client during the initial render.
  // This ensures React's state aligns with what the inline script in layout.tsx might have set.
  const [preference, setPreferenceInternal] = useState<ThemePreference>(getInitialPreference);
  const [resolvedTheme, setResolvedThemeInternal] = useState<Theme>(() => calculateResolvedTheme(getInitialPreference()));

  // Effect to apply theme to DOM and handle system changes
  useEffect(() => {
    const currentResolved = calculateResolvedTheme(preference);
    setResolvedThemeInternal(currentResolved); // Update React's understanding of the resolved theme

    // Apply to DOM
    const root = document.documentElement;
    root.classList.remove('light', 'dark'); // Clean slate
    root.classList.add(currentResolved);   // Add the correct one

    // System theme listener
    if (preference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newSystemResolvedTheme = e.matches ? 'dark' : 'light';
        setResolvedThemeInternal(newSystemResolvedTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(newSystemResolvedTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preference]); // Re-run when user preference changes

  const setThemePreference = useCallback((newPref: ThemePreference) => {
    setPreferenceInternal(newPref);
    try {
      localStorage.setItem('theme', newPref);
    } catch (e) {
      // Ignore localStorage errors
    }
    // The useEffect hook will handle applying the change to the DOM and React state.
  }, []);
  
  const contextValue = React.useMemo(() => ({
    theme: resolvedTheme,
    preference,
    setThemePreference,
  }), [resolvedTheme, preference, setThemePreference]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
