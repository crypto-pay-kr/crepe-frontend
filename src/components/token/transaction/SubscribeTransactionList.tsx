import React from 'react';
import SimpleTransactionItem from '@/components/token/transaction/SubscribeTransactionItem'
import { SubscribeTransaction } from '@/types/BankTokenAccount';

interface TransactionProps {
  transactions: SubscribeTransaction[];
  loaderRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  hasNext: boolean;
  currency: string;
  afterBalance:number
  totalBalance?: number;
}


const SubscribeTransactionList: React.FC<TransactionProps> = ({ transactions, loaderRef, loading, hasNext, currency,totalBalance }) => {


  return (
    <div className="space-y-4 pb-10 text-xs">
      {transactions.length > 0 ? (
        transactions.map((tx, idx) => (
          <SimpleTransactionItem
            key={idx}
            eventType={tx.eventType}
            amount={tx.amount}
            date={tx.date}
            currency={currency}
            totalBalance={tx.eventType === "TERMINATION" ? totalBalance : undefined}
            afterBalance={tx.afterBalance}
          />
        ))
      ) : (
        <p className="text-sm text-gray-500">거래 내역이 없습니다.</p>
      )}

      <div ref={loaderRef} className="h-10 flex items-center justify-center">
        {loading && (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#0a2e64]" />
        )}
        {!hasNext && !loading && transactions.length > 0 && (
          <p className="text-sm font-semibold text-gray-500">더 이상 거래 내역이 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default SubscribeTransactionList;
