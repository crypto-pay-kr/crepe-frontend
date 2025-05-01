import { X } from "lucide-react"
import Header from '@/components/common/Header'
import { useNavigate, useLocation } from "react-router-dom"
import BottomNav from '@/components/common/BottomNavigate'
import React, { useState } from 'react'
import { OrderSection } from '@/components/coin/OrderSection'

import { Coin, Order } from '@/constants/coinData'


// New imports for enhanced design
import { Wallet, ArrowUpRight } from "lucide-react"

export default function CoinHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUser = location.state?.isUser ?? false;
  const [activeTab, setActiveTab] = useState('assets'); // 'assets' or 'orders'

  const handleCoinClick = (symbol: string) => {
    navigate(`/coin-detail/${symbol}`, { state: { isUser } });
  };

  // 코인 데이터
  const COINS: Coin[] = [
    {
      symbol: "XRP",
      name: "리플",
      icon: <X className="h-5 w-5 text-white" />,
      bg: "bg-gradient-to-br from-blue-500 to-blue-700",
      balance: "0.3 XRP",
      krw: "1,000 KRW",
      change: "+2.5%",
    },
    {
      symbol: "SOL",
      name: "솔라나",
      icon: (
        <div className="flex h-5 w-5 flex-col justify-between">
          <div className="h-[2px] bg-white"></div>
          <div className="h-[2px] bg-white"></div>
          <div className="h-[2px] bg-white"></div>
        </div>
      ),
      bg: "bg-gradient-to-br from-violet-500 to-indigo-600",
      balance: "0.3 SOL",
      krw: "1,000 KRW",
      change: "+4.2%",
    },
    {
      symbol: "USDT",
      name: "테더",
      icon: <span className="text-base font-bold text-white">T</span>,
      bg: "bg-gradient-to-br from-green-500 to-green-700",
      balance: "0.3 USDT",
      krw: "1,000 KRW",
      change: "+0.1%",
    },
  ];

  // 주문 데이터
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
      {/* Custom Header with notification */}
      <Header title="자산관리" />

      <main className="flex-1 overflow-auto bg-gray-50">
        {/* Premium Balance Card */}
        <div className="px-4 py-6">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 p-5 shadow-lg">
            <div className="mb-4 flex items-center">
              <div className="flex items-center">
                <Wallet className="mr-2 h-6 w-6 text-blue-100" />
                <span className="text-lg font-medium text-blue-100">총 자산</span>
              </div>
            </div>
            <h2 className="mb-1 text-3xl font-bold text-white">3,000 KRW</h2>
            <div className="flex items-center text-green-300">
              <ArrowUpRight className="mr-1 h-4 w-4" />
              <span className="text-sm">+2.4% 오늘</span>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex border-b border-gray-200 bg-white">
          <button 
            className={`flex-1 py-3 text-center text-sm font-medium ${
              activeTab === 'assets' 
                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('assets')}
          >
            보유 자산
          </button>
          {isUser && (
            <button 
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'orders' 
                  ? 'border-b-2 border-indigo-600 text-indigo-600' 
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              거래 내역
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="px-4">
          {activeTab === 'assets' ? (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">보유 코인</h3>
                <button className="text-sm font-medium text-indigo-600">전체보기</button>
              </div>
              
              <div className="space-y-3">
                {COINS.map((coin) => (
                  <div 
                    key={coin.symbol}
                    onClick={() => handleCoinClick(coin.symbol)}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${coin.bg}`}>
                        {coin.icon}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900">{coin.name} <span className="text-sm text-gray-500">{coin.symbol}</span></h4>
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
            isUser && <OrderSection orders={SAMPLE_ORDERS} />
          )}
        </div>
      </main>
      
      <BottomNav />
    </div>
  )
}