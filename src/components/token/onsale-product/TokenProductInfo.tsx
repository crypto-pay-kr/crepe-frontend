import React from "react";

export interface BankProductInfoProps {
  productTitle: string;
  interestRange: string;
}

export default function BankProductInfo({
  productTitle,
  interestRange,
}: BankProductInfoProps) {
  return (
    <>
      <div className="mt-2 font-bold text-2xl">{productTitle}</div>
      <div className="text-xl font-bold text-indigo-600 mb-2">{interestRange}</div>
    </>
  );
}