import { X } from 'lucide-react'
import Header from "@/components/common/Header"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import React, { useState } from "react"
import BottomNav from '@/components/common/BottomNavigate'
import TransactionItem from "@/components/coin/TransactionItem"
import CoinAddressModal from "@/components/coin/CoinAddressModal";

interface CryptoWalletProps {
  isUser?: boolean;
}

const coinMeta = {
  XRP: {
    name: "리플",
    icon: <X className="w-6 h-6" />,
    bg: "bg-gray-200",
    balance: "0.3 XRP",
    krw: "1000 KRW",
  },
  SOL: {
    name: "솔라나",
    icon: (
      <div className="w-5 h-5 flex flex-col justify-between">
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
        <div className="h-[2px] bg-white" />
      </div>
    ),
    bg: "bg-[#9945FF]",
    balance: "0.3 SOL",
    krw: "1000 KRW",
  },
  USDT: {
    name: "테더",
    icon: <div className="text-white text-sm font-bold">T</div>,
    bg: "bg-[#26A17B]",
    balance: "0.3 USDT",
    krw: "1000 KRW",
  },
}

export default function CoinDetailPage() {
  const { symbol } = useParams()
  const location = useLocation()
  const isUser = location.state?.isUser ?? false

  const accountStatus = "registered" as "registered" | "not_registered" | "pending";
  const [showModal, setShowModal] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('day')

  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');

  const coin = coinMeta[symbol as keyof typeof coinMeta]

  if (!coin) return <div className="p-4">잘못된 경로입니다.</div>

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header 
        title={`${coin.name} 상세`} 
        onBackClick={() => {
          navigate(isUser ? "/user-coin" : "/store-coin")
        }} 
      />

      <main className="flex-1 overflow-auto p-5">
        {/* 보유 자산 카드 */}
        <div className="rounded-2xl border-2 border-gray-200 bg-white p-12 shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-10 h-10 ${coin.bg} rounded-full flex items-center justify-center mr-4`}>
                {coin.icon}
              </div>
              <p className="text-2xl font-semibold">총 보유</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{coin.balance}</p>
              <p className="text-base text-gray-500">= {coin.krw}</p>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="w-full mb-6">
          <button
            className="w-full bg-[#0a2e64] text-white py-4 rounded-xl text-lg font-semibold shadow"
            onClick={() => {
              if (isUser) {
                navigate(`/home-coin-address/${symbol}`, { state: { isUser,symbol } })
              } else {
                if (accountStatus==="registered") {
                  navigate("/settlement", { state: { isUser ,symbol } })
                } else if (accountStatus==="not_registered") {
                  navigate("/add-coin-address", { state: { isUser ,symbol } })
                }
              }
            }}
          >
            {isUser
              ? "코인 충전"
              : accountStatus === "registered"
                ? "정산 요청"
                : accountStatus === "pending"
                  ? "계좌 등록중입니다..."
                  : "계좌 등록"
            }
          </button>

          {/* 계좌 상태 표시 박스 (스토어일 경우만) */}
          {!isUser && (
            <div
              className="w-full bg-gray-200 text-center py-3 rounded-xl text-base font-medium mt-3"
              style={{ boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' }}
              onClick={() => {
                if (accountStatus === "registered" || accountStatus === "pending") {
                  setShowModal(true)
                } else {
                  setShowModal(false)
                }
              }}
            >
              <span className={
                accountStatus === "registered"
                  ? "text-gray-500"
                  : accountStatus === "pending"
                    ? "text-gray-500"
                    : "text-red-500"
              }>
                {accountStatus === "registered"
                  ? "계좌가 등록되었습니다"
                  : accountStatus === "pending"
                    ? "계좌가 등록중입니다"
                    : "계좌가 등록되지 않았습니다"}
              </span>
            </div>
          )}
        </div>
        
        {/* 기간 선택 탭 - 계좌등록 버튼 아래로 이동 */}
        <div className="mb-6">
          <div className="flex bg-white rounded-xl p-1 shadow-sm">
            {['day', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition ${
                  selectedPeriod === period 
                    ? 'bg-[#0a2e64] text-white' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {period === 'day' && '1일'}
                {period === 'week' && '1주'}
                {period === 'month' && '1개월'}
                {period === 'year' && '1년'}
              </button>
            ))}
          </div>
        </div>

        {showModal && (
          <CoinAddressModal
            symbol={symbol!}
            coinName={coin.name}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* 거래 내역 섹션 */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">거래 내역</h3>
          <button className="text-sm font-medium text-[#0a2e64] flex items-center">
            전체보기
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-1">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        {/* 거래 내역 */}
        <div className="space-y-6 pb-10 text-[20px]">
          {/* 입금 내역 */}
          <TransactionItem
            date="2024.12.12 16:36"
            type="입금 완료"
            balance="0.31232123 XRP"
            amount="+0.31232123 XRP"
            krw="1000"
            isDeposit
          />

          <TransactionItem
            date="2024.12.11 16:36"
            type="결제 완료"
            balance="0.31232123 XRP"
            amount="-0.31232123 XRP"
            krw="1000"
            isDeposit={false}
          />
          
          {isUser && (
            <div className="text-center p-2">
              <button className="text-sm text-[#0a2e64] font-medium">더보기</button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}