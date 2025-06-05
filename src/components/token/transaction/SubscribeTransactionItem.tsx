interface SimpleTransactionItemProps {
  eventType: string;
  amount: string;
  date: string;
  currency: string;
  totalBalance?: number;
  afterBalance?: number;
}

export default function SimpleTransactionItem({
                                                eventType,
                                                amount,
                                                date,
                                                currency,
                                                totalBalance,
                                                afterBalance
                                              }: SimpleTransactionItemProps) {
  const amountNum = parseFloat(amount);
  const isCancel = eventType === "TERMINATION";
  const isPayment = eventType === "PAYMENT";
  const isDeposit = eventType === "DEPOSIT";
  const sign = isCancel ?"+": isPayment ? "-" : isDeposit  ? "+" : "-";
  const formattedAmount = `${sign}${Math.abs(amountNum).toLocaleString()} ${currency}`
  const formattedDate = new Date(date).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const EVENT_TYPE_KO: Record<string, string> = {
    INTEREST: "이자 지급",
    DEPOSIT: "예치 완료",
    TERMINATION : "해지 완료",
    PAYMENT: "결제 완료"
  };

  return (
    <div className="space-y-2 border-b border-gray-200 pb-4">
      <p className="text-sm text-gray-500">{formattedDate}</p>
      <div className="flex justifty-between justify-between">
        <p
          className={`text-base font-semibold ${
            isCancel ? 'text-red-500' : isDeposit ? 'text-indigo-800' : 'text-red-500'
          }`}
        >
          {EVENT_TYPE_KO[eventType] ?? eventType}
        </p>

        <p
          className={`text-base font-bold ${
            isCancel ? 'text-red-500' : isDeposit ? 'text-indigo-800' : 'text-red-500'
          }`}
        >
          {formattedAmount}
        </p>
      </div>
      {!isCancel || totalBalance === undefined ? (
        <p className="text-sm text-gray-600">잔액: {afterBalance} {currency}</p>
      ) : null}
      {isCancel && totalBalance !== undefined && (
        <p className="text-sm font-medium text-gray-700">
          토큰 계좌 잔액: {totalBalance.toLocaleString()} {currency}
        </p>
      )}
    </div>
  )

}
