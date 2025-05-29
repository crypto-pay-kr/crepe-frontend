"use client"

const COLORS = {
  checkedBorder: "#4B5EED",
  checkedText: "#4B5EED",
  uncheckedBorder: "gray-300",
  uncheckedText: "transparent",
}

interface CheckCircleProps {
  checked: boolean
  onClick?: () => void
}

export default function CheckCircle({ checked, onClick }: CheckCircleProps) {
  return (
    <div
      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
        checked
          ? `border-[${COLORS.checkedBorder}] text-[${COLORS.checkedText}]`
          : `border-${COLORS.uncheckedBorder} text-${COLORS.uncheckedText}`
      }`}
      onClick={onClick}
    >
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      )}
    </div>
  )
}
