
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";
type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // The resolved theme ('light' or 'dark')
  preference: ThemePreference; // What the user selected ('light', 'dark', or 'system')
  setTheme: (newTheme: "light" | "dark") => void; // Sets an explicit theme preference
  setSystemTheme: () => void; // Sets preference to 'system'
  toggleTheme: () => void; // Toggles between light/dark and sets explicit preference
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to determine initial theme based on inline script logic
const getInitialResolvedTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'; // SSR default
  try {
    const preference = localStorage.getItem('theme') as ThemePreference | null;
    if (preference === 'dark') return 'dark';
    if (preference === 'light') return 'light';
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // Default to light if no valid preference or localStorage is null/empty
    return 'light';
  } catch (e) {
    return 'light'; // Fallback in case of localStorage error
  }
};

// Helper function to determine initial user preference
const getInitialUserPreference = (): ThemePreference => {
  if (typeof window === 'undefined') return 'light'; // Default preference for SSR is now 'light'
  try {
    const preference = localStorage.getItem('theme') as ThemePreference | null;
    if (preference === 'light' || preference === 'dark' || preference === 'system') {
      return preference;
    }
    // Default to 'light' preference if localStorage is null or invalid
    return 'light';
  } catch (e) {
    return 'light'; // Fallback
  }
};


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeInternal] = useState<Theme>(getInitialResolvedTheme);
  const [preference, setPreferenceInternal] = useState<ThemePreference>(getInitialUserPreference);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // This effect synchronizes the DOM with the React 'theme' state.
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  // Listener for system theme changes (only if preference is 'system')
  useEffect(() => {
    if (!mounted || preference !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setThemeInternal(newSystemTheme); // Update resolved theme
      // DOM class update is handled by the effect above watching 'theme'
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, preference]);

  const setTheme = useCallback((newThemeChoice: 'light' | 'dark') => {
    setPreferenceInternal(newThemeChoice); // User explicitly chose light or dark
    setThemeInternal(newThemeChoice);
    try { localStorage.setItem('theme', newThemeChoice); } catch(e){}
  }, []);

  const setSystemTheme = useCallback(() => {
    setPreferenceInternal('system'); // User chose system
    try { localStorage.setItem('theme', 'system'); } catch(e){}
    const newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeInternal(newResolvedTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    // Toggles between light/dark and sets preference explicitly
    const newThemeToApply = theme === 'light' ? 'dark' : 'light';
    setPreferenceInternal(newThemeToApply);
    setThemeInternal(newThemeToApply);
    try { localStorage.setItem('theme', newThemeToApply); } catch(e){}
  }, [theme]);
  
  const contextValue = React.useMemo(() => ({
    theme,
    preference,
    setTheme,
    setSystemTheme,
    toggleTheme
  }), [theme, preference, setTheme, setSystemTheme, toggleTheme]);
  
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
