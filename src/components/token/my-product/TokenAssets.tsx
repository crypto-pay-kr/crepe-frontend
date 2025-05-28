import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp ,ChevronRight} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom'
import {Token} from '@/types/token';


export default function TokenAssets({tokens, onClick}: { tokens:Token[], onClick: (symbol: string) => void }) {
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
      <h3 className="mb-4 text-lg font-bold text-gray-800">보유 토큰</h3>

      {tokens.map(token => (
        <div key={token.currency}>
          <div className="flex items-center justify-between bg-white p-4">
            <div
              className="flex cursor-pointer items-center gap-3"
              onClick={() => navigate(`/token/detail/${token.currency}`)}
            >
              <img
                src={token.bankImageUrl}
                alt={token.name}
                className="h-6 w-6 rounded-full"
              />
              <div>
                <p className="font-medium">{token.name}</p>
                <p className="text-xs text-gray-500">{token.currency}</p>
              </div>
            </div>
            <div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => toggle(token.currency)}
            >
              {/* 오른쪽 가운데: 수량 + krw 세로 묶음 */}
              <div className="flex flex-col items-end">
                <p className="text-sm font-medium text-gray-900">
                  {token.balance.toLocaleString()} {token.currency}
                </p>
                <p className="text-sm text-gray-500">{token.krw}{""}</p>
              </div>

              {/* 오른쪽 끝: 아이콘 */}
              <div>
                {expanded[token.currency] ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronUp size={16} className="text-gray-500" />
                )}
              </div>
            </div>
          </div>

          {expanded[token.currency] &&
            token.product?.map(products => (
              <div
                key={products.subscribeId}
                onClick={() =>
                  navigate(`/token/product/detail/${products.subscribeId}`, {
                    state: {
                      products,
                      tokenInfo: token,
                    },
                  })
                }
                className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    {products.imageUrl ? (
                      <img src={products.imageUrl} alt={products.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="whitespace-pre text-xs font-medium">?</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{products.name}</p>
                  </div>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-2 text-right"
                >
                  <div className="flex flex-col items-end">
                    <p className="text-blue-600 font-medium">
                      {products.balance}
                    </p>
                    <p className="text-xs text-gray-500">{token.currency}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
