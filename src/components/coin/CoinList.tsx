import { CoinItem } from "./CoinItem";
import { Coin } from '@/constants/coinData';

interface CoinListProps {
  coins: Coin[];
  onCoinClick: (symbol: string) => void;
}

export function CoinList({ coins, onCoinClick }: CoinListProps) {
  return (
    <div className="flex flex-col gap-6 px-6">
      {coins.map((coin) => (
        <CoinItem key={coin.symbol} coin={coin} onClick={() => onCoinClick(coin.symbol)} />
      ))}
    </div>
  );
}
