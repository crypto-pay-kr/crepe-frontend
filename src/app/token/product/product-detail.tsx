import { useParams, useNavigate } from "react-router-dom";
import { dummyTokenData } from "@/constants/TokenData";
import { dummyTokenTransactions } from "@/constants/TokenTransactionData";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import TransactionItem from "@/components/coin/TransactionItem";
import React, { useState } from 'react'
import { BankLogo } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'

export default function TokenDetailPage() {
  const { tokenCode } = useParams();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('day')

  const group = dummyTokenData.find(g => g.tokens.some(t => t.code === tokenCode));
  const token = group?.tokens.find(t => t.code === tokenCode);
  const transactions = dummyTokenTransactions.find(t => t.code === tokenCode)?.history ?? [];

  if (!token || !group) return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;

  const handleCancelClick = () => {
    navigate(`/token/product/cancel/${tokenCode}`, {
      state: { tokenCode },
    });
  };
  const handleExchangeClick = () => {
    navigate(`/token/product/deposit/${tokenCode}`, {
      state: { tokenCode },
    });
  };
  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header
        title={`${token.name} 상세`}
        onBackClick={() => navigate(-1)}
      />

        <main className="flex-1 overflow-auto p-5">
          {/* 보유 자산 카드 */}
          <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3">
                  <BankLogo bank={group.bank} />
                </div>
                <p className="text-2xl font-semibold">총 보유</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {token.amount}
                </p>
                <p className="text-base text-gray-500">
                  = {token.evaluated} KRW
                </p>
                <p className="text-sm mt-1 text-red-500">수익률: <span className="font-medium text-red-500">{token.rate}</span></p>
              </div>
            </div>
          </div>
          <div className="-mt-2 mb-4 w-full">
            <button className="w-full bg-[#0a2e64] text-white py-3 rounded-lg font-medium text-base shadow-sm"
            onClick={handleExchangeClick}>
              토큰 예치
            </button>
          </div>

        {/* 기간 선택 탭 - 계좌등록 버튼 아래로 이동 */}
        <div className="mb-6">
          <div className="flex rounded-xl bg-white p-1 shadow-sm">
            {['day', 'week', 'month', 'year'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition ${
                  selectedPeriod === period
                    ? 'bg-[#0a2e64] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period === 'day' && '1일'}
                {period === 'week' && '1주'}
                {period === 'month' && '1개월'}
                {period === 'year' && '1년'}
              </button>
            ))}
          </div>
        </div>


        {/* 거래 내역 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">거래 내역</h3>
          <button className="flex items-center text-sm font-medium text-[#0a2e64]">
            전체보기
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M6 12L10 8L6 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 거래 내역 세부*/}
          <div className="space-y-4 pb-10 text-xs">
          {transactions.length > 0 ? (
            transactions.map((tx, idx) => (
              <TransactionItem
                key={idx}
                date={tx.date}
                type={tx.status}
                balance={`${tx.amount}`}
                amount={(tx.amount > 0 ? "+" : "") + tx.amount + "XRP"}
                krw={tx.krw.toLocaleString()}
                isDeposit={tx.amount > 0}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500">거래 내역이 없습니다.</p>
          )}
        </div>
      </main>

      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="해지 요청"
          onClick={handleCancelClick}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
