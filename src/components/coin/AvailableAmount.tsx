import React from 'react';

interface AvailableAmountProps {
  availableAmount: number;
  symbol: string;
  equivalentValue: string;
}

const AvailableAmount: React.FC<AvailableAmountProps> = ({
  availableAmount,
  symbol,
  equivalentValue
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-lg text-gray-700 font-bold mb-1">정산 가능 금액</span>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">{availableAmount.toFixed(2).toLocaleString()} <span className="text-lg">{symbol}</span></p>
        <p className="text-sm text-gray-500 mt-1">= {equivalentValue}</p>
      </div>
    </div>
  );
};

export default AvailableAmount;