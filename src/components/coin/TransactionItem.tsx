interface TransactionItemProps {
  date: string;
  type: string;
  balance: string;
  amount: string;
  krw: string;
  isDeposit: boolean;
}

export default function TransactionItem({ date, type, balance, amount, krw, isDeposit }: TransactionItemProps) {
  return (
    <div className="space-y-2 border-b border-gray-300 pb-4">
      <p className="text-sm text-gray-500">{date}</p>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xl font-bold ${isDeposit ? 'text-blue-500' : 'text-red-500'} mb-2`}>{type}</p>
          <p className="text-l text-gray-600 font-medium">잔액: {balance}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-bold ${isDeposit ? 'text-blue-500' : 'text-red-500'} mb-2`}>
            <span>{amount.split(' ')[0]}</span>{" "}
            <span className="text-gray-600">{amount.split(' ')[1]}</span>
          </p>
          <p className="text-sm text-gray-600">= {krw} KRW</p>
        </div>
      </div>
    </div>
  );
}
