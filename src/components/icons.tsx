import type * as React from "react"

export const Brain = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 3v4a2 2 0 0 0 2 2h4" />
    <path d="M9 3v4a2 2 0 0 1-2 2H3" />
    <path d="M16 17a2 2 0 0 0 2-2v-4h-4" />
    <path d="M8 17a2 2 0 0 1-2-2v-4h4" />
    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
    <path d="M12 9v12" />
  </svg>
)

