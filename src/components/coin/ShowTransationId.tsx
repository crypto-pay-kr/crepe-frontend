"use client"

import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'
import { useState } from 'react'

export default function ShowTransationId() {
  const navigate = useNavigate();
  const { symbol } = useParams();
  const [transactionId, setTransactionId] = useState("")

  const isButtonDisabled = !transactionId

  const onNext = () => {
    if (!symbol) {
      alert("코인 심볼이 없습니다.");
      return;
    }

    if (!transactionId) {
      alert("거래 ID를 입력해주세요.");
      return;
    }

    console.log("입력된 거래 ID:", transactionId) // 필요하면 API 호출 또는 상태 전송
    navigate(`/coin-detail/${symbol}`, {
      state: { isUser: true, symbol, transactionId },
    });
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      <div className="flex-1 px-4 py-4 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-10">거래 ID 입력</h2>

          <div className="mb-8">
            <p className="text-lg font-semibold mb-3">거래 ID</p>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="예: TNgzwecDR23DDKFodjkfn20d"
              className="w-full border-b border-gray-300 py-2 text-base focus:outline-none focus:border-[#0a2158]"
            />
          </div>

          <ol className="list-decimal pl-5 text-base space-y-2 mb-8">
            <li>Upbit 내 출금 완료 후 해당 코인 내역에 접속 후 거래 내역 클릭</li>
            <li className="text-red-500 font-bold">출금 완료되었는지 확인 후 클릭</li>
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

      <div className="p-5">
        <Button
          text="확인"
          onClick={onNext}
          color={isButtonDisabled ? "gray" : "blue"}
        />
      </div>

      <BottomNav />
    </div>
  )
}