import React from 'react';

const InstructionGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">입금 가이드</h3>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="font-medium text-blue-700 mb-3">STEP 1</h4>
        <p className="text-gray-700 mb-2 text-sm">Upbit 내 출금 완료 후 해당 코인 내역에 접속 후 거래 내역 클릭</p>
        <p className="text-red-600 font-medium text-sm mb-4">※ 출금이 완료되었는지 반드시 확인하세요!</p>
        
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <img
            src="/transaction1.svg"
            alt="출금 완료 확인 이미지"
            className="w-full rounded"
          />
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="font-medium text-blue-700 mb-3">STEP 2</h4>
        <p className="text-gray-700 mb-4 text-sm">거래 ID를 복사하여 Crepe에 입력하여 거래 확인</p>
        
        <div className="bg-white p-2 rounded-lg border border-gray-200">
          <img
            src="/transaction2.svg"
            alt="거래 ID 복사 이미지"
            className="w-full rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default InstructionGuide;