"use client"

import React, { useState } from "react"
import { Home, ShoppingBag, User } from 'lucide-react'
import Button from '@/components/common/Button'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'

export default function AddCoinAddress() {
  const navigate = useNavigate()
  const [useExistingAddress, setUseExistingAddress] = useState(false)
  const [address, setAddress] = useState("")
  const location = useLocation()
  const symbol = location.state?.symbol
  const [tagAddress, setTagAddress] = useState("")
  const isSeller = location.pathname.includes('/store');


  const onNext = () => {
    if (!symbol) {
      alert("코인 심볼이 없습니다.");
      return;
    }

    navigate(`/coin-detail/${symbol}`, {
      state: { isUser: false }
    });
  };


  const isButtonDisabled = false

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-10">네트워크: 솔라나</h2>

          <div className="mb-6">
            <h3 className="text-base font-medium mb-2">고객님의 SOL 주소</h3>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="고객님의 SOL 주소를 입력해주세요."
              className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#0a2158]"
            />
          </div>


          {symbol === "XRP" && (
            <div className="mb-10">
              <h3 className="text-base font-medium mb-2">고객님의 XRP Tag 주소</h3>
              <input
                type="text"
                value={tagAddress}
                onChange={(e) => setTagAddress(e.target.value)}
                placeholder="고객님의 XRP 주소를 입력해주세요."
                className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-[#0a2158]"
              />
            </div>
          )}

          <div>
            <p className="text-base mb-4">고객님의 주소를 확인하는 방법</p>
            <ol className="list-decimal pl-5 text-sm space-y-2">
              <li>https://upbit.com/balances/SOL?tab=deposit</li>
              <li>출금할 코인 수량 입력</li>
              <li>입금 네트워크와 현재 선택한 코인이 동일한지 확인</li>
              <li>입금주소 복사</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="p-5">
        <Button text="계좌 등록 요청" onClick={onNext} disabled={!address && !useExistingAddress}
                color={isButtonDisabled ? "gray" : "blue"} />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}

