import { ChangeEvent } from 'react'

interface TransactionIdInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TransactionIdInput({ value, onChange }: TransactionIdInputProps) {
  return (
    <div className="mb-6">
      <p className="text-lg font-semibold mb-3 text-gray-700">거래 ID</p>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          placeholder="예: TNgzwecDR23DDKFodjkfn20d"
          className="w-full border border-gray-300 rounded-lg py-3 px-4 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {value && (
          <button 
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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