import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";

import React, { useEffect, useState } from 'react'
import { BankLogo, BankLogoProps } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'
import { depositToken, GetMySubscribeTransactionList } from '@/api/token'
import { useBankStore } from '@/stores/BankStore'
import { SubscribeTransaction } from '@/types/BankTokenAccount';


export default function TokenDepositPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const { bankTokens } = useBankStore()
  const { subscribeId } = useParams<{ subscribeId: string }>();
  const location = useLocation();
  const { productState, tokenInfoState } = location.state || {};
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  if (!subscribeId || !productState || !tokenInfoState) {
    return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;
  }


  useEffect(() => {
    if (!subscribeId) return;

    const fetchAndSumDeposits = async () => {
      try {
        const data = await GetMySubscribeTransactionList(subscribeId, 0, 100);
        const transactions: SubscribeTransaction[] = data.content ?? data;

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const thisMonthDeposits = transactions.filter((tx) => {
          const txDate = new Date(tx.date);
          return (
            tx.eventType.toUpperCase() === "DEPOSIT" &&
            txDate >= startOfMonth &&
            txDate <= now
          );
        });

        const total = thisMonthDeposits.reduce(
          (sum, tx) => sum + Number(tx.amount),
          0
        );

        setTotalThisMonth(total);
      } catch (error) {
        console.error("이번 달 예치 합산 실패", error);
      }
    };

    fetchAndSumDeposits();
  }, [subscribeId]);


  const handleDeposit = async () => {
    if (!subscribeId || amount <= 0) {
      alert("예치할 금액을 입력해주세요.");
      return;
    }
    console.log("product",productState.maxMonthlyPayment);

    try {
      await depositToken(subscribeId, amount);
      alert("예치가 완료되었습니다.");
      navigate(`/token/product/detail/${subscribeId}`, {
        state: {
          productState,
          tokenInfoState,
        },
        replace: true,
      });
    } catch (error: any) {
      alert(error.message); // 백에서 내려온 메시지 보여줌
    }
  };

  const remainingAmount = Math.max(0, Number(productState.maxMonthlyPayment) - totalThisMonth);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="토큰 예치" />

      <main className="flex-1 overflow-auto p-5">
        {/* 은행 토큰 계좌  */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <BankLogo bank={tokenInfoState.currency as BankLogoProps["bank"]} />
              </div>
              <p className="text-xl font-semibold">{tokenInfoState.bankTokenName}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-0.5">
                <input
                  type="number"
                  step={1000}
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="예치할 금액 입력"
                  className="text-xl font-bold text-right w-full border-none bg-transparent focus:outline-none focus:ring-0"
                />
                <span className="text-xl font-bold text-black">
                   {tokenInfoState.currency}
                </span>
              </div>
              <p className="text-sm text-gray-500">= {productState.evaluated}</p>
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

        {/* 가입 상품 */}
        <div
          key={productState.subscribeId}
          className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium whitespace-pre">{productState.rate}</span>
                </div>
              </div>
              <p className="text-xl font-semibold">{productState.name}</p>
            </div>
            <div className="text-right gap-0.5">
              <p className="text-xl font-bold ">
                {amount.toLocaleString()} {tokenInfoState.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p className="leading-snug">
            💡 한달 최대 <span className="text-indigo-600 text-base font-bold">{Number(productState.maxMonthlyPayment).toLocaleString()}</span>
            <span className="ml-1 text-indigo-600 text-base font-bold">{tokenInfoState.currency}</span> 예치 가능
          </p>
          <p className="leading-snug">
            💰 이번 달 남은 예치 가능 토큰:{" "}
            <span className="text-indigo-600 text-base text font-bold">{remainingAmount.toLocaleString()}</span>
            <span className="ml-1 text-base text-indigo-600 font-bold">{tokenInfoState.currency}</span>
          </p>
        </div>
      </main>




      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="예치 하기"
          onClick={handleDeposit}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
