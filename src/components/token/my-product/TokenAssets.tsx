import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp ,ChevronRight} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom'
import { BankLogo, BankLogoProps } from '@/components/common/BankLogo'
import { useBankStore } from '@/stores/BankStore'


export default function TokenAssets() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate()
  const { bankTokens, fetchBankTokens } = useBankStore()

  const toggle = (group: string) => {
    setExpanded((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  useEffect(() => {
    if (!bankTokens) {
      fetchBankTokens()
    }
  }, [bankTokens, fetchBankTokens])

  if (!bankTokens) return <div>로딩 중...</div>


  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4">보유 토큰</h3>

      {bankTokens.map((token) => (
        <div key={token.bankTokenName} className="border-t border-b border-gray-200 mb-2">
          <div className="flex items-center justify-between p-4 bg-white">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate(`/token/detail/${token.currency}`)}
            >
              {/*<BankLogo bank={token.currency as BankLogoProps["bank"]} />*/}
              <div>
                <p className="font-medium">{token.bankTokenName}</p>
                <p className="text-xs text-gray-500">{token.currency}</p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => toggle(token.bankTokenName)}
            >
              <p className="text-indigo-600  font-medium">{token.totalBalance} {token.currency}</p>
              {expanded[token.bankTokenName] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>

          {expanded[token.bankTokenName] &&
            token.products.map((product) => (
              <div
                key={product.subscribeId}
                className="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium whitespace-pre">{product.rate}</span>
                  </div>
                  <div>
                    <p className="font-medium">{product.name}</p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 text-right cursor-pointer"
                  onClick={() =>
                    navigate(`/token/product/detail/${product.subscribeId}`, {
                      state: {
                        product,
                        tokenInfo: token,
                      },
                    })
                  }
                >
                  <div className="flex flex-col items-end">
                    <p className="text-blue-600 font-medium">{product.amount} {token.currency}</p>
                    <p className="text-xs text-gray-500">{token.currency}</p>
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
