import { X, Wallet, ShoppingCart } from "lucide-react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { OrderSection } from '@/components/coin/OrderSection';
import { Coin, Order } from '@/constants/coinData';
import CoinAssets from '@/components/coin/CoinAssets';
import TokenAssets from '@/components/token/my-product/TokenAssets';
import { getCoinBalance } from '@/api/coin';


// 수신 데이터 타입 정의
interface RawCoinBalance {
  coinName: string;
  currency: string;
  balance: number;
}

const COIN_INFO: Record<string, Omit<Coin, 'balance' | 'krw'>> = {
  XRP: {
    currency: "XRP",
    coinName: "리플",
    icon: <X className="h-5 w-5 text-white" />,
    bg: "bg-gradient-to-br from-blue-500 to-blue-700",
    change: "+2.5%",
  },
  USDT: {
    currency: "USDT",
    coinName: "테더",
    icon: <span className="text-base font-bold text-white">T</span>,
    bg: "bg-gradient-to-br from-green-500 to-green-700",
    change: "+0.1%",
  },
  SOL: {
    currency: "SOL",
    coinName: "솔라나",
    icon: (
      <div className="flex h-5 w-5 flex-col justify-between">
        <div className="h-[2px] bg-white"></div>
        <div className="h-[2px] bg-white"></div>
        <div className="h-[2px] bg-white"></div>
      </div>
    ),
    bg: "bg-gradient-to-br from-violet-500 to-indigo-600",
    change: "+4.2%",
  },
};

export default function CoinHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = location.state?.isUser ?? true;
  //const [activeTab, setActiveTab] = useState('assets');
  const [coins, setCoins] = useState<Coin[]>([]);
  const [activeTab, setActiveTab] = useState<'coin' | 'token'>('coin');


  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`, { state: { isUser } });
  };




  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data: RawCoinBalance[] = await getCoinBalance();
        const currencies = ["XRP", "USDT", "SOL"];
        const coinMap = new Map(data.map((raw) => [raw.currency, raw]));

        const mapped: Coin[] = currencies.map((symbol) => {
          const raw = coinMap.get(symbol);
          const info = COIN_INFO[symbol];

          const amount = raw?.balance ?? 0;
          const krwRate =
            symbol === "XRP" ? 1000 :
              symbol === "USDT" ? 1300 :
                symbol === "SOL" ? 100000 : 0;
          const krw = amount * krwRate;

          return {
            currency: symbol,
            coinName: info.coinName,
            icon: info.icon,
            bg: info.bg,
            balance: `${amount} ${symbol}`,
            krw: `${Math.floor(krw).toLocaleString()} KRW`,
            change: info.change,
          };
        });

        setCoins(mapped);
      } catch (err) {
        console.error("잔액 조회 실패:", err);
      }
    };

    fetchBalance();
  }, []);

  const totalBalanceKRW = coins.reduce((sum, coin) => {
    const n = Number(coin.krw.replace(/[^0-9]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);


  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="자산관리" />
      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 p-5 shadow-lg">
            <div className="mb-4 flex items-center">
              <Wallet className="mr-2 h-6 w-6 text-blue-100" />
              <span className="text-lg font-medium text-blue-100">총 자산</span>
            </div>
            <h2 className="mb-1 text-3xl font-bold text-white">{totalBalanceKRW.toLocaleString()} KRW</h2>
            <div className="flex items-center text-green-300">
              <ShoppingCart className="h-6 w-6 stroke-white" />
              <span className="text-sm">+2.4% 오늘</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'coin' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
            onClick={() => setActiveTab('coin')}
          >
            가상 자산
          </button>
          {isUser && (
            <button
              className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'token' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
              onClick={() => setActiveTab('token')}
            >
             K-토큰
            </button>
          )}
        </div>

        <div className="px-4">
          {activeTab === 'coin' ? (
            <CoinAssets coins={coins} onClick={handleCoinClick} />
          ) : (
            <TokenAssets />
          )}
        </div>

        {isUser && (
          <button
            onClick={() => navigate('/user/order-history')}
            className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-500"
            aria-label="주문 내역으로 이동"
          >
            <ShoppingCart className="h-6 w-6 stroke-white" />
          </button>
        )}
      </main>
      <BottomNav />
    </div>
  );
}