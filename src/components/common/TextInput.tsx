import CheckCircle from "./CheckCircle"

interface InputProps {
  name: string
  label?: string // label을 선택적으로 변경
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  isValid?: boolean
  showValidation?: boolean
  showPassword?: boolean
  togglePasswordVisibility?: () => void
  className?: string // className 추가
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  isValid,
  showValidation = false,
  showPassword,
  togglePasswordVisibility,
  className, // className 추가
}: InputProps) {
  return (
    <div className="mb-4">
      {label && <div className="text-sm text-gray-500 mb-1">{label}</div>}
      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500 ${className}`} // className 적용
        />
        {showValidation && (
          <div className="absolute right-8 top-2">
            <CheckCircle checked={!!isValid} />
          </div>
        )}
        {type === "password" && (
          <button type="button" onClick={togglePasswordVisibility} className="absolute right-0 top-2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {showPassword ? (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              ) : (
                <>
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" x2="22" y1="2" y2="22" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}