import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useState } from 'react'
import { BankLogo, BankLogoProps } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'
import { terminateSubscription } from '@/api/token'
import { useBankStore } from '@/stores/BankStore'



export default function TokenCancelPage() {
  const navigate = useNavigate();
  const { bankTokens } = useBankStore()
  const { fetchBankTokens } = useBankStore.getState();
  const { subscribeId } = useParams<{ subscribeId: string }>();
  const location = useLocation();
  const { productState, tokenInfoState } = location.state || {};

  if (!subscribeId || !productState || !tokenInfoState) {
    return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;
  }

  const handleTerminate = async () => {
    if (!subscribeId) {
      alert("해지할 상품을 찾을 수 없습니다.");
      return;
    }

    try {
      const result = await terminateSubscription(subscribeId);
      alert("상품이 해지되었습니다.");
      //await fetchBankTokens();
      console.log("해지 결과:", result);
      navigate(`/token/product/detail/${subscribeId}`, {
        state: {
          productState,
          tokenInfoState,
        },
        replace: true,
      });
    } catch (error) {
      console.error(error);
      alert("해지 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="상품 중도 해지" />

      <main className="flex-1 overflow-auto p-5">
        <div className="mb-6 mt-2">
          <img
            src="/cancel-1.png"
            alt="Token Cancel"
            className="w-full h-auto rounded-xl shadow"
          />
        </div>
        <div className="mb-6">
          <img
            src="/cancel-2.png"
            alt="Token Cancel"
            className="w-full h-auto rounded-xl shadow"
          />
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
            <div className="text-right">
              <p className="text-xl font-bold">{productState.amount} {tokenInfoState.currency}</p>
              <p className="text-sm text-gray-500">= {productState.amount}</p>
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

        {/* 은행 토큰 계좌 */}
        <div className="mb-6 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <BankLogo bank={tokenInfoState.currency as BankLogoProps["bank"]} />
              </div>
              <p className="text-xl font-semibold">{tokenInfoState.bankTokenName}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                {productState.amount} {tokenInfoState.currency}
              </p>
              <p className="text-sm text-gray-500">
               = {tokenInfoState.totalBalance}
              </p>
            </div>
          </div>
        </div>
      </main>



      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="상품 해지"
          onClick={handleTerminate}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
