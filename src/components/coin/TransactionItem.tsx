interface TransactionItemProps {
  date: string;
  type: string;
  balance: string;
  amount: string;
  krw: number|string;
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


  const [rawAmount, rawSymbol] = amount.split(" ");
  const parsed = parseFloat(rawAmount);
  const formattedAmount = isNaN(parsed)
    ? Number(amount).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : `${parsed > 0 ? "+" : parsed < 0 ? "-" : ""}${Math.abs(parsed).toLocaleString('ko-KR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;



  const [balanceValue, rawBalanceSymbol] = balance.split(" ");
  const parsedBalance = parseFloat(balanceValue);
  const balanceSymbol = rawBalanceSymbol?.toUpperCase() ?? rawBalanceSymbol;



  const formattedBalance = isNaN(parsedBalance)
    ? Number(balance).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : `${Number(parsedBalance).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${balanceSymbol}`;


  return (
    <div className="space-y-2 border-b border-gray-300 pb-4">
      <p className="text-sm text-gray-500">{date}</p>
      <div className="flex justify-between items-start">
        <div>
          <p
            className={`text-base font-bold ${
              isDeposit ? "text-indigo-800" : "text-red-500"
            } mb-2`}
          >
            {type}
          </p>
          {showAfterBalance && (
            <p className="text-gray-600 text-sm">잔액: {formattedBalance}</p>
          )}
        </div>
        <div className="text-right">
          <p>
            <span  className={`text-base font-bold ${
              isDeposit ? "text-indigo-800" : "text-red-500"
            } mb-2`}>{formattedAmount} {rawSymbol}</span>
          </p>
          <p className="text-sm text-gray-600">= {Number(krw).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KRW</p>
        </div>
      </div>
    </div>
  );
}