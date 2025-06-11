
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get the initial theme based on localStorage or system preference
// This function is designed to be safe to call on both server and client.
// On the server, or if localStorage is unavailable, it defaults to "light".
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
      return storedTheme;
    }
    // Check system preference if no theme is stored or stored theme is invalid
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "light"; // Default theme
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme); // Update React state
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem("theme", newTheme); // Persist to localStorage
      // Update class on <html> element
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  useEffect(() => {
    setMounted(true);

    // Sync HTML class with the initial theme state (which should be correct on client)
    // This ensures the class is set immediately on client mount
    if (typeof window !== 'undefined') {
        const currentDomThemeIsDark = document.documentElement.classList.contains('dark');
        if (theme === 'dark' && !currentDomThemeIsDark) {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light' && currentDomThemeIsDark) {
            document.documentElement.classList.remove('dark');
        }
    }

    // Listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if no theme is stored in localStorage (respect user override)
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]); // Rerun if theme state changes or applyTheme reference changes

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  }, [theme, applyTheme]);

  const setSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        applyTheme(prefersDark ? "dark" : "light");
    }
  }, [applyTheme]);

  // The `suppressHydrationWarning` on <html> in RootLayout helps if the server sends
  // a different class than what the client initially sets.
  // The key is that `getInitialTheme` runs before the first client render for `useState`.
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
