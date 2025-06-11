
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

// This function runs ONLY on the client, after mount
const getInitialClientStates = (): { theme: Theme; preference: ThemePreference } => {
  let storedPreference: ThemePreference = 'light'; // Default preference is light

  try {
    const lsPreference = localStorage.getItem('theme') as ThemePreference | null;
    if (lsPreference === 'light' || lsPreference === 'dark' || lsPreference === 'system') {
      storedPreference = lsPreference;
    } else {
      // If no valid preference or an invalid one, default to 'light' and clear storage
      localStorage.removeItem('theme');
    }
  } catch (e) { /* localStorage access might be restricted */ }

  let resolvedTheme: Theme;
  if (storedPreference === 'dark') {
    resolvedTheme = 'dark';
  } else if (storedPreference === 'light') {
    resolvedTheme = 'light';
  } else { // 'system'
    resolvedTheme = (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  return { theme: resolvedTheme, preference: storedPreference };
};


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with light theme for SSR to match the default expectation.
  // The actual theme will be determined on the client.
  const [preference, setPreferenceInternal] = useState<ThemePreference>('light');
  const [theme, setThemeInternal] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    const { theme: initialTheme, preference: initialPreference } = getInitialClientStates();
    
    setPreferenceInternal(initialPreference);
    setThemeInternal(initialTheme);

    // Ensure DOM class matches the determined initial theme
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
    
    setMounted(true); // Now safe to render children
  }, []);

  useEffect(() => {
    // Handles system theme changes if 'system' preference is selected
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
    if (!mounted) return; // Don't allow changes until mounted and initial theme is set

    setPreferenceInternal(newPreference);
    try { localStorage.setItem('theme', newPreference); } catch(e) {/* ignore */}
    
    let newResolvedTheme: Theme;
    if (newPreference === 'dark') {
      newResolvedTheme = 'dark';
    } else if (newPreference === 'light') {
      newResolvedTheme = 'light';
    } else { // 'system'
      newResolvedTheme = (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    setThemeInternal(newResolvedTheme);
    document.documentElement.classList.remove('light', 'dark'); // Ensure only one class or none
    document.documentElement.classList.add(newResolvedTheme);
  }, [mounted]);
  
  const contextValue = React.useMemo(() => ({
    theme,
    preference,
    setThemePreference,
  }), [theme, preference, setThemePreference]);
  
  // Prevent rendering children until the theme is resolved on the client
  // This is crucial for preventing the flash of incorrectly styled content
  if (!mounted) {
    return null; // Or a global loading spinner, but null is best for theme
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
