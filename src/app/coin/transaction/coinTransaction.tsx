import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'
import { useState } from 'react'
import TransactionIdInput from '@/components/coin/TransactionIdInput'
import InstructionGuide from '@/components/coin/InstructionGuide'

type RouteParams = {
  symbol: string;
}

interface NavigationState {
  isUser: boolean;
  symbol?: string;
  transactionId: string;
}

export default function CoinTransaction() {
  const navigate = useNavigate();
  const params = useParams<keyof RouteParams>();
  const symbol = params.symbol;
  const [transactionId, setTransactionId] = useState<string>("")

  const isButtonDisabled = !transactionId

  const handleNext = () => {
    if (!symbol) {
      alert("코인 심볼이 없습니다.");
      return;
    }

    if (!transactionId) {
      alert("거래 ID를 입력해주세요.");
      return;
    }

    console.log("입력된 거래 ID:", transactionId) 
    const navigationState: NavigationState = { 
      isUser: true, 
      symbol, 
      transactionId 
    };
    
    navigate(`/coin-detail/${symbol}`, {
      state: navigationState,
    });
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="코인 입금" />

      <div className="flex-1 px-5 py-6 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">거래 ID 입력</h2>
          
          <TransactionIdInput 
            value={transactionId}
            onChange={setTransactionId}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <InstructionGuide />
        </div>
      </div>

      <div className="p-5 bg-white border-t border-gray-100 shadow-sm">
        <Button
          text="확인"
          onClick={handleNext}
          color={isButtonDisabled ? "gray" : "blue"}
          className="rounded-lg h-14 text-lg font-medium"
        />
      </div>
      <BottomNav />
    </div>
  )
}