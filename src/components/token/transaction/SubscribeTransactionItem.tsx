interface SimpleTransactionItemProps {
  eventType: string;
  amount: string;
  date: string;
  currency: string;
  totalBalance?: number;
}

export default function SimpleTransactionItem({
                                                eventType,
                                                amount,
                                                date,
                                                currency,
                                                totalBalance,
                                              }: SimpleTransactionItemProps) {
  const isCancel = eventType === "TERMINATION";
  const isDeposit = parseFloat(amount) > 0 && !isCancel;

  const formattedAmount = `${isDeposit ? "+" : "+"}${parseFloat(amount).toLocaleString()} ${currency}`;
  const formattedDate = new Date(date).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true, // 오전/오후 표기
  });

  const EVENT_TYPE_KO: Record<string, string> = {
    INTEREST: "이자 지급",
    DEPOSIT: "예치 완료",
    TERMINATION : "해지 완료"
  };

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <p className="text-sm text-gray-500">{formattedDate}</p>
      <div className="flex justify-between items-center">
        <p
          className={`text-base font-semibold ${
            isCancel ? "text-red-500" : "text-indigo-800"
          }`}
        >
          {EVENT_TYPE_KO[eventType] ?? eventType}
        </p>
        <p
          className={`text-base font-bold ${
            isCancel ? "text-red-500" : "text-indigo-800"
          }`}
        >
          {formattedAmount}
        </p>
      </div>
      {isCancel && totalBalance !== undefined && (
        <p className="text-sm font-medium text-gray-700">
          계좌 잔액: {totalBalance.toLocaleString()} {currency}
        </p>
      )}
    </div>
  );

}
