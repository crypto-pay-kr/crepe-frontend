import React from "react";
import { Copy } from "lucide-react";

interface DepositAddressProps {
  address?: string;
  tag?: string;
  copied: boolean;
  onCopy: (text:string) => void;
}

export default function DepositAddress({
  address, 
  tag,
  copied,
  onCopy
}: DepositAddressProps) {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-md">
      <p className="mb-3 text-base font-bold text-gray-800">입금할 주소</p>
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
        <span className="text-blue-600 mr-2 break-all font-mono text-sm font-medium">
          {address}
        </span>
        <button
          onClick={() => onCopy(address!)}
          className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
        >
          <Copy size={18} />
        </button>
      </div>
      {tag && (
        <>
          <p className="mb-3 text-base font-bold text-gray-800 mt-3">태그 주소</p>
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
      <span className="text-blue-600 mr-2 break-all font-mono text-sm font-medium">
        {tag}
      </span>
            <button
              onClick={() => onCopy(tag)}
              className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200"
            >
              <Copy size={18} />
            </button>
          </div>
        </>
      )}
      {copied && (
        <div className="mt-2 flex items-center text-sm text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-1 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          주소가 복사되었습니다
        </div>
      )}
    </div>
  )
      }