import React from "react";

export const Hamberger = ({collapsed} : any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      {collapsed ? (
        // Arrow right (expand)
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      ) : (
        // Arrow left (collapse)
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      )}
    </svg>
  );
};
