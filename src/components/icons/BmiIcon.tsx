import React from 'react';

const BmiIcon = ({ color = 'currentColor', ...props }: React.SVGProps<SVGSVGElement> & { color?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g transform="translate(0, -3)">
      <path d="M4 18a8 8 0 0 1 16 0" stroke="#E2E8F0" strokeWidth="4" strokeLinecap="round" />
      <path d="M4 18 A 8 8 0 0 1 6.34 12.34" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
      <path d="M6.34 12.34 A 8 8 0 0 1 12 10" stroke="#22c55e" strokeWidth="4" />
      <path d="M12 10 A 8 8 0 0 1 17.66 12.34" stroke="#eab308" strokeWidth="4" />
      <path d="M17.66 12.34 A 8 8 0 0 1 20 18" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      <circle cx="12" cy="18" r="2.5" fill={color} />
      <path d="M12 18 L 10 11.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default BmiIcon;
