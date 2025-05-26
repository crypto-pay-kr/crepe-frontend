import React from "react";

interface AssetIconProps {
  code: string;
}

export default function AssetIcon({ code }: AssetIconProps): React.ReactElement {
  return (
    <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
      {code === "XRP" && (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.6 5L14.7 10.7C13.4 12.3 11.2 12.3 9.9 10.7L5 5M5 19L9.9 13.3C11.2 11.7 13.4 11.7 14.7 13.3L19.6 19"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {code === "SOL" && (
        <div className="w-6 h-6 bg-[#9945FF] rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      )}
      {code === "USDT" && (
        <div className="w-6 h-6 bg-[#26A17B] rounded-full flex items-center justify-center text-white text-xs font-bold">
          T
        </div>
      )}
    </div>
  );
}