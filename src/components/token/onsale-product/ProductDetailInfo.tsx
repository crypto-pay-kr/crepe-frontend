import React from "react";
import { Info } from "lucide-react";

export interface ProductInfoProps {
  productName: string;
  productType: string;
  target: string;
  amount: string;
  condition: string;
  interestPayment: string;
  baseRate: string;
  preferentialRate: string;
  infoMessage: string;
}

export default function ProductDetailInfo({
  productName,
  productType,
  target,
  amount,
  condition,
  interestPayment,
  baseRate,
  preferentialRate,
  infoMessage,
}: ProductInfoProps) {
  return (
    <div className="border-t border-b py-4 px-4">
      <h2 className="font-medium mb-2">상품 안내</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-gray-600">상품명</div>
          <div>{productName}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">상품 종류</div>
          <div>{productType}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">가입 대상</div>
          <div>{target}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">가입 금액</div>
          <div>{amount}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">가입 조건</div>
          <div>{condition}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">이자 지급</div>
          <div>{interestPayment}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">기본 금리</div>
          <div>{baseRate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">우대 금리</div>
          <div>{preferentialRate}</div>
        </div>
      </div>
      <div className="mt-4 bg-gray-100 p-3 rounded-md text-sm text-gray-600 flex items-start">
        <Info size={16} className="mr-2 mt-0.5" />
        <p>{infoMessage}</p>
      </div>
    </div>
  );
}