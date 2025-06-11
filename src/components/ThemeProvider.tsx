
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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with a default that matches the :root CSS variables (light theme)
  // The inline script in layout.tsx handles the very first paint.
  // This useEffect will then sync React state and ensure consistency on the client.
  const [themeState, setThemeState] = useState<{ currentTheme: Theme; currentPreference: ThemePreference }>({
    currentTheme: 'light', // Default to light, inline script overrides initial paint
    currentPreference: 'system',
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let storedPreference = localStorage.getItem("theme") as ThemePreference | null;
    let resolvedTheme: Theme;
    let resolvedPreference: ThemePreference;

    if (storedPreference === "light" || storedPreference === "dark") {
      resolvedTheme = storedPreference;
      resolvedPreference = storedPreference;
    } else { // 'system' or null (no preference means system)
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      resolvedTheme = systemPrefersDark ? "dark" : "light";
      resolvedPreference = 'system'; // If localStorage was null, it implies system preference.
                                     // If it was 'system', it's explicitly system.
    }
    
    setThemeState({ currentTheme: resolvedTheme, currentPreference: resolvedPreference });
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);

  }, []); // Run once on mount

  // Listener for system theme changes
  useEffect(() => {
    if (!mounted || themeState.currentPreference !== 'system') {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if preference is still 'system' (user hasn't explicitly changed it)
      if (localStorage.getItem("theme") !== "light" && localStorage.getItem("theme") !== "dark") {
        const newSystemTheme = e.matches ? "dark" : "light";
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
    updateThemeDOMAndStorage(newThemeToApply, newThemeToApply);
  }, [themeState.currentTheme, updateThemeDOMAndStorage]);

  const contextValue = React.useMemo(() => ({
    theme: themeState.currentTheme,
    preference: themeState.currentPreference,
    setTheme,
    setSystemTheme,
    toggleTheme
  }), [themeState.currentTheme, themeState.currentPreference, setTheme, setSystemTheme, toggleTheme]);
  
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
