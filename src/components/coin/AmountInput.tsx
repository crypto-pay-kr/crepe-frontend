import React from 'react';

interface AmountInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  symbol: string;
  equivalentValue: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
  symbol,
  equivalentValue
}) => {
  return (
    <div className="w-full">
      <div className="flex items-end mb-2">
        <div className="flex-1 flex items-baseline">
          <input
            type="text"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className="text-3xl font-bold w-full bg-transparent border-none outline-none p-0"
            style={{ color: '#0C2B5F' }}
            inputMode="decimal"
          />
          <span className="text-xl font-medium text-gray-700 ml-2">{symbol}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pb-1 border-b border-gray-200">
        <span className="text-sm text-gray-500">= {equivalentValue}</span>
        <span className="text-xs text-blue-600 font-medium">환율 적용</span>
      </div>
    </div>
  );
};

export default AmountInput;