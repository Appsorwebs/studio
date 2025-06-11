
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Rxpiration Alert',
  description: 'PharmaDrug Expiration Listing System',
};

const SetInitialTheme = () => {
  const scriptContent = `
    (function() {
      function getInitialTheme() {
        try {
          const storedTheme = localStorage.getItem('theme');
          if (storedTheme === 'dark' || storedTheme === 'light') {
            return storedTheme;
          }
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
          }
        } catch (e) {
          // If localStorage or matchMedia is not available, or an error occurs
        }
        return 'light'; // Default theme
      }
      const theme = getInitialTheme();
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
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
