import React from "react";

const DepositInstructions: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-base font-bold text-gray-800">입금하는 방법</p>
      </div>
      
      <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-100">
        <p className="text-sm text-yellow-800 font-medium mb-2">안내사항</p>
        <p className="text-xs text-yellow-700">반드시 정확한 주소로 입금해주세요. 잘못된 주소로 입금 시 복구가 불가능합니다.</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-blue-600">1</span>
          </div>
          <p className="text-sm text-gray-700">https://upbit.com/balances/SOL?tab=withdraw</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-blue-600">2</span>
          </div>
          <p className="text-sm text-gray-700">출금할 코인 수량 입력</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-blue-600">3</span>
          </div>
          <p className="text-sm text-gray-700">확인 버튼 클릭</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-blue-600">4</span>
          </div>
          <p className="text-sm text-gray-700">입금처: 입력된 선택</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-blue-600">5</span>
          </div>
          <p className="text-sm text-gray-700">받는사람 주소 입력 상단의 입금할 주소 복사하여 붙여넣기</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-red-600">6</span>
          </div>
          <p className="text-sm font-bold text-red-600">출금 신청</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-red-600">7</span>
          </div>
          <p className="text-sm font-bold text-red-600">거래내역에 접속</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-red-600">8</span>
          </div>
          <p className="text-sm font-bold text-red-600">거래 ID 복사</p>
        </div>
        
        <div className="flex">
          <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <span className="text-xs font-bold text-red-600">9</span>
          </div>
          <p className="text-sm font-bold text-red-600">하단의 입금 요청 클릭 후 거래 ID 입력</p>
        </div>
      </div>
    </div>
  );
};

export default DepositInstructions;