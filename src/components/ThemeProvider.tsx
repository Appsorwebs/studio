
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light"); // Default to light for SSR and initial client render
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme); // Update React state first
    // DOM manipulations should only occur client-side
    if (typeof window !== 'undefined') {
      localStorage.setItem("theme", newTheme);
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);
  
  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    setMounted(true);
  }, []);

  useEffect(() => {
    // This effect determines and applies the initial theme once mounted.
    if (!mounted) {
      return; 
    }

    const storedTheme = localStorage.getItem("theme") as Theme | null;
    let newTheme: Theme;

    if (storedTheme) {
      newTheme = storedTheme;
    } else {
      // Ensure window.matchMedia is only called client-side (implicitly via mounted check)
      newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    
    // Only call applyTheme if the determined theme is different from the current state.
    // This avoids an unnecessary update if the initial 'light' was already correct.
    if (newTheme !== theme) {
        applyTheme(newTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if no theme is stored in localStorage (respect user override)
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, applyTheme, theme]); // `theme` is included as it's read in `if (newTheme !== theme)`


  const toggleTheme = () => {
    if (!mounted) return; // Avoid action if not mounted
    applyTheme(theme === "light" ? "dark" : "light");
  };

  const setSystemTheme = () => {
    if (!mounted) return; // Avoid action if not mounted
    // Ensure localStorage is only accessed client-side
    if (typeof window !== 'undefined') {
        localStorage.removeItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSystemTheme }}>
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
