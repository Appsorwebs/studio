
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme; // This will always be the resolved theme: 'light' or 'dark'
  toggleTheme: () => void;
  setSystemTheme: () => void;
  setTheme: (newTheme: Theme) => void; // Explicitly set to light or dark
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize state based on localStorage or system preference.
    // This runs on the client during initial render *before* effects.
    // It should accurately reflect what the inline script would have set.
    if (typeof window === 'undefined') return 'light'; // SSR default

    const storedUserPreference = localStorage.getItem("theme") as Theme | 'system' | null;
    if (storedUserPreference === "light" || storedUserPreference === "dark") {
      return storedUserPreference; // User has an explicit 'light' or 'dark' preference
    }
    // If storedUserPreference is 'system' or null, derive from actual system setting
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [mounted, setMounted] = useState(false);

  // This effect runs once on client mount to set up listeners and ensure `mounted` is true.
  useEffect(() => {
    setMounted(true);
    // The inline script in layout.tsx handles the very initial class application.
    // This provider's `useState` initializes React's `theme` state to match that.
    // Now, set up listeners for system theme changes.
  }, []);

  const applyThemeChange = useCallback((newTheme: Theme, userPreferenceToStore?: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme); // Update React's resolved theme state ('light' or 'dark')
    
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      if (userPreferenceToStore === 'system') {
        localStorage.removeItem("theme");
      } else if (userPreferenceToStore === 'light' || userPreferenceToStore === 'dark') {
        localStorage.setItem("theme", userPreferenceToStore);
      }
      // If userPreferenceToStore is undefined, it means it's an internal sync, don't change localStorage.
    }
  }, []);

  const setTheme = useCallback((newThemeToSet: Theme) => {
    // User explicitly selects 'light' or 'dark'
    applyThemeChange(newThemeToSet, newThemeToSet);
  }, [applyThemeChange]);

  const toggleTheme = useCallback(() => {
    // Toggles between light and dark, and stores that explicit preference
    const newThemeToApply = theme === "light" ? "dark" : "light";
    setTheme(newThemeToApply);
  }, [theme, setTheme]);

  const setSystemTheme = useCallback(() => {
    // User selects "system"
    if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyThemeChange(prefersDark ? "dark" : "light", 'system');
    }
  }, [applyThemeChange]);

  // Effect for system theme changes
  useEffect(() => {
    if (!mounted) return; // Only run after initial client-side setup

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only react if user preference is 'system' (i.e., no 'light' or 'dark' in localStorage)
      const storedUserPreference = localStorage.getItem("theme");
      if (storedUserPreference !== "light" && storedUserPreference !== "dark") {
        applyThemeChange(e.matches ? "dark" : "light", 'system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    // Initial check in case the system theme changed while the tab was inactive and localStorage indicates system
    const storedUserPreference = localStorage.getItem("theme");
    if (storedUserPreference !== "light" && storedUserPreference !== "dark") {
        const systemIsDark = mediaQuery.matches;
        if (theme !== (systemIsDark ? 'dark' : 'light')) {
            applyThemeChange(systemIsDark ? 'dark' : 'light', 'system');
        }
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, applyThemeChange, theme]);

  const contextValue = React.useMemo(() => ({ theme, toggleTheme, setSystemTheme, setTheme }), [theme, toggleTheme, setSystemTheme, setTheme]);
  
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

