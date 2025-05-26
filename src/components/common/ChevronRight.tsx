import React from 'react';

interface ChevronRightProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

export default function ChevronRight({ 
  className = "text-gray-400", 
  width = 20, 
  height = 20,
  stroke = "currentColor"
}: ChevronRightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18l6-6-6-6"></path>
    </svg>
  )
}