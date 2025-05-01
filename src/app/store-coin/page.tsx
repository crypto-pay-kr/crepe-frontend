import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ShoppingBag, X } from 'lucide-react'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'
import React from 'react'

const coins = [
  {
    symbol: "XRP",
    name: "리플",
    icon: <X className="h-7 w-7" />,
    bg: "bg-gray-200",
    balance: "0.3 XRP",
    krw: "1000 KRW",
  },
  {
    symbol: "SOL",
    name: "솔라나",
    icon: (
      <div className="flex h-6 w-6 flex-col justify-between">
        <div className="h-[2px] bg-white"></div>
        <div className="h-[2px] bg-white"></div>
        <div className="h-[2px] bg-white"></div>
      </div>
    ),
    bg: "bg-[#9945FF]",
    balance: "0.3 SOL",
    krw: "1000 KRW",
  },
  {
    symbol: "USDT",
    name: "테더",
    icon: <span className="text-base font-bold text-white">T</span>,
    bg: "bg-[#26A17B]",
    balance: "0.3 USDT",
    krw: "1000 KRW",
  },
];


interface CryptoWalletProps {
  isUser: boolean
}

type Coin = {
  symbol: string;
  name: string;
  icon: React.ReactNode;
  bg: string;
  balance: string;
  krw: string;
};

function CoinCard({ coin, onClick }: { coin: Coin; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-md cursor-pointer"
    >
      <div className="flex items-center">
        <div className={`mr-4 flex h-14 w-14 items-center justify-center rounded-full ${coin.bg}`}>
          {coin.icon}
        </div>
        <div>
          <p className="text-xl font-semibold">{coin.name}</p>
          <p className="text-sm text-gray-500">{coin.symbol}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-2 text-right">
          <p className="font-semibold text-[#5f65f6] text-xl">{coin.balance}</p>
          <p className="text-sm text-black">{coin.krw}</p>
        </div>
        <ChevronRight className="h-6 w-6 text-gray-400" />
      </div>
    </div>
  );
}

export default function  CoinWalletPage() {
  const navigate = useNavigate();
  const isUser = false;


  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`, { state: { isUser } });
  };


  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <Header title={'나의자산 확인하기'} onBackClick={() => navigate(-1)} />

      <main className="flex-1 overflow-auto bg-gray-100">
        {/* Balance Card */}
        <div className="m-6 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
          <p className="mb-2 text-lg text-gray-500">총 자산</p>
          <h2 className="text-4xl font-bold text-black">3,000 KRW</h2>
        </div>

        {/* Crypto List */}
        <div className="flex flex-col gap-6 px-6">
          {coins.map((coin) => (
            <CoinCard key={coin.symbol} coin={coin} onClick={() => handleCoinClick(coin.symbol)} />
          ))}
        </div>

        {/* Orders Section */}
        {isUser && (
          <div className="mx-6 mt-8">
            <h2 className="mb-6 text-2xl font-bold">Crepe 주문 현황</h2>

            {/* Completed Order */}
            <div className="mb-6 rounded-2xl bg-white shadow-md">
              <div className="flex items-center justify-between border-b p-6">
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <ShoppingBag className="h-8 w-8" />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xl font-medium">Order #90897</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>주문 완료</p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="mb-3 text-lg font-medium">명동 칼국수 마장동</p>
                <div className="text-base text-gray-500">
                  <p>칼국수 외 1개</p>
                  <p>주문일시: 2024년 12월 20일 9시 52분</p>
                  <p>주문번호: 11YPD000PM12</p>
                  <p>주문점포: 명동지점</p>
                </div>
              </div>
            </div>

            {/* Cancelled Order */}
            <div className="rounded-2xl bg-white shadow-md">
              <div className="flex items-center justify-between border-b p-6">
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <ShoppingBag className="h-8 w-8" />
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                      <X className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <p className="text-xl font-medium">Order #90897</p>
                </div>
                <div className="text-base text-gray-500">
                  <p>주문 거절 - 자리 없음</p>
                </div>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              <div className="p-6">
                <p className="mb-3 text-lg font-medium">명동 칼국수 마장동</p>
                <div className="text-base text-gray-500">
                  <p>칼국수 외 1개</p>
                  <p>주문일시: 2024년 12월 20일 9시 52분</p>
                  <p>주문번호: 11YPD000PM12</p>
                  <p>주문점포: 명동지점</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}

