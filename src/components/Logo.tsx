import * as React from "react";

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="200"
    height="200"
    viewBox="0 0 803 768"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M100 200 Q400 40 703 200 L703 500 Q703 700 400 760 Q100 700 100 500 Z"
      stroke="black"
      strokeWidth="40"
      fill="none"
    />
    <path
      d="M703 200 L703 500 Q703 700 400 760 Q100 700 100 500 L100 200"
      stroke="black"
      strokeWidth="40"
      fill="none"
    />
    <circle
      cx="630"
      cy="320"
      r="60"
      stroke="black"
      strokeWidth="40"
      fill="none"
    />
    <rect
      x="570"
      y="260"
      width="120"
      height="120"
      rx="30"
      stroke="black"
      strokeWidth="40"
      fill="none"
    />
  </svg>
);
