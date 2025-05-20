interface TransactionItemProps {
  date: string;
  type: string;
  balance: string;
  amount: string;
  krw: string;
  isDeposit: boolean;
  showAfterBalance: boolean;
}

export default function TransactionItem({
                                          date,
                                          type,
                                          balance,
                                          amount,
                                          krw,
                                          isDeposit,
                                          showAfterBalance,
                                        }: TransactionItemProps) {
  const [rawAmount, symbol] = amount.split(" ");
  const parsed = parseFloat(rawAmount);

  const formattedAmount = isNaN(parsed)
    ? amount
    : `${parsed > 0 ? "+" : ""}${parsed.toFixed(6)} ${symbol}`;


  const [balanceValue, balanceSymbol] = balance.split(" ");
  const parsedBalance = parseFloat(balanceValue);

  const formattedBalance = isNaN(parsedBalance)
    ? balance
    : `${parsedBalance.toFixed(6)} ${balanceSymbol}`;

  return (
    <div className="space-y-2 border-b border-gray-300 pb-4">
      <p className="text-sm text-gray-500">{date}</p>
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`text-xl font-bold ${
              isDeposit ? "text-sky-700" : "text-red-500"
            } mb-2`}
          >
            {type}
          </p>
          {showAfterBalance && (
            <p className="text-gray-600 text-sm">잔액: {formattedBalance}</p>
          )}
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-bold ${
              isDeposit ? "text-sky-700" : "text-red-500"
            } mb-2`}
          >
            <span>{formattedAmount}</span>
          </p>
          <p className="text-sm text-gray-600">= {krw} KRW</p>
        </div>
      </div>
    </div>
  );
}