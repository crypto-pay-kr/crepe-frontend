interface TransactionItemProps {
  date: string;
  type: string;
  balance: string;
  amount: string;
  krw: string;
  isDeposit: boolean;
  showAfterBalance: boolean;
  originalAmount: number;
  transactionType: string; // 거래 타입 추가
}

export default function TransactionItem({
  date,
  type,
  balance,
  amount,
  krw,
  isDeposit,
  showAfterBalance,
  originalAmount,
  transactionType,
}: TransactionItemProps) {

  // 금액에서 심볼 추출
  const [amountValue, symbol] = amount.split(' ');
  const displayAmount = parseFloat(amountValue);
  
  // 입금/출금에 따른 +/- 기호 결정
  const formattedAmount = `${isDeposit ? '+' : '-'}${displayAmount.toFixed(2)} ${symbol}`;

  // 잔액 포맷팅
  const [balanceValue, rawBalanceSymbol] = balance.split(" ");
  const parsedBalance = parseFloat(balanceValue);
  const balanceSymbol = rawBalanceSymbol?.toUpperCase() ?? rawBalanceSymbol;

  const formattedBalance = isNaN(parsedBalance)
    ? balance
    : `${parsedBalance.toFixed(2)} ${balanceSymbol}`;

  // 디버깅용 로그
  console.log(`거래: ${transactionType}, 원본금액: ${originalAmount}, 표시방향: ${isDeposit ? '입금' : '출금'}, 표시금액: ${formattedAmount}`);

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
            <span className={`text-base font-bold ${
              isDeposit ? "text-indigo-800" : "text-red-500"
            } mb-2`}>
              {formattedAmount}
            </span>
          </p>
          <p className="text-sm text-gray-600">= {krw}</p>
        </div>
      </div>
    </div>
  );
}