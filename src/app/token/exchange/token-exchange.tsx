import { useParams, useNavigate } from "react-router-dom";
import { dummyTokenData } from "@/constants/TokenData";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useState } from 'react'
import { BankLogo } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'
import TokenDistributionItem from "@/components/token/TokenDistributionItem";


export default function TokenExchangePage() {
  const navigate = useNavigate();
  const { bank } = useParams();

  const group = dummyTokenData.find(g => g.bank === bank);
  if (!group) return <div className="p-4">해당 은행 그룹을 찾을 수 없습니다.</div>;

  // 해당 그룹의 토큰 목록
  const token = group.tokens;

  // 토큰 코드 목록
  const tokenCodes = token.map(t => t.code);
  if (!token || !group) return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;


  const handleExchangeClick = () => {
    navigate(`/token/exchange/complete`, {
    });
  };

  const totalCapital = 1000000000;
  const tokenData = [
    {
      name: "XRP",
      percentage: 7.8,
      exchanged: 4.5,
      colorFrom: "from-indigo-600",
      colorTo: "to-blue-500",
    },
    {
      name: "SOL",
      percentage: 12.5,
      colorFrom: "from-blue-500",
      colorTo: "to-cyan-400",
    },
    {
      name: "USDT",
      percentage: 9.5,
      colorFrom: "from-amber-500",
      colorTo: "to-orange-500",
    },
  ];



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
          <div className="w-10 h-10 bg-navy-800 flex items-center justify-center rounded-full -mt-3">
            <svg
              className="w-10 h-12 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* 위쪽 화살표 (왼쪽) */}
              <path d="M8 17V7" />
              <path d="M5 10l3-3 3 3" />

              {/* 아래쪽 화살표 (오른쪽) */}
              <path d="M16 7v10" />
              <path d="M13 14l3 3 3-3" />
            </svg>
          </div>
        </div>

        {/*바꾸고 싶은 코인 종류*/}
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

        {/* Notes */}
        <div className="text-gray-500 text-sm mt-2 space-y-1">
          <p>* 잔여 교환 가능 리플  </p>
          <p>* 이번 달 남은 예치 가능 토큰: 450,000KRWT</p>
        </div>

        {/* Token Distribution Section */}
        <div className="mt-10">
          <div className="overflow-hidden rounded-t-xl bg-gradient-to-br from-indigo-400 to-blue-500 p-5 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">토큰 구성</h2>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                <p className="text-xs font-bold text-white">총 자본금</p>
                <p className="text-xl font-bold">
                  {totalCapital.toLocaleString()} <span className="text-sm ml-1">KRW</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-b-xl p-5 space-y-5 shadow-lg">
            {tokenData.map((token) => (
              <TokenDistributionItem key={token.name} {...token} />
            ))}
          </div>
        </div>
      </main>

      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="환전 요청"
          onClick={handleExchangeClick}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
