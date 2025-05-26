import React from 'react';

const AddressInstructions: React.FC = () => {
  return (
    <div>
      <p className="text-base mb-4">고객님의 주소를 확인하는 방법</p>
      <ol className="list-decimal pl-5 text-sm space-y-2">
        <li>https://upbit.com/balances/SOL?tab=deposit</li>
        <li>출금할 코인 수량 입력</li>
        <li>입금 네트워크와 현재 선택한 코인이 동일한지 확인</li>
        <li>입금주소 복사</li>
      </ol>
    </div>
  );
};

export default AddressInstructions;