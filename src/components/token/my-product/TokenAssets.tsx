import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { useNavigate } from 'react-router-dom'
import { Token } from '@/types/token';

export default function TokenAssets({
                                      tokens,
                                      onClick,
                                    }: {
  tokens: Token[]
  onClick: (symbol: string) => void
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const toggle = (symbol: string) => {
    setExpanded((prev) => ({
      ...prev,
      [symbol]: !prev[symbol],
    }));
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">보유 토큰</h3>
      </div>
      <div className="space-y-3">
        {tokens.map(token => (
          <div key={token.currency}>
            <div
              onClick={() => toggle(token.currency)}
              className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full">
                  <img
                    src={token.bankImageUrl}
                    alt={token.name}
                    className="h-5 w-5 rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">
                    {token.name}{' '}
                    <span className="text-sm text-gray-500">{token.currency}</span>
                  </h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    {token.balance.toLocaleString()} {token.currency}
                  </div>
                  <div className="text-sm text-gray-500">{token.krw}</div>
                </div>
                {expanded[token.currency] ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronUp size={16} className="text-gray-500" />
                )}
              </div>
            </div>

            {expanded[token.currency] &&
              token.product?.map((products) => (
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
                  <div className="flex items-center gap-2 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-blue-600 font-medium">{products.balance}</p>
                      <p className="text-xs text-gray-500">{token.currency}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}