import React from "react";

interface TotalSettlementProps {
  totalValue: number;
}

export default function TotalSettlement({
  totalValue,
}: TotalSettlementProps): React.ReactElement {
  return (
    <div className="mx-4 mb-4 bg-white rounded-lg p-6 shadow-md border border-gray-100">
      <p className="text-gray-500 mb-1">총 결산</p>
      <p className="text-2xl font-bold">{totalValue.toLocaleString()} KRW</p>
    </div>
  );
}