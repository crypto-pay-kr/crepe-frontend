import { useParams, useNavigate } from "react-router-dom";
import { dummyTokenData } from "@/constants/TokenData";
import { dummyTokenTransactions } from "@/constants/TokenTransactionData";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import TransactionItem from "@/components/coin/TransactionItem";
import React, { useState } from 'react'
import { BankLogo } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'



export default function TokenDepositPage() {
  const navigate = useNavigate();
  const { tokenCode } = useParams();

  const group = dummyTokenData.find(group =>
    group.tokens.some(token => token.code === tokenCode)
  );

  const token = group?.tokens.find(t => t.code === tokenCode);

  if (!group || !token) {
    return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;
  }

  const bank = group.bank;
  const onNext = () => {
    navigate(``, {
      state: { isUser: true }
    });
  }

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="토큰 환전" />

      <main className="flex-1 overflow-auto p-5">
        {/* 보유 토큰 1 */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <BankLogo bank={group.bank} />
              </div>
              <p className="text-xl font-semibold">{group.groupName}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                {group.total}
              </p>
            </div>
          </div>
        </div>


        {/* Arrow */}
        <div className="flex justify-center my-1">
          <div className="w-10 h-12 bg-navy-800 flex items-center justify-center rounded-full -mt-3">
            <svg
              className="w-6 h-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 아래로 향하는 화살표 */}
              <path d="M12 3v16" />
              <path d="M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* 보유 토큰 2 */}
        <div
          key={token.code}
          className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <BankLogo bank={group.bank} />
              </div>
              <p className="text-xl font-semibold">{token.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{token.amount}</p>
              <p className="text-sm text-gray-500">= {token.evaluated}</p>
            </div>
          </div>
        </div>
        {/* Notes */}
        <div className="text-gray-500 text-sm mt-2 space-y-1">
          <p>* 한달 최대 500,000 KRWT 예치 가능</p>
          <p>* 이번 달 남은 예치 가능 토큰: 450,000KRWT</p>
        </div>
      </main>



      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="예치 하기"
          onClick={onNext}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
