import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";

import React, { useEffect, useState } from 'react'
import Button from '@/components/common/Button'
import { depositToken, fetchTokenBalance, GetMySubscribeTransactionList } from '@/api/token'
import { useBankStore } from '@/stores/BankStore'
import { SubscribeTransaction } from '@/types/BankTokenAccount';
import { useTokenStore } from '@/constants/useToken'
import { getCoinBalanceByCurrency } from '@/api/coin'
import { toast } from 'react-toastify'
import { ApiError } from '@/error/ApiError'
import { v4 as uuidv4 } from 'uuid'


export default function TokenDepositPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const { subscribeId } = useParams<{ subscribeId: string }>();
  const location = useLocation();
  const { productState, tokenInfoState } = location.state || {};
  const [totalThisMonth, setTotalThisMonth] = useState(0);
  const { products } = (location.state as any) || {};
  const getTokenImage = useTokenStore((state) => state.getTokenImage);
  const imageUrl = getTokenImage(tokenInfoState.currency);
  const [myTokenBalance, setMyTokenBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);


  if (!subscribeId || !productState || !tokenInfoState) {
    return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;
  }


  useEffect(() => {
    if (!subscribeId) return;

    const fetchAndSumDeposits = async () => {
      try {
        const data = await GetMySubscribeTransactionList(Number(subscribeId), 0, 100);
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
      toast("예치할 금액을 입력해주세요.");
      return;
    }
    console.log("product",productState.maxMonthlyPayment);
    if (isLoading) return;
    setIsLoading(true);
    try {
      const traceId=uuidv4()
      await depositToken(subscribeId, amount,traceId);
      toast("예치가 완료되었습니다.");
      navigate(`/token/product/detail/${subscribeId}`, {
        state: {
          products,
          productState,
          tokenInfoState,
        },
        replace: true,
      });
    }catch (e) {
      if (e instanceof ApiError) {
        toast(`${e.message}`);  }
      else {
        toast('예기치 못한 오류가 발생했습니다.');
      }}
    finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!tokenInfoState) return;
    //현재 사용자의 토큰 잔액 불러오기
    fetchTokenBalance(tokenInfoState.currency)
      .then(setMyTokenBalance)
      .catch(err => {
        console.error('토큰 잔액 조회 실패:', err);
        setMyTokenBalance(0);
      });

  }, [tokenInfoState]);



  const remainingAmount = Math.max(0, Number(productState.maxMonthlyPayment) - totalThisMonth);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="토큰 예치" />

      <main className="flex-1 overflow-auto p-5">
        {/* 은행 토큰 계좌  */}

        <div className="mb-6 mt-10 rounded-2xl border-2 border-gray-200 bg-white p-9 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <div className=" flex items-center justify-between">
            {/* 왼쪽: 이미지 + 토큰명 + 보유량 */}
            <div className="flex flex-col items-start">
              <div className="mb-1 flex items-center">
                <div className="mr-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={products.name}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <span className="whitespace-pre text-xs font-medium">
                      ?
                    </span>
                  )}
                </div>
                <p className="text-xl font-semibold">
                  {tokenInfoState.bankTokenName}
                </p>
              </div>
              <p className="text-xs text-gray-400">
                보유: {myTokenBalance} {tokenInfoState.currency}
              </p>
            </div>

            {/* 오른쪽: 입력창 */}
            <div className="text-right mb-4">
              <div className="flex items-center justify-end gap-0.5">
                <input
                  type="number"
                  step={1}
                  min={0}
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  placeholder="예치할 금액 입력"
                  className="w-full border-none bg-transparent text-right text-xl font-bold [appearance:textfield] focus:outline-none focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                <span className="text-xl font-bold text-black">
                  {tokenInfoState.currency}
                </span>
              </div>
            </div>
          </div>

          {/* 간단한 퍼센트 버튼들 */}
          <div className="flex justify-end gap-2">
            {[25, 50, 75, 100].map(percent => (
              <button
                key={percent}
                onClick={() =>
                  setAmount(Math.floor((myTokenBalance * percent) / 100))
                }
                className="hover:bg-blue-100 hover:text-blue-600 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium transition-colors"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="my-1 flex justify-center">
          <div className="bg-navy-800 -mt-3 flex h-12 w-10 items-center justify-center rounded-full">
            <svg
              className="h-10 w-6 text-black"
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
          <div className="mb-4 mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <img
                  src={products.imageUrl}
                  alt={products.name}
                  className="h-6 w-6 rounded-full"
                />
              </div>
              <p className="text-xl font-semibold">{productState.name}</p>
            </div>
            <div className="gap-0.5 text-right">
              <p className="text-xl font-bold">
                {amount.toLocaleString()} {tokenInfoState.currency}
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p className="leading-snug">
            한달 최대{' '}
            <span className="text-base font-bold text-indigo-600">
              {Number(productState.maxMonthlyPayment).toLocaleString()}
            </span>
            <span className="ml-1 text-base font-bold text-indigo-600">
              {tokenInfoState.currency}
            </span>{' '}
            예치 가능
          </p>
          <p className="leading-snug">
            이번 달 남은 예치 가능 토큰:{' '}
            <span className="text text-base font-bold text-indigo-600">
              {remainingAmount.toLocaleString()}
            </span>
            <span className="ml-1 text-base font-bold text-indigo-600">
              {tokenInfoState.currency}
            </span>
          </p>
        </div>
      </main>

      <div className="border-t border-gray-50 bg-gray-50 p-5 shadow-lg">
        <Button
          text="예치 하기"
          onClick={handleDeposit}
          className="w-full rounded-lg py-3 text-lg font-semibold shadow-md"
          disabled={isLoading}
        />
      </div>
      <BottomNav />
    </div>
  )
}
