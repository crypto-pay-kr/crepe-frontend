interface CheckCircleProps {
  checked: boolean
}

export function CheckCircle({ checked }: CheckCircleProps) {
  return (
    <div
      className={`w-6 h-6 rounded-full border flex items-center justify-center ${checked ? "border-[#0a2158] text-[#0a2158]" : "border-gray-300 text-transparent"}`}
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
