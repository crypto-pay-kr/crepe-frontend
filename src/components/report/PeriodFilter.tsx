import React from "react";

type Period = "이번달" | "지난달" | "3개월" | "6개월" | "12개월";

interface PeriodFilterProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  periods: Period[];
}

export default function PeriodFilter({ 
  selectedPeriod, 
  onPeriodChange, 
  periods 
}: PeriodFilterProps): React.ReactElement {
  return (
    <div className="py-5 px-8 flex gap-3 overflow-x-auto justify-center">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onPeriodChange(period)}
          className={`
            px-6 py-2.5 
            rounded-full 
            text-sm 
            font-medium 
            transition-all 
            duration-150
            active:scale-95
            ${
              selectedPeriod === period 
                ? "bg-[#0a2e65] text-white shadow-md" 
                : "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50"
            }
          `}
        >
          {period}
        </button>
      ))}
    </div>
  );
}