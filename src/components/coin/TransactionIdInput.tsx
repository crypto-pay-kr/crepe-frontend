import { ChangeEvent } from 'react'

interface TransactionIdInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TransactionIdInput({ value, onChange }: TransactionIdInputProps) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-lg font-semibold text-gray-700">거래 ID</p>
      <div className="relative">
       <textarea
         value={value}
         data-testid="txid-input"
         onChange={(e) => onChange(e.target.value)}
         placeholder="예:upbit7196e61de85a4dfc94b634e4b7627431241217006284108bc87987e38b"
         className="w-full max-w-[700px] border border-gray-300 rounded-lg py-3 px-4 text-base font-mono resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
         rows={2}
         wrap="soft"
         spellCheck={false}
       />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
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
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}