import React from 'react';

const AttendanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 2v4M8 2v4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    <path d="M9 16l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default AttendanceIcon;
