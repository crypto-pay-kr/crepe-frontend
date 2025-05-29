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

  const BANK_SYMBOL_MAP: Record<string, string> = {
    'HANA': 'HTK',
    'SHINHAN': 'STK',
    'WOORI': 'WTK',
  };

  const [rawAmount, rawSymbol] = amount.split(" ");
  const parsed = parseFloat(rawAmount);
  const bankSymbol = BANK_SYMBOL_MAP[rawSymbol?.toUpperCase()] ?? rawSymbol;


  const formattedAmount = isNaN(parsed)
    ? amount
    : `${parsed > 0 ? "+" : ""}${parsed.toFixed(2)} ${bankSymbol}`;



  const [balanceValue, rawBalanceSymbol] = balance.split(" ");
  const parsedBalance = parseFloat(balanceValue);
  const balanceSymbol = BANK_SYMBOL_MAP[rawBalanceSymbol?.toUpperCase()] ?? rawBalanceSymbol;



  const formattedBalance = isNaN(parsedBalance)
    ? balance
    : `${parsedBalance.toFixed(2)} ${balanceSymbol}`;


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
            } mb-2`}>{formattedAmount}</span>
          </p>
          <p className="text-sm text-gray-600">= {krw}</p>
        </div>
      </div>
    </div>
  );
}