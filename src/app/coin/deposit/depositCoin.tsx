import React, { useState } from "react"
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'
import NetworkDisplay from "@/components/coin/NetworkDispaly"
import DepositAddress from "@/components/coin/DepositAddress"
import DepositInstructions from "@/components/coin/DepositInstructions"


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
    navigate(`/coin/transaction/${symbol}`, {
      state: { isUser: true }
    });
  }

  const isButtonDisabled = false

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="코인 입금" />

      <div className="flex-1 px-6 py-6 overflow-auto bg-gray-50">
        <div className="mb-16 max-w-md mx-auto">
          <NetworkDisplay networkName={symbol || "Unknown"} />
          
          <DepositAddress 
            address="TNgzwecDR23DDKFodjkfn20d" 
            copied={copied} 
            onCopy={handleCopy} 
          />
          
          <DepositInstructions />
        </div>
      </div>

      <div className="p-5 bg-white shadow-lg border-t border-gray-100">
        <Button 
          text="입금 확인" 
          onClick={onNext} 
          color={isButtonDisabled ? "gray" : "blue"}
          className="w-full rounded-lg py-3 font-semibold text-lg shadow-md" 
        />
      </div>

      <BottomNav/>
    </div>
  )
}
