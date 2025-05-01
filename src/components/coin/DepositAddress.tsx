import React from "react";
import { Copy } from "lucide-react";

interface DepositAddressProps {
  address: string;
  copied: boolean;
  onCopy: () => void;
}

export default function DepositAddress({ 
  address, 
  copied, 
  onCopy 
}: DepositAddressProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-6 border border-gray-100">
      <p className="text-base font-bold mb-3 text-gray-800">입금할 주소</p>
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
        <span className="text-blue-600 font-mono font-medium text-sm break-all mr-2">{address}</span>
        <button 
          onClick={onCopy} 
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
        >
          <Copy size={18} />
        </button>
      </div>
      {copied && (
        <div className="flex items-center mt-2 text-green-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          주소가 복사되었습니다
        </div>
      )}
    </div>
  );
}