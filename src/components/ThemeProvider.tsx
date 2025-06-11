
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";
type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; // The resolved theme ('light' or 'dark')
  preference: ThemePreference; // The user's selected preference ('light', 'dark', 'system')
  setThemePreference: (newPreference: ThemePreference) => void;
  toggleTheme: () => void; // Kept for convenience, switches between light/dark
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get initial user preference from localStorage, defaulting to 'light'
const getInitialUserPreference = (): ThemePreference => {
  if (typeof window === 'undefined') return 'light';
  try {
    const storedPreference = localStorage.getItem('theme') as ThemePreference | null;
    if (storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system') {
      return storedPreference;
    }
    return 'light'; // Default to 'light' if nothing valid is stored
  } catch (e) {
    return 'light';
  }
};

// Function to get initial resolved theme based on preference
const getInitialResolvedTheme = (preference: ThemePreference): Theme => {
  if (typeof window === 'undefined') return 'light';
  if (preference === 'dark') return 'dark';
  if (preference === 'light') return 'light';
  // preference is 'system'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state *after* ensuring window is defined for localStorage/matchMedia access
  const [preference, setPreferenceInternal] = useState<ThemePreference>('light');
  const [theme, setThemeInternal] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after mount
    const initialPreference = getInitialUserPreference();
    const initialResolvedTheme = getInitialResolvedTheme(initialPreference);

    setPreferenceInternal(initialPreference);
    setThemeInternal(initialResolvedTheme);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialResolvedTheme);
    
    setMounted(true); // Children can now be rendered
  }, []);


  useEffect(() => {
    // This effect handles changes to system theme if 'system' preference is selected
    if (!mounted || preference !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemResolvedTheme = e.matches ? 'dark' : 'light';
      setThemeInternal(newSystemResolvedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newSystemResolvedTheme);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, preference]);


  const setThemePreference = useCallback((newPreference: ThemePreference) => {
    setPreferenceInternal(newPreference);
    try { localStorage.setItem('theme', newPreference); } catch(e) {}
    
    let newResolvedTheme: Theme;
    if (newPreference === 'dark') {
      newResolvedTheme = 'dark';
    } else if (newPreference === 'light') {
      newResolvedTheme = 'light';
    } else { // 'system'
      newResolvedTheme = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setThemeInternal(newResolvedTheme);
    
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newResolvedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    // Toggles between explicit light and dark, updating preference
    const newThemeToApply = theme === 'light' ? 'dark' : 'light';
    setThemePreference(newThemeToApply);
  }, [theme, setThemePreference]);
  
  const contextValue = React.useMemo(() => ({
    theme,
    preference,
    setThemePreference,
    toggleTheme
  }), [theme, preference, setThemePreference, toggleTheme]);
  
  // Delay rendering children until the theme is resolved on the client
  // This is crucial to prevent content flashing with the wrong theme
  if (!mounted) {
    return null;
  }
  
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
