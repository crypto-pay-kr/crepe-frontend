import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp ,ChevronRight} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom'
import { useBankStore } from '@/stores/BankStore'
import { Product } from '@/types/store'

export interface BankProduct{
  subId: string
  name: string
  balance:number
}


export interface Token {
  bankImageUrl: string;
  currency: string;
  name: string;
  balance: number;
  product: BankProduct[] ;
}

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
        <div
          key={token.currency}
          className="mb-2 border-b border-t border-gray-200"
        >
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
              <p className="font-medium text-indigo-600">
                {token.balance} {token.currency}
              </p>
              {expanded[token.currency] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </div>
          </div>

          {expanded[token.name] &&
            token.product?.map(products => (
              <div
                key={products.subId}
                className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <span className="whitespace-pre text-xs font-medium">
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{products.name}</p>
                  </div>
                </div>
                <div
                  className="flex cursor-pointer items-center gap-2 text-right"
                  onClick={() =>
                    navigate(`/token/product/detail/${products.subId}`, {
                      state: {
                        products,
                        tokenInfo: token,
                      },
                    })
                  }
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
