import React from "react";

export interface AutoDebitInfoProps {
  account: string;
  transferDay: string;
  amount: string;
}

export default function AutoDebitInfo({
  account,
  transferDay,
  amount,
}: AutoDebitInfoProps) {
  return (
    <div className="bg-gray-100 p-4 rounded-md mb-6">
      <h3 className="font-medium mb-3">자동이체 정보</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="text-gray-600">출금계좌</div>
          <div>{account}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">이체일</div>
          <div>{transferDay}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">이체금액</div>
          <div>{amount}</div>
        </div>
      </div>
    </div>
  );
}