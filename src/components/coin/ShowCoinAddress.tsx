"use client"

import React, { useState } from "react"
import { Copy, Home, ShoppingBag, User } from "lucide-react"
import Button from '@/components/common/Button'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'

export default function CoinDeposit() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { symbol } = useParams()
  const handleCopy = () => {
    navigator.clipboard.writeText("TNgzwecDR23DDKFodjkfn20d")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onNext = () => {
    navigate(`/home-coin-transaction/${symbol}`, {
      state: { isUser: true }
    });
  }

  const isButtonDisabled = false

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-10">네트워크: 솔라나</h2>

          <div className="mb-7">
            <p className="text-base font-bold mb-2">입금할 주소</p>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-red-500 text-sm font-medium">TNgzwecDR23DDKFodjkfn20d</span>
              <button onClick={handleCopy} className="text-gray-500">
                <Copy size={20} />
              </button>
            </div>
            {copied && <p className="text-green-500 text-xs mt-1">주소가 복사되었습니다</p>}
          </div>

          <div>
            <p className="text-base mb-4">입금하는 방법</p>
            <ol className="list-decimal pl-5 text-base space-y-2">
              <li>https://upbit.com/balances/SOL?tab=withdraw</li>
              <li>출금할 코인 수량 입력</li>
              <li>확인 버튼 클릭</li>
              <li>입금처: 입력된 선택</li>
              <li>받는사람 주소 입력 상단의 입금할 주소 복사하여 붙여넣기</li>
              <li className="text-red-500 font-bold">출금 신청</li>
              <li className="text-red-500 font-bold">거래내역에 접속</li>
              <li className="text-red-500 font-bold">거래 ID 복사</li>
              <li className="text-red-500 font-bold">하단의 입금 요청 클릭 후 거래 ID 입력</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-5">
        <Button text="입금 확인" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
      </div>

      {/* Bottom Navigation */}

      <BottomNav/>
    </div>
  )
}
