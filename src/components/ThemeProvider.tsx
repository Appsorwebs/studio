
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";
type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme; 
  preference: ThemePreference; 
  setTheme: (newTheme: "light" | "dark") => void; 
  setSystemTheme: () => void; 
  toggleTheme: () => void; 
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialResolvedTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'; // SSR default
  try {
    const storedPreference = localStorage.getItem('theme') as ThemePreference | null;
    if (storedPreference === 'dark') return 'dark';
    if (storedPreference === 'light') return 'light';
    if (storedPreference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    // If localStorage is null, undefined, or any other invalid value, default to 'light'
    return 'light';
  } catch (e) {
    return 'light'; // Fallback in case of localStorage error
  }
};

const getInitialUserPreference = (): ThemePreference => {
  if (typeof window === 'undefined') return 'light'; // SSR default
  try {
    const storedPreference = localStorage.getItem('theme') as ThemePreference | null;
    // Check for valid stored preferences
    if (storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system') {
      return storedPreference;
    }
    // If localStorage is null, undefined, or any other invalid value, default preference to 'light'
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
    if (mounted) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted || preference !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setThemeInternal(newSystemTheme); 
    };
    mediaQuery.addEventListener('change', handleChange);
    // Set initial theme based on system if preference is 'system' on mount
    if (preference === 'system') {
        setThemeInternal(mediaQuery.matches ? 'dark' : 'light');
    }
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, preference]);

  const setTheme = useCallback((newThemeChoice: 'light' | 'dark') => {
    setPreferenceInternal(newThemeChoice); 
    setThemeInternal(newThemeChoice);
    try { localStorage.setItem('theme', newThemeChoice); } catch(e){}
  }, []);

  const setSystemTheme = useCallback(() => {
    setPreferenceInternal('system'); 
    try { localStorage.setItem('theme', 'system'); } catch(e){}
    // Check and apply system theme immediately upon choosing 'system'
    if (typeof window !== 'undefined') {
        const newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setThemeInternal(newResolvedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
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

