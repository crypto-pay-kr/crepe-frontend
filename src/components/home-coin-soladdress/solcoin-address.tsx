"use client"

import { useState } from "react"
import { Check, ChevronLeft, Copy, Home, ShoppingBag, User } from 'lucide-react'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'

export default function SolanaAddressInput() {
  const navigate = useNavigate()
  const [useExistingAddress, setUseExistingAddress] = useState(false)
  const [address, setAddress] = useState("")



  const onNext = () => {
    navigate('/home-coin-transaction') // 페이지 이동 경로 수정 필요
  }

  const isButtonDisabled = false

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-10">네트워크: 솔라나</h2>

          <div className="mb-6">
            <button className="flex items-center" onClick={() => setUseExistingAddress(!useExistingAddress)}>
              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center mr-2">
                {useExistingAddress && <Check size={16} className="text-[#0a2158]" />}
              </div>
              <span className="text-base font-bold ">기존에 사용했던 주소 사용하기</span>
            </button>
          </div>

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
        <Button text="입금 요청하기" onClick={onNext}  disabled={!address && !useExistingAddress} color={isButtonDisabled ? "gray" : "blue"} />
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-3 border-t border-gray-200 bg-white">
        <button className="flex flex-col items-center text-[#0a2158]">
          <Home size={24} />
          <span className="text-xs mt-1">홈</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <ShoppingBag size={24} />
          <span className="text-xs mt-1">쇼핑몰</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <User size={24} />
          <span className="text-xs mt-1">마이페이지</span>
        </button>
      </div>
    </div>
  )
}
