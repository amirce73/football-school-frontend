import React from 'react';

const TalentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path d="M6 3h12l4 6-10 12L2 9l4-6z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 9h20M12 21V9M6 3l2 6M18 3l-2 6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
  </svg>
);

export default TalentIcon;
