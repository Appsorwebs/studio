import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

const SpinnerLogo = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100" // Square viewBox for easier spinning
    width="60" // Adjust size as needed
    height="60"
    aria-label="Loading Rxpiration Alert"
    className={cn("animate-spin-slow", className)}
    {...props}
  >
    <defs>
      <linearGradient id="spinnerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Outer circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
    {/* Path based on Rx or simplified logo element */}
    <path 
      d="M30 35 L45 50 M45 35 L30 50 M55 35 Q62.5 35 62.5 42.5 T55 50 Q50 50 50 42.5 T55 35" 
      stroke="url(#spinnerLogoGradient)" 
      strokeWidth="8" 
      strokeLinecap="round"
      fill="none"
    />
    {/* Small dot for 'alert' */}
    <circle cx="70" cy="68" r="5" fill="hsl(var(--destructive))" />
  </svg>
);

export default SpinnerLogo;
