import CheckCircle from "./CheckCircle"
interface InputProps {
  label: string | React.ReactNode;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void; // Add onBlur property
  placeholder?: string;
  isValid?: boolean;
  showValidation?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  disabled?: boolean; // Add disabled property
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  onBlur, // Add onBlur handler
  placeholder = "",
  isValid,
  showValidation = false,
  showPassword,
  togglePasswordVisibility,
  disabled = false, // Add disabled property
}: InputProps) {
  return (
    <div className="mb-4">
      <div className={`text-sm mb-1 ${disabled ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </div>
      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // Pass onBlur handler
          placeholder={placeholder}
          disabled={disabled} // Pass disabled property
          className={`w-full border-b py-2 focus:outline-none transition-colors ${
            disabled 
              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed placeholder-gray-300" 
              : "border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400"
          }`}
        />
        {showValidation && (
          <div className="absolute right-8 top-2">
            <CheckCircle checked={!!isValid} />
          </div>
        )}
        {type === "password" && (
          <button 
            type="button" 
            onClick={togglePasswordVisibility} 
            disabled={disabled}
            className={`absolute right-0 top-2 transition-colors ${
              disabled 
                ? "text-gray-300 cursor-not-allowed" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
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
  );
}