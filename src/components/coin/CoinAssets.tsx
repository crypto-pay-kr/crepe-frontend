import { Coin } from '@/constants/coinData'

export default function CoinAssets({ coins, onClick }: { coins: Coin[], onClick: (symbol: string) => void }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">보유 가상자산</h3>
      </div>
      <div className="space-y-3">
        {coins.map((coin) => (
          <div key={coin.currency} onClick={() => onClick(coin.currency)} className="flex cursor-pointer items-center justify-between rounded-lg p-3 hover:bg-gray-50">
            <div className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${coin.bg}`}>
                {coin.icon}
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">
                  {coin.coinName} <span className="text-sm text-gray-500">{coin.currency}</span>
                </h4>
                <div className="text-sm text-green-500">{coin.change}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">{coin.balance}</div>
              <div className="text-sm text-gray-500">{coin.krw}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
