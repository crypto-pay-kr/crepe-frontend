import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useEffect, useState } from 'react'
// import { BankLogo, BankLogoProps } from '@/components/common/BankLogo'
import Button from '@/components/common/Button'
import { GetTerminatePreview, terminateSubscription } from '@/api/token'
import { useBankStore } from '@/stores/BankStore'
import { ApiError } from '@/error/ApiError'
import { toast } from "react-toastify";

interface TerminatePreview {
  subscribeId: number,
  balance: number, // 원금
  preTaxInterest: number, // 세전 이자
  postTaxInterest: number, // 세후 이자
  totalPayout: number // 원금 + 세후 이자
  interestRate: number
}


export default function TokenCancelPage() {
  const navigate = useNavigate();
  const { bankTokens } = useBankStore()
  const { fetchBankTokens } = useBankStore.getState();
  const { subscribeId } = useParams<{ subscribeId: string }>();
  const location = useLocation();
  const { productState, tokenInfoState } = location.state || {};
  const [terminatePreview, setTerminatePreview] = useState<TerminatePreview | null>(null);


  const today = new Date();
  const formattedToday = today.toISOString().slice(0, 10);

  if (!subscribeId || !productState || !tokenInfoState) {
    return <div className="p-4">해당 토큰 정보를 찾을 수 없습니다.</div>;
  }


  useEffect(() => {
    const fetchPreview = async () => {
      if (!subscribeId) return;

      try {
        const result = await GetTerminatePreview(subscribeId);
        setTerminatePreview(result);
      } catch (e) {
        if (e instanceof ApiError) {
          toast(`${e.message}`);
          console.log("🔥 API ERROR", e);
        } else {
          toast("예기치 못한 오류가 발생했습니다.");
        }
      }
    };

    fetchPreview();
  }, [subscribeId]);

  console.log("productState:", productState);

  const handleTerminate = async () => {
    if (!subscribeId) {
      toast("해지할 상품을 찾을 수 없습니다.");
      return;
    }

    try {
      await terminateSubscription(subscribeId);
      toast("상품이 해지되었습니다.");
      navigate(`/token/product/detail/${subscribeId}`, {
        state: {
          productState,
          tokenInfoState,
        },
        replace: true,
      });
    } catch (e) {
      if (e instanceof ApiError) {
        toast(`${e.message}`);
      } else {
        toast("예기치 못한 오류가 발생했습니다.");
      }
    }
  };




  const formattedTotalPay = terminatePreview?.totalPayout.toLocaleString() ?? "-";
  const formattedPreTaxInterest = terminatePreview?.preTaxInterest.toLocaleString() ?? "-";
  const formattedPostTaxInterest = terminatePreview?.postTaxInterest.toLocaleString() ?? "-";
  const postTaxInterest = terminatePreview?.postTaxInterest ?? 0;
  const fourteenPercent = postTaxInterest * 0.14;
  const onePointFourPercent = postTaxInterest * 0.014;
  const formattedFourteenPercent = fourteenPercent.toLocaleString();
  const formattedOnePointFourPercent = onePointFourPercent.toLocaleString();
  const totalTax = fourteenPercent + onePointFourPercent;
  const formattedTotalTax = totalTax.toLocaleString();
  const formattedInterestRate =
    terminatePreview?.interestRate != null
      ? (terminatePreview.interestRate * 100).toLocaleString(undefined, { maximumFractionDigits: 2 }) + "%"
      : "-";

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="상품 중도 해지" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Notice */}
        <div className="p-4 text-center font-semibold text-gray-600 text-lg bg-gray-50 border-b border-gray-200">
          <p>중도해지 시 아래와 같이</p>
          <p>오늘까지 발생한 이자와 원금이 입금됩니다.</p>
        </div>

        {/* Amount Section */}
        <div className="p-4 pb-0">
          <div className="text-center mb-2 text-base font-semibold text-gray-600">받으실 금액</div>
          <div className="text-center text-3xl font-bold mb-2 text-blue-900">
            <span className="text-xl">{formattedTotalPay} {tokenInfoState.currency}</span>
          </div>

          {/* Details Table - Enhanced Design */}
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm mt-4 mb-6">
            {/* Table Header */}
            <div className="bg-blue-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-blue-800">거래 상세 내역</h3>
            </div>

            {/* Principal Amount - Highlighted */}
            <div className="flex justify-between py-4 px-4 bg-blue-50/50 border-b border-gray-200">
              <div className="font-medium text-gray-700">원금</div>
              <div className="font-bold text-blue-900">{productState.amount}{tokenInfoState.currency} </div>
            </div>
            <div className="flex justify-between py-4 px-4 bg-blue-50/50 border-b border-gray-200">
              <div className="font-bold text-[#4B5EED]">금리</div>
              <div className="font-bold text-[#4B5EED]">{formattedInterestRate} </div>
            </div>

            {/* Interest - Highlighted */}
            <div className="flex justify-between py-4 px-4 bg-blue-50/30 border-b border-gray-200">
              <div className="font-medium text-gray-700">이자(세전)</div>
              <div className="font-semibold text-gray-700"> {formattedPreTaxInterest} {tokenInfoState.currency}</div>
            </div>

            {/* Tax Section */}
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <div className="text-xs text-gray-500">세금 정보</div>
            </div>

            <div className="flex justify-between py-3 px-4 border-b border-gray-100">
              <div className="text-gray-600">세금</div>
              <div className="font-semibold text-gray-800">{formattedTotalTax} {tokenInfoState.currency}</div>
            </div>

            <div className="flex justify-between py-3 px-4 border-b border-gray-100 bg-gray-50/50">
              <div className="text-gray-600 pl-4 text-sm">└ 소득세</div>
              <div className="font-medium text-gray-700">{formattedFourteenPercent} {tokenInfoState.currency}</div>
            </div>

            <div className="flex justify-between py-3 px-4 border-b border-gray-100 bg-gray-50/50">
              <div className="text-gray-600 pl-4 text-sm">└ 지방소득세</div>
              <div className="font-medium text-gray-700">{ formattedOnePointFourPercent} {tokenInfoState.currency}</div>
            </div>

            <div className="flex justify-between py-3 px-4 border-b border-gray-200">
              <div className="text-gray-600">과세구분</div>
              <div className="font-medium text-gray-800">일반과세</div>
            </div>

            {/* Total Amount - Highlighted */}
            <div className="flex justify-between py-4 px-4 bg-blue-100/50 border-b border-gray-200">
              <div className="font-bold text-indigo-700">받으실 금액</div>
              <div className="font-bold text-indigo-700">{formattedTotalPay} {tokenInfoState.currency}</div>
            </div>

            {/* Date */}
            <div className="flex justify-between py-3 px-4">
              <div className="text-gray-600">기준일</div>
              <div className="font-medium text-gray-800">{formattedToday}</div>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-1 mb-1 text-base font-bold text-center text-red-500">
            <p>⚠️ 중도 해지시 우대금리, 세제혜택 등이 ⚠️</p>
            <p>적용되지 않습니다️</p>
          </div>

        {/* 가입 상품 */}
        <div
          key={productState.subscribeId}
          className="mb-6 mt-8 rounded-2xl bg-white p-9 transition shadow-sm"
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
            </div>
          </div>
        </div>


        {/* Arrow */}
        <div className="flex justify-center my-1">
          <div className="w-10 h-12 bg-navy-800 flex items-center justify-center rounded-full -mt-3">
            <svg
              className="w-6 h-10 text-[#4B5EED]"
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
        <div className="mb-6 rounded-2xl  bg-white p-9  transition shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                {/*<BankLogo bank={tokenInfoState.currency as BankLogoProps["bank"]} />*/}
              </div>
              <p className="text-xl font-semibold">{tokenInfoState.bankTokenName}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">
                {productState.amount} {tokenInfoState.currency}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>



      <div className="p-5 bg-gray-50 shadow-lg border-t border-gray-50">
        <Button
          text="상품 해지"
          onClick={handleTerminate}
          className="w-full rounded-lg py-3 font-medium text-base shadow-md"
        />
      </div>
      <BottomNav />
    </div>
  );
}
