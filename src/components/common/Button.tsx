"use client"

import { COLORS } from "../../constants/colors"

interface ButtonProps {
  text?: string;
  onClick: () => void
  color?: "blue" | "gray"
  className?: string
  disabled?: boolean;
  children?: React.ReactNode
}

export default function Button({ text, onClick,  children, color = "blue", className = "" }: ButtonProps) {

  return (
    <button
      className={`w-full py-4 rounded-[9px] font-medium bg-[#0C2B5F] text-white ${className}`}
      onClick={onClick}
    >
      {children ?? text}
    </button>
  )
}
