import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    width="120"
    height="30"
    aria-label="Rxpiration Alert Logo"
    {...props}
  >
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="200" height="50" fill="transparent" />
    {/* Rx part */}
    <text
      x="10"
      y="38"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="32"
      fontWeight="bold"
      fill="url(#logoGradient)"
    >
      Rx
    </text>
    {/* piration part */}
    <text
      x="58"
      y="38"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="32"
      fontWeight="normal"
      className="fill-foreground"
    >
      piration
    </text>
    {/* Alert part (stylized) */}
    <text
      x="158"
      y="38"
      fontFamily="Space Grotesk, sans-serif"
      fontSize="32"
      fontWeight="bold"
      className="fill-destructive"
    >
      !
    </text>
    {/* Subtle pill shape or line */}
    <path d="M50 15 Q 55 10, 60 15 T 70 15" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" opacity="0.7" />
  </svg>
);

export default Logo;
