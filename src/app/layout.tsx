
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Rxpiration Alert',
  description: 'PharmaDrug Expiration Listing System',
};

// This script runs before React hydrates, attempting to set the theme ASAP
// to minimize flashing. It prioritizes 'light' as the default.
const SetInitialTheme = () => {
  const scriptContent = `
    (function() {
      var d=document.documentElement,c=d.classList;
      var themePreference;
      try { themePreference = localStorage.getItem('theme'); } catch(e) {}

      if (themePreference === 'dark') {
        c.add('dark');
      } else if (themePreference === 'light') {
        c.remove('dark');
      } else { // 'system' or null/undefined/invalid
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          c.add('dark');
        } else {
          c.remove('dark'); // Default to light
        }
      }
    })();
  `;
  return <Script id="theme-setter" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: scriptContent }} />;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SetInitialTheme />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
