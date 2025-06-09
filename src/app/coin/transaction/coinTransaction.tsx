import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'
import { useState } from 'react'
import TransactionIdInput from '@/components/coin/TransactionIdInput'
import InstructionGuide from '@/components/coin/InstructionGuide'
import {requestDeposit } from '@/api/coin'
import { ApiError } from '@/error/ApiError'
import { toast } from 'react-toastify';

import {v4} from 'uuid';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isButtonDisabled = !transactionId || isLoading;

  const handleNext = async () => {
    if (!symbol) {
      toast("코인 심볼이 없습니다.");
      return;
    }

    if (!transactionId) {
      toast("거래 ID를 입력해주세요.");
      return;
    }

    setIsLoading(true); // ⬅️ 로딩 시작
    try {
      const traceId = v4();
      await requestDeposit(symbol, transactionId, traceId);
      navigate(`/coin-detail/${symbol}`, {
        state: {
          isUser: true,
          symbol,
          transactionId,
        }
      });
    } catch (e: any) {
      if (e instanceof ApiError) {
        toast(`${e.message}`);
      } else {
        toast('예기치 못한 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false); // ⬅️ 요청 완료 후 로딩 해제
    }
  };

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
          text={isLoading? "입금 중.." : "확인"}
          onClick={handleNext}
          color={isButtonDisabled ? "gray" : "blue"}
          className="rounded-lg h-14 text-lg font-medium"
          disabled={isButtonDisabled}
        />
      </div>
      <BottomNav />
    </div>
  )
}