import { Home, ShoppingBag, User, X } from 'lucide-react'
import Header from "@/components/common/Header"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import React, { useState } from "react"
import BottomNav from '@/components/common/BottomNavigate'



export default function CoinDetailPage() {
  const { symbol } = useParams()
  const location = useLocation()
  const isUser = location.state?.isUser ?? false



// 예시 상태: "not_registered" | "pending" | "registered"
  const accountStatus = "registered" as "registered" | "not_registered" | "pending";
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/home")
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: false,
      onClick: () => navigate("/shop")
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: true,
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
    }
  ];
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

  const coin = coinMeta[symbol as keyof typeof coinMeta]

  if (!coin) return <div className="p-4">잘못된 경로입니다.</div>

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header title={`${coin.name} 상세`}   onBackClick={() => {
        navigate(isUser ? "/user-coin" : "/store-coin")
      }} />

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
        <div className="w-full px-4 mb-8">
          <button
            className="w-full bg-[#0a2e64] text-white py-4 rounded-xl text-lg font-semibold shadow"
            onClick={() => {
              if (isUser) {
                navigate(`/home-coin-address/${symbol}`, { state: { isUser,symbol } })
              } else {
                if (accountStatus==="registered") {
                  navigate("/adjustmentCoin", { state: { isUser ,symbol } })
                }else if (accountStatus==="not_registered") {
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

          {/* 회색 비활성 텍스트 박스 */}
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

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-2xl px-6 py-8 text-center w-[320px] shadow-lg">
              {/* 제목 */}
              <h2 className="text-lg font-bold mb-6">{coin?.name} 코인 입금 주소 </h2>

              {/* 내 주소 */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-1 text-gray-600">내 주소</p>
                <div className="w-full border border-gray-200 rounded-xl py-3 px-4 text-blue-900 font-semibold text-sm bg-gray-50">
                  TNgzweoDR23DDKFodjkfn20d
                </div>
              </div>

              {/* 태그 주소 - XRP일 때만 표시 */}
              {symbol === "XRP" && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-1 text-gray-600">태그 주소</p>
                  <div className="w-full border border-gray-200 rounded-xl py-3 px-4 text-blue-900 font-semibold text-sm bg-gray-50">
                    1312412432
                  </div>
                </div>
              )}

              {/* 안내 문구 */}
              <p className="text-sm text-gray-500 mb-6">
                계좌를 잘못 입력했다면? <span className="underline cursor-pointer"
                                    onClick={() => navigate("/add-coin-address", { state: { isUser, symbol } })}
              >재등록하기</span>
              </p>

              {/* 닫기 버튼 */}
              <button
                className="bg-[#0a2e64] text-white w-full py-3 rounded-xl text-base font-semibold"
                onClick={() => setShowModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}

        {/* 거래 내역 */}
        <div className="space-y-6 px-4 pb-10 text-[20px]">
          {/* 입금 내역 */}
          <div className="space-y-2 border-b border-gray-300 pb-4">
            <p className="text-sm text-gray-500">2024. 12.12 16:36</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold text-red-500">입금 완료</p>
                <p className="text-xl text-gray-600 font-medium">잔액: 0.31232123 XRP</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-red-500">
                  +0.31232123 <span className="text-black">XRP</span>
                </p>
                <p className="text-sm text-gray-600">= 1000 KRW</p>
              </div>
            </div>
          </div>

          {/* 결제 내역 */}
          <div className="space-y-2 border-b border-gray-300 pb-4">
            <p className="text-sm text-gray-500">2024. 12.11 16:36</p>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xl font-bold text-sky-600">결제 완료</p>
                <p className="text-xl text-gray-600 font-medium">잔액: 0.31232123 XRP</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-sky-600">
                  -0.31232123 <span className="text-black">XRP</span>
                </p>
                <p className="text-sm text-gray-600">= 1000 KRW</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}