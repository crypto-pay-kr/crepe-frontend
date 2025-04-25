"use client"

import { useState } from "react"
import { ChevronLeft, Clock, Copy, Home, Info, ShoppingBag, User, ChevronDown } from "lucide-react"
import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { useNavigate } from 'react-router-dom'

export default function TransactionDetails() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()



  const isButtonDisabled = false

  const onNext = () => {
    navigate('/home-coin-transaction') // 다음 페이지로 수정 필요
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-10">거래 ID 입력</h2>

          <div className="mb-8">
            <p className="text-lg font-semibold mb-3">거래 ID</p>
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <span className="text-red-500 text-base font-medium">TNgzwecDR23DDKFodjkfn20d</span>
            </div>
          </div>

          <ol className="list-decimal pl-5 text-base space-y-2 mb-8">
            <li>Upbit 내 출금 완료 후 해당 코인 내역에 접속 후 거래 내역 클릭</li>
            <li className="text-red-500 font-bold">출금 완료되지 않 확인 후 클릭</li>
          </ol>


          <div className="mb-10">
            <img
              src="/transaction1.svg"
              alt="출금 완료 확인 이미지"
              className="w-full rounded border border-gray-300"
            />
          </div>

          <p className="text-base mb-6">2. 거래 ID 복사하여 Crepe에 입력하여 거래 확인</p>

          <div className="mb-6">
            <img
              src="/transaction2.svg"
              alt="거래 ID 복사 이미지"
              className="w-full rounded border border-gray-300"
            />
          </div>
        </div>
      </div>


      {/* Bottom Button */}
      <div className="p-5">
        <Button text="확인" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
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