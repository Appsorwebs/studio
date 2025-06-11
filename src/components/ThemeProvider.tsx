
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This function determines the theme based on localStorage or system preference.
// It's used for the initial React state and by the inline script in layout.tsx.
const getStoredOrSystemTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      return storedTheme;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light"; // Default theme
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize theme state for React. The inline script in layout.tsx handles the initial DOM class.
  const [theme, setThemeState] = useState<Theme>(getStoredOrSystemTheme);
  const [mounted, setMounted] = useState(false);

  // This effect runs once on client mount.
  // It ensures React's theme state is synchronized with the DOM class (set by inline script)
  // and that localStorage is consistent.
  useEffect(() => {
    setMounted(true);
    
    // Determine the theme that *should* be active based on storage/system pref
    // (This logic mirrors the inline script)
    const intendedTheme = getStoredOrSystemTheme();
    
    // Sync React's state with this intended theme
    setThemeState(intendedTheme);

    // Ensure the DOM class matches this intended theme.
    // The inline script should have done this, but this is a safeguard.
    if (intendedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []); // Empty dependency array: runs only once on mount.

  // Function to apply theme changes (called by toggleTheme, setSystemTheme)
  const applyThemeChange = useCallback((newTheme: Theme) => {
    setThemeState(newTheme); // Update React state
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme); // Persist to localStorage
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    // Read current theme from React state for toggling
    const newThemeToApply = theme === "light" ? "dark" : "light";
    applyThemeChange(newThemeToApply);
  }, [theme, applyThemeChange]);

  const setSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem("theme"); // Clear user override
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyThemeChange(prefersDark ? "dark" : "light");
    }
  }, [applyThemeChange]);

  // Effect for system theme changes (e.g., OS theme changes)
  // Runs after initial mount and setup.
  useEffect(() => {
    if (!mounted) return; // Only run after initial client-side setup is complete

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if no theme is explicitly stored in localStorage (respects user override)
      if (!localStorage.getItem("theme")) {
        applyThemeChange(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, applyThemeChange]);

  const contextValue = React.useMemo(() => ({ theme, toggleTheme, setSystemTheme }), [theme, toggleTheme, setSystemTheme]);

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
