import React from "react";

interface CryptoAsset {
  name: string;
  code: string;
  logo: string;
  percentage: number;
  amount: number;
  value: number;
}

interface AssetListProps {
  assets: CryptoAsset[];
}

export default function AssetList({ 
  assets 
}: AssetListProps): React.ReactElement {
  return (
    <div className="flex-1 px-4 pb-4 overflow-auto mt-2">
      {assets.map((asset) => (
        <div key={asset.code} className="bg-white rounded-xl p-4 mb-3 flex items-center">
          <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {asset.code === "XRP" && (
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
            {asset.code === "SOL" && (
              <div className="w-6 h-6 bg-[#9945FF] rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            )}
            {asset.code === "USDT" && (
              <div className="w-6 h-6 bg-[#26A17B] rounded-full flex items-center justify-center text-white text-xs font-bold">
                T
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="w-24"> 
                <p className="font-medium truncate">{asset.name}</p>
                <p className="text-xs text-gray-500">{asset.code}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 text-lg font-medium text-right"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {asset.percentage}%
                </div>
                <div className="text-right w-24">
                  <p className="font-medium text-[#4a6ee0]">
                    {asset.amount} {asset.code}
                  </p>
                  <p className="text-xs text-gray-500">{asset.value.toLocaleString()} KRW</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}