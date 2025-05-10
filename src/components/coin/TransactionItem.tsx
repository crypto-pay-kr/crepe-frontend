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
          <p className={`text-xl font-medium ${isDeposit ? 'text-red-500' : 'text-cyan-500'}`}>{type}</p>
          <p className="text-sm text-gray-600 font-medium">잔액: {balance}</p>
        </div>
        <div className="text-right">
          <p className={`text-xl font-medium ${isDeposit ? 'text-red-500' : 'text-cyan-500'}`}>{amount} <span className="text-black">{amount.split(' ')[1]}</span></p>
          <p className="text-sm text-gray-600">= {krw} KRW</p>
        </div>
      </div>
    </div>
  );
}
