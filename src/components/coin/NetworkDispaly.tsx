import React from "react";

interface NetworkDisplayProps {
  networkName: string;
}

export default function NetworkDisplay({ networkName }: NetworkDisplayProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-6 border border-blue-100">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-4 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">코인 종류  : {networkName}</h2>
        </div>
      </div>
    </div>
  );
}