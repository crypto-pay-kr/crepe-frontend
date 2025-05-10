import React, { useState } from "react";
import { ChevronDown, ChevronUp ,ChevronRight} from "lucide-react";
import { BankLogo, BankLogoProps } from "../common/BankLogo";
import { useNavigate } from 'react-router-dom'
import { dummyTokenData } from "@/constants/TokenData";


export default function TokenAssets() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate()

  const toggle = (group: string) => {
    setExpanded((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4">보유 토큰</h3>

      {dummyTokenData.map((group) => (
        <div key={group.groupName} className="border-t border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between p-4 bg-white">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/token/detail/${group.bank}`)}
            >
              <BankLogo bank={group.bank} />
              <div>
                <p className="font-medium">{group.groupName}</p>
                <p className="text-xs text-gray-500">KRWT</p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggle(group.groupName)}
            >
              <p className="text-black font-medium">{group.total}</p>
              {expanded[group.groupName] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>

          {expanded[group.groupName] &&
            group.tokens.map((token) => (
              <div
                key={token.code}
                className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium whitespace-pre">{token.rate}</span>
                  </div>
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-xs text-gray-500">{token.code}</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 text-right cursor-pointer"
                  onClick={() => navigate(`/token/product/detail/${token.code}`)}
                >
                  <div className="flex flex-col items-end">
                    <p className="text-blue-600 font-medium">{token.amount}</p>
                    <p className="text-xs text-gray-500">{token.evaluated}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
