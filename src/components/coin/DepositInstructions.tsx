import React from "react";
interface CoinLinkProps {
  currency: string;
}
const DepositInstructions: React.FC<CoinLinkProps> = ({currency}) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-base font-bold text-gray-800">입금하는 방법</p>
      </div>

      <div className="mb-4 rounded-lg border border-yellow-100 bg-yellow-50 p-4">
        <p className="mb-2 text-sm font-medium text-yellow-800">안내사항</p>
        <p className="text-xs text-yellow-700">
          반드시 정확한 주소로 입금해주세요. 잘못된 주소로 입금 시 복구가
          불가능합니다.
        </p>
        <p className="text-sm font-bold text-red-700">
          입금 방식을 바로입금으로 설정해주세요 일부 코인에서는 수수료가 발생
          할수 있습니다
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex">
          <div className="bg-blue-100 mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
            <span className="text-blue-600 text-xs font-bold">1</span>
          </div>
          <div className="flex flex-col">
            <a
              href={`https://upbit.com/balances/${currency}?tab=withdraw`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm underline transition-colors"
            >
              https://upbit.com/balances/{currency}?tab=withdraw
            </a>
            <p className="text-sm"> 업비트로 이동합니다.</p>
            </div >
            </div>

            <div className="flex">
              <div
                className="bg-blue-100 mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-700">출금할 코인 수량 입력</p>
            </div>

            <div className="flex">
              <div
                className="bg-blue-100 mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-700">확인 버튼 클릭</p>
            </div>

            <div className="flex">
              <div
                className="bg-blue-100 mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-blue-600 text-xs font-bold">4</span>
              </div>
              <p className="text-sm text-gray-700">입금처: 입력된 선택</p>
            </div>

            <div className="flex">
              <div
                className="bg-blue-100 mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
                <span className="text-blue-600 text-xs font-bold">5</span>
              </div>
              <p className="text-sm text-gray-700">
                받는사람 주소 입력 상단의 입금할 주소 복사하여 붙여넣기
              </p>
            </div>

            <div className="flex">
              <div
                className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-xs font-bold text-red-600">6</span>
              </div>
              <p className="text-sm font-bold text-red-600">출금 신청</p>
            </div>

            <div className="flex">
              <div
                className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-xs font-bold text-red-600">7</span>
              </div>
              <p className="text-sm font-bold text-red-600"> 거래내역에 접속</p>
            </div>

            <div className="flex">
              <div
                className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-xs font-bold text-red-600">8</span>
              </div>
              <p className="text-sm font-bold text-red-600">출금 신청이 완료 되면 거래 ID가 보입니다</p>
            </div>

            <div className="flex">
              <div
                className="mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <span className="text-xs font-bold text-red-600">9</span>
              </div>
              <p className="text-sm font-bold text-red-600">
                거래 ID 복사 후 하단의 입금 요청 클릭 후 거래 ID 입력
              </p>
            </div>
          </div>
        </div>
        )
        };

        export default DepositInstructions;