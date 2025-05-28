
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useState } from 'react'

import Button from '@/components/common/Button'
import { useNavigate, useLocation } from "react-router-dom";

export default function TokenExchangeCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    bank,
    fromCurrency,
    toCurrency,
    fromAmount,
    toAmount,
    isCoinToToken,
  } = location.state || {};

  const onNext = () => {
    if (bank) {
      navigate(`/token/detail/${bank}`);
    } else {
      alert("잘못된 접근입니다.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header disableBack={true} title="토큰 환전" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-medium mb-2">환전이</h2>
          <h2 className="text-2xl font-medium mb-12">완료되었습니다.</h2>

          <div className="flex flex-col items-center gap-4">
            <p className="text-3xl font-bold">
              {isCoinToToken
                ? `${fromAmount} ${fromCurrency}`
                : `${toAmount} ${toCurrency}`}
            </p>

            <div className="w-10 h-10 flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>

            <p className="text-3xl font-bold">
              {isCoinToToken
                ? `${toAmount} ${toCurrency}`
                : `${fromAmount} ${fromCurrency}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="확인"
          onClick={onNext}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}