import { X, Wallet, ShoppingCart } from "lucide-react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState, useEffect, useMemo } from 'react'
import { Coin, Order } from '@/constants/coinData';
import CoinAssets from '@/components/coin/CoinAssets';
import TokenAssets from '@/components/token/my-product/TokenAssets';
import { fetchCoinPrices, fetchCoinRate, getCoinBalance } from '@/api/coin'

// 수신 데이터 타입 정의
interface RawCoinBalance {
  coinName: string;
  currency: string;
  balance: number;
}

export const COIN_INFO: Record<string, Omit<Coin, 'balance' | 'krw'>> = {
  XRP: {
    currency: "XRP",
    coinName: "리플",
    icon: <X className="h-5 w-5 text-gray-400" />,
    bg: "bg-gray-200",
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
  const currencies = ["XRP", "USDT", "SOL"];
  const [activeTab, setActiveTab] = useState<'coin' | 'token'>('coin');
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    "KRW-XRP": 0,
    "KRW-USDT": 0,
    "KRW-SOL": 0,
  });
  const [changeRates, setChangeRates] = useState<{ [key: string]: { rate: number; direction: string } }>({});
  const [balance, setBalance] = useState<Record<string, number>>({});

  // 가격 - useEffect 수정
  useEffect(() => {
    const loadPrices = async () => {
      try {
        const prices = await fetchCoinPrices();
        setPrices(prices);
      } catch (e) {
        console.error("시세 실패", e);
      }
    };
    
    loadPrices();
    const interval = setInterval(loadPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  // 등락률 - useEffect 수정
  useEffect(() => {
    const loadRates = async () => {
      try {
        const rates = await fetchCoinRate();
        setChangeRates(rates);
        // console.log("등락률 응답", changeRates);
      } catch (e) {
        console.error("등락률 실패", e);
      }
    };
    
    loadRates();
    const interval = setInterval(loadRates, 2500);
    return () => clearInterval(interval);
  }, []);

  // 잔액 - 초기 1회만 로딩
  useEffect(() => {
    const loadBalances = async () => {
      try {
        const data = await getCoinBalance();
        // console.log("잔액 응답", data);

        const result: Record<string, number> = {};
        data.forEach((item: { currency: string; balance: number }) => {
          result[item.currency] = item.balance;
        });

        setBalance(result);
      } catch (e) {
        console.error("잔액 실패", e);
      }
    };

    // 초기 로딩만 실행 (주기적 업데이트 없음)
    loadBalances();
  }, []); // 빈 의존성 배열

  // 준비되지 않은 값은 "-" 형태로 처리해 로딩 중에도 UI가 먼저 뜰 수 있게 함.
  const coins = useMemo(() => {
    return currencies.map((symbol) => {
      const info = COIN_INFO[symbol];
      const amount = balance[symbol];
      const krwRate = prices[`KRW-${symbol}`];
      const rateInfo = changeRates[`KRW-${symbol}`];

      const balanceText = amount !== undefined ? `${amount} ${symbol}` : `- ${symbol}`;
      const krwText = amount !== undefined && krwRate !== undefined
        ? `${Math.floor(amount * krwRate).toLocaleString()} KRW`
        : `- KRW`;

      const rate = rateInfo?.rate ?? 0;
      const direction = rateInfo?.direction ?? 'EVEN';
      const formattedRate = rateInfo
        ? `${direction === 'RISE' ? '+' : direction === 'FALL' ? '-' : ''}${(rate * 100).toFixed(2)}%`
        : '-';

      return {
        currency: symbol,
        coinName: info.coinName,
        icon: info.icon,
        bg: info.bg,
        balance: balanceText,
        krw: krwText,
        change: formattedRate,
        changeDirection: direction,
      };
    });
  }, [balance, prices, changeRates]);

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`);
  };

  const handleExchangeClick = () => {
    navigate(`/token/onsale/products`);
  };

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
            </div>
          </div>
          <div className="mt-5 w-full">
            <button
              className="w-full bg-[#0a2e64] text-white py-2 rounded-xl font-medium text-base shadow-sm"
              onClick={handleExchangeClick}
            >
              K-토큰 상품 가입
            </button>
          </div>
        </div>

        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'coin' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
            onClick={() => setActiveTab('coin')}
          >
            가상 자산
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium ${activeTab === 'token' ? 'border-b-2 border-indigo-400 text-indigo-400' : 'text-gray-500'}`}
            onClick={() => setActiveTab('token')}
          >
            K-토큰
          </button>
        </div>

        <div className="px-4">
          {activeTab === 'coin' ? (
            <CoinAssets coins={coins} onClick={handleCoinClick} />
          ) : (
            <TokenAssets />
          )}
        </div>

        <button
          onClick={() => navigate('/my/orders')}
          className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-500"
          aria-label="주문 내역으로 이동"
        >
          <ShoppingCart className="h-6 w-6 stroke-white" />
        </button>

      </main>
      <BottomNav />
    </div>
  );
}