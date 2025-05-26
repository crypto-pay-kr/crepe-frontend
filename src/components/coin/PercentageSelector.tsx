import React from 'react';

interface PercentageSelectorProps {
  percentages: number[];
  selectedPercentage: number;
  onPercentageClick: (percentage: number) => void;
}

const PercentageSelector: React.FC<PercentageSelectorProps> = ({
  percentages,
  selectedPercentage,
  onPercentageClick
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {percentages.map((percentage) => (
        <button
          key={percentage}
          onClick={() => onPercentageClick(percentage)}
          className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center min-w-16 border ${
            selectedPercentage === percentage
              ? "bg-white text-blue-600 font-bold border-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium border-transparent"
          }`}
        >
          {percentage}%
        </button>
      ))}
    </div>
  );
};

export default PercentageSelector;