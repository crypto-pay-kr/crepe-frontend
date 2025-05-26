import { Coin } from '@/constants/coinData';
import ChevronRight from '../common/ChevronRight';
interface CoinItemProps {
  coin: Coin;
  onClick: () => void;
}

export function CoinItem({ coin, onClick }: CoinItemProps) {
  const { currency, coinName, icon, balance, krw } = coin;
  
  return (
    <div
      className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`mr-4 flex h-14 w-14 items-center justify-center rounded-full`}>
          {icon}
        </div>
        <div>
          <p className="text-xl font-semibold">{coinName}</p>
          <p className="text-sm text-gray-500">{currency}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-2 text-right">
          <p className="font-semibold text-[#5f65f6] text-xl">{balance}</p>
          <p className="text-sm text-black">{krw}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400" />
      </div>
    </div>
  );
}