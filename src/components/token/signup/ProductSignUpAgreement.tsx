import React from "react";

interface ProductSignUpAgreementProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

export default function ProductSignUpAgreement({ label, checked, onToggle }: ProductSignUpAgreementProps) {
  return (
    <div onClick={onToggle} className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
      <div className="flex items-center">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
            checked ? "bg-[#4B5EED]" : "border border-gray-300"
          }`}
        >
          {checked && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12L10 17L19 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div>{label}</div>
      </div>
      <div>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="#999"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}