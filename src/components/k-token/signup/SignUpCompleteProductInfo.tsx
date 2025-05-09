import React from "react";

export interface SignUpCompleteProductInfoProps {
  productName: string;
  startDate: string;
  endDate: string;
  monthlyAmount: string;
  baseRate: string;
  preferentialRate: string;
  finalRate: string;
}

export default function SignUpCompleteProductInfo({
  productName,
  startDate,
  endDate,
  monthlyAmount,
  baseRate,
  preferentialRate,
  finalRate,
}: SignUpCompleteProductInfoProps) {
  return (
    <div className="border rounded-md p-4 mb-6">
      <h3 className="font-medium mb-3">가입 상품 정보</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="text-gray-600">상품명</div>
          <div className="font-medium">{productName}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">가입일</div>
          <div>{startDate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">만기일</div>
          <div>{endDate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">월 납입금액</div>
          <div>{monthlyAmount}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">기본금리</div>
          <div>{baseRate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">우대금리</div>
          <div>{preferentialRate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">최종금리</div>
          <div className="font-medium">{finalRate}</div>
        </div>
      </div>
    </div>
  );
}