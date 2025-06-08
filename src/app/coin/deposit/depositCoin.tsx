import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/common/Button'
import Header from '@/components/common/Header'
import BottomNav from '@/components/common/BottomNavigate'
import NetworkDisplay from "@/components/coin/NetworkDispaly"
import DepositAddress from "@/components/coin/DepositAddress"
import DepositInstructions from "@/components/coin/DepositInstructions"
import { getCoinInfo } from '@/api/coin'

export interface coin {
  currency: string,
  address: string,
  tag?: string
}



export default function CoinDeposit() {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const { symbol } = useParams()
  const [coinInfo, setCoinInfo] = useState<coin| null>(null);
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() =>{
    const fetchCoinInfo =async ()=> {
      try {
        const data = await getCoinInfo(symbol as string);

        setCoinInfo(data);
      }catch (error){
        console.log("코인 정보 조회 오류"+ error)
      }
    }
    fetchCoinInfo()
  }, [])



  const onNext = () => {
    navigate(`/coin/transaction/${symbol}`, {
      state: { isUser: true }
    });
  }

  const isButtonDisabled = false

  return (
    <div className="flex flex-col h-screen bg-white">

      <Header title={`${symbol} 코인 입금`} />

      <div className="flex-1 px-6 py-6 overflow-auto bg-gray-50">
        <div className="mb-16 max-w-md mx-auto">

          
          <DepositAddress 
            address={coinInfo?.address?? ' '}
            tag={coinInfo?.tag?? ''}
            copied={copied}
            onCopy={handleCopy}
          />
          
          <DepositInstructions currency={coinInfo?.currency?? ''} />
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
