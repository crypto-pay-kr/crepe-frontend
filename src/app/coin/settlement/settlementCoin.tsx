import React, { useEffect, useState } from 'react'
import Header from "@/components/common/Header"
import { useLocation, useNavigate } from 'react-router-dom'
import BottomNav from '@/components/common/BottomNavigate'
import AmountInput from '@/components/coin/AmountInput'
import PercentageSelector from '@/components/coin/PercentageSelector'
import AvailableAmount from '@/components/coin/AvailableAmount'
import Button from '@/components/common/Button'
import { fetchCoinPrices, getCoinBalanceByCurrency, requestWithdraw } from '@/api/coin'


export default function SettlementCoin() {
  const [amount, setAmount] = useState("3.45")
  const [selectedPercentage, setSelectedPercentage] = useState(70)
  const navigate = useNavigate();
  const location = useLocation()
  const symbol = location.state?.symbol || 'XRP'
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    "KRW-XRP": 0,
    "KRW-USDT": 0,
    "KRW-SOL": 0,
  });
  
  const handleAmountChange = (value: string) => {
    setAmount(value)
  }
  
  const handlePercentageClick = (percentage: number) => {
    setSelectedPercentage(percentage)
    const newAmount = ((availableAmount * (percentage / 100))).toFixed(2)
    setAmount(newAmount)
  }


  const [availableAmount, setAvailableAmount] = useState<number>(0);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const updatedPrices = await fetchCoinPrices();
        setPrices(updatedPrices);
      } catch (err) {
        console.error("시세 조회 실패", err);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 5000);

    return () => clearInterval(interval);
  }, []);

  const getKRWValue = (amount: string) => {
    const num = parseFloat(amount);
    const price = prices[`KRW-${symbol}`] ?? 0;
    return isNaN(num) ? "0 KRW" : `${Math.floor(num * price).toLocaleString()} KRW`;
  };


  useEffect(() => {
    const fetchBalance = async () => {
      if (!symbol) return;

      try {
        const data = await getCoinBalanceByCurrency(symbol);
        setAvailableAmount(data.balance ?? 0);
        const initialAmount = ((data.balance * selectedPercentage) / 100).toFixed(2);
        setAmount(initialAmount);
      } catch (e) {
        console.warn("잔액 조회 실패:", e);
      }
    };

    fetchBalance();
  }, [symbol]);

  const handleSubmit = async () => {
    try {
      await requestWithdraw(symbol, amount);
      alert("정산 요청이 완료되었습니다.");
      navigate(`/coin-detail/${symbol}`, {
        state: { symbol }
      });
    } catch (e) {
      if (e instanceof Error) {
        alert("정산 요청 실패: " + e.message);
        console.error(e);
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <Header title={`${symbol} 정산`} />

      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl text-gray-800 font-bold">정산받을 금액을 입력하세요</h1>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <AmountInput 
              amount={amount} 
              onAmountChange={handleAmountChange}
              symbol={symbol}
              equivalentValue={getKRWValue(amount)}
            />
          </div>

          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3">빠른 금액 선택</p>
            <PercentageSelector 
              percentages={[10, 20, 30, 50, 70, 100]} 
              selectedPercentage={selectedPercentage}
              onPercentageClick={handlePercentageClick}
            />
          </div>

          <div className="h-px bg-gray-200 my-6"></div>

          <div className="bg-blue-50 rounded-lg p-4">
            <AvailableAmount 
              availableAmount={availableAmount} 
              symbol={symbol}
              equivalentValue={getKRWValue(String(availableAmount))}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">정산 안내</h3>
              <p className="text-sm text-gray-600">
                정산 요청 후 영업일 기준 1-2일 내에 처리됩니다. 정산 최소 금액은 0.4 {symbol}입니다.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>
      </main>

      <div className="p-5 bg-white">
        <Button 
          text="정산 요청"
          onClick={handleSubmit}
          color="primary"
          className="py-4 text-lg font-medium rounded-xl shadow-md"
        />
      </div>

      <BottomNav />
    </div>
  )
}