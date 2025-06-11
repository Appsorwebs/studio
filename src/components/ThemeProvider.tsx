
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark"; // Represents the resolved theme
type ThemePreference = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  setTheme: (newTheme: "light" | "dark") => void;
  setSystemTheme: () => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This function needs to run *only on the client* to determine initial state.
const getClientSideInitialState = (): { currentTheme: Theme; currentPreference: ThemePreference } => {
  // If called on server (e.g. during SSR for initial useState value), return a default.
  // This default should align with your non-JS fallback or initial CSS (usually light).
  if (typeof window === 'undefined') {
    return { currentTheme: 'light', currentPreference: 'system' }; 
  }

  const storedPreference = localStorage.getItem("theme") as ThemePreference | null;

  if (storedPreference === "light" || storedPreference === "dark") {
    return { currentTheme: storedPreference, currentPreference: storedPreference };
  }
  
  // System preference or no preference stored (localStorage might have 'system' or be null)
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return { 
    currentTheme: systemPrefersDark ? "dark" : "light", 
    currentPreference: storedPreference === 'system' ? 'system' : 'system' 
  };
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state using a function that runs client-side for the initial value.
  const [themeState, setThemeState] = useState(() => getClientSideInitialState());
  const [mounted, setMounted] = useState(false);

  // Effect to mark as mounted and sync DOM class on initial client render.
  // This also ensures the DOM class matches React state if inline script might have issues or wasn't present.
  useEffect(() => {
    setMounted(true);
    // Re-evaluate on actual mount to ensure consistency, though useState initializer should be good.
    const { currentTheme: initialDomTheme } = getClientSideInitialState(); 
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialDomTheme);
    
    // If React's state is somehow different from what it should be on mount, sync it.
    if (themeState.currentTheme !== initialDomTheme) {
        setThemeState(getClientSideInitialState());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Listener for system theme changes
  useEffect(() => {
    if (!mounted || themeState.currentPreference !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      // Only update if preference is still 'system'
      if (localStorage.getItem("theme") !== "light" && localStorage.getItem("theme") !== "dark") {
        setThemeState({ currentTheme: newSystemTheme, currentPreference: 'system' });
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newSystemTheme);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, themeState.currentPreference]);

  const updateThemeDOMAndStorage = useCallback((newResolvedTheme: Theme, newPreference: ThemePreference) => {
    setThemeState({ currentTheme: newResolvedTheme, currentPreference: newPreference });
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newResolvedTheme);

    if (newPreference === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newPreference);
    }
  }, []);

  const setTheme = useCallback((newThemeChoice: "light" | "dark") => {
    updateThemeDOMAndStorage(newThemeChoice, newThemeChoice);
  }, [updateThemeDOMAndStorage]);

  const setSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined') {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      updateThemeDOMAndStorage(systemPrefersDark ? 'dark' : 'light', 'system');
    }
  }, [updateThemeDOMAndStorage]);

  const toggleTheme = useCallback(() => {
    const newThemeToApply = themeState.currentTheme === 'light' ? 'dark' : 'light';
    updateThemeDOMAndStorage(newThemeToApply, newThemeToApply); // When toggling, it becomes an explicit choice
  }, [themeState.currentTheme, updateThemeDOMAndStorage]);

  const contextValue = React.useMemo(() => ({
    theme: themeState.currentTheme,
    preference: themeState.currentPreference,
    setTheme,
    setSystemTheme,
    toggleTheme
  }), [themeState.currentTheme, themeState.currentPreference, setTheme, setSystemTheme, toggleTheme]);
  
  // The `SetInitialTheme` script in `layout.tsx` should handle the "no-flash" initial paint.
  // This provider then syncs React state.
  // `suppressHydrationWarning` on `<html>` and `<body>` helps React handle initial class mismatches.
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
