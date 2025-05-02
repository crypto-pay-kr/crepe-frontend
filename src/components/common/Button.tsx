import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: "blue" | "gray" | "primary";
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  text,
  onClick,
  color = "blue",
  className = "",
  disabled = false,
  fullWidth = true
}: ButtonProps) {
  // 색상 클래스 매핑
  const colorClasses = {
    blue: "bg-[#0C2B5F] text-white",
    gray: "bg-gray-400 text-white",
    primary: "bg-[#0a2e64] text-white"
  };

  return (
    <button
      className={`
        ${colorClasses[color]}
        py-3
        text-lg
        font-medium
        rounded-lg
        shadow-md
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}