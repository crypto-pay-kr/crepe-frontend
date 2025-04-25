import React, { useState } from 'react'
import Header from "@/components/common/Header"
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'
import { Home, ShoppingBag, User } from 'lucide-react'

export default function adjustmentCoin() {
  const [amount, setAmount] = useState("3.45")
  const [selectedPercentage, setSelectedPercentage] = useState(70)
  const availableAmount = 54321
  const exchangeRate = 1000 / 3.45
  const navigate = useNavigate();
  const handlePercentageClick = (percentage: number) => {
    setSelectedPercentage(percentage)
    const newAmount = ((availableAmount * (percentage / 100)) / exchangeRate).toFixed(2)
    setAmount(newAmount)
  }
  const location = useLocation()
  const symbol = location.state?.symbol

  const handleSubmit = () => {
    navigate(`/coin-detail/${symbol}`, {
      state: {symbol:symbol } // 필요 시 사용자 상태도 같이 넘길 수 있음
    })
  }

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

  return (
    <div className="h-full flex flex-col">
      <Header title="리플" />

      <main className="flex-1 overflow-auto bg-gray-50 px-6 pt-8 pb-10 flex flex-col">

        {/* 금액 입력 */}
        <div className="mb-10">
          <p className="text-xl text-gray-800 font-bold mb-6">정산받을 금액을 입력하세요.</p>

          <div className="flex justify-between items-end mb-6">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-4xl font-bold text-red-500 w-1/2 bg-transparent border-none outline-none"
            />
            <div className="flex flex-col items-end">
              <span className="text-xl font-semibold">XRP</span>
              <span className="text-base text-gray-500">= 1000 KRW</span>
            </div>
          </div>

          {/* 퍼센트 선택 */}
          <div className="grid grid-cols-6 gap-3 mb-10">
            {[10, 20, 30, 50, 70, 100].map((percentage) => (
              <button
                key={percentage}
                onClick={() => handlePercentageClick(percentage)}
                className={`py-3 text-lg rounded-lg transition ${
                  selectedPercentage === percentage
                    ? "bg-gray-800 text-white font-bold"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>

          {/* 정산 가능 금액 */}
          <div className="flex justify-between items-end">
            <span className="text-xl text-gray-700 font-bold">정산 가능 금액</span>
            <div className="text-right">
              <p className="text-xl font-bold">{availableAmount.toLocaleString()} XRP</p>
              <p className="text-sm text-gray-500">= 1000 KRW</p>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>

        {/* 정산 버튼 */}
        <button
          onClick={handleSubmit}
          className="bg-[#0a2e64] text-white py-5 rounded-2xl text-xl font-bold shadow w-full"
        >
          정산 요청
        </button>
      </main>


      <BottomNav navItems={navItems} />
    </div>
  )
}