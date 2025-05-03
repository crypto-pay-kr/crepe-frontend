
import { X, Wallet, ArrowUpRight } from "lucide-react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { OrderSection } from '@/components/coin/OrderSection';
import { Coin, Order } from '@/constants/coinData';
import { getStoreBalance, getUserBalance } from '@/api/coin'

interface RawCoinBalance {
  coinName: string;
  currency: string;
  balance: number | null;
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

export default function StoreCoinPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assets');
  const [coins, setCoins] = useState<Coin[]>([]);

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`, { state: { isStore: true } });
  };



  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data: RawCoinBalance[] = await getStoreBalance();
        const currencies = ["XRP", "USDT", "SOL"];
        const coinMap = new Map(data.map((raw) => [raw.currency, raw]));

        const mapped: Coin[] = currencies.map((symbol) => {
          const raw = coinMap.get(symbol); // 없을 수도 있음
          const info = COIN_INFO[symbol];

          const rawBalance = raw?.balance ?? "0";
          const amount = typeof rawBalance === "number" ? rawBalance : parseFloat(rawBalance);

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
            balance: `${amount.toFixed(3)} ${symbol}`,
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

  const SAMPLE_ORDERS: Order[] = [
    {
      id: "90897",
      status: "completed",
      storeName: "명동 칼국수 마장동",
      orderItems: "칼국수 외 1개",
      orderDate: "2024년 12월 20일 9시 52분",
      orderNumber: "11YPD000PM12",
      storeLocation: "명동지점",
    },
    {
      id: "90897",
      status: "cancelled",
      reason: "자리 없음",
      storeName: "명동 칼국수 마장동",
      orderItems: "칼국수 외 1개",
      orderDate: "2024년 12월 20일 9시 52분",
      orderNumber: "11YPD000PM12",
      storeLocation: "명동지점",
    },
  ];

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="가맹점 자산관리" />

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 p-5 shadow-lg">
            <div className="mb-4 flex items-center">
              <Wallet className="mr-2 h-6 w-6 text-blue-100" />
              <span className="text-lg font-medium text-blue-100">총 자산</span>
            </div>
            <h2 className="mb-1 text-3xl font-bold text-white">{totalBalanceKRW.toLocaleString()} KRW</h2>
            <div className="flex items-center text-green-300">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span className="text-sm">+3.2% 오늘</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'assets' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('assets')}
          >
            보유 자산
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'orders' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('orders')}
          >
            거래 내역
          </button>
        </div>

        <div className="px-4">
          {activeTab === 'assets' ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">보유 코인</h3>
                <button
                  className="text-sm font-medium text-indigo-600"
                  onClick={() => navigate('/settlement')}
                >
                  정산하기
                </button>
              </div>
              <div className="space-y-3">
                {coins.map((coin) => (
                  <div
                    key={coin.currency}
                    onClick={() => handleCoinClick(coin.currency)}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${coin.bg}`}>
                        {coin.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">{coin.coinName} <span className="text-sm text-gray-500">{coin.currency}</span></h4>
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
          ) : (
            <OrderSection orders={SAMPLE_ORDERS} />
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
