interface TokenDistributionItemProps {
  name: string;
  percentage: number;
  exchanged?: number;
  colorFrom: string;
  colorTo: string;
  exchangedColorFrom?: string;
  exchangedColorTo?: string;
}


export default function TokenDistributionItem({
                                                name,
                                                percentage,
                                                exchanged,
                                                colorFrom,
                                                colorTo,
                                                exchangedColorFrom = "from-fuchsia-500",
                                                exchangedColorTo = "to-purple-600",
                                              }: TokenDistributionItemProps) {
  const exchangedRatio = exchanged ? (exchanged / percentage) * 100 : 0;

  const radius = 45;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex gap-6 items-start">
      {/* Bar + Labels */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={`w-3 h-3 bg-gradient-to-r ${colorFrom} ${colorTo} rounded-full mr-2`} />
            <span className="font-medium">{name}</span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-bold mr-2">{percentage}%</span>
            {exchanged !== undefined && (
              <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                교환됨 {exchanged}%
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${colorFrom} ${colorTo}`}
            style={{ width: `${percentage}%` }}
          >
            {exchanged !== undefined && (
              <div
                className={`h-full bg-gradient-to-r ${exchangedColorFrom} ${exchangedColorTo}`}
                style={{ width: `${exchangedRatio}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
