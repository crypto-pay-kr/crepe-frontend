import { ArrowLeft, Badge, Filter, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/common/select"
import BottomNav from '@/components/common/BottomNavigate'
import React, { useEffect, useState } from 'react'
import Header from '@/components/common/Header'
import { fetchUserPayHistory } from '@/api/user'

interface PayHistory {
  payId: number
  orderId: string
  storeName: string
  payDate: string
  orderDetail: string
  storeNickname: string
  payCoinAmount: number
  coinCurrency: string
  payKRWAmount: number
  payType: string
}



export default function MyPaymentHistoryPage() {
  const [histories, setHistories] = useState<PayHistory[]>([])
  const [error, setError] = useState<string | null>(null)

  const getStatusStyle = (payType: string) => {
    const styles: { [key: string]: string } = {
      PENDING: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200',
      REFUND: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200',
      PAID: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200'
    };
    return styles[payType] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getStatusText = (payType: string) => {
    const texts: { [key: string]: string } = {
      PENDING: '수락 대기',
      REFUND: '환불 완료',
      PAID: '결제 완료'
    };
    return texts[payType] || payType;
  };


  useEffect(() => {
    fetchUserPayHistory()
      .then(data => {
        setHistories(data.content)
      })
      .catch(err => {
        console.error(err)
        setError("결제 내역을 불러오는 데 실패했습니다.")
      })
  }, [])
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="결제 내역" />
      {/* Main Content */}
      <div className="px-4 py-4 flex-1 flex flex-col">


        <div className="mt-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-xl px-6 py-4 border border-slate-200">
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-700">
            <div className="col-span-2">
              가게명
            </div>
            <div className="col-span-2 text-center">
              결제 날짜
            </div>
            <div className="col-span-2 text-center">
              결제 ID
            </div>
            <div className="col-span-2 text-center">
              상세
            </div>
            <div className="col-span-2 text-center">
              금액
            </div>
            <div className="col-span-2 text-center">
              상태
            </div>
          </div>
        </div>

        {/* Pay History */}
        <div className="bg-white border-x border-b border-slate-200 rounded-b-xl divide-y divide-slate-100 shadow-sm">
          {histories.map((history, index) => (
            <div
              key={history.payId}
              className={`px-6 py-5 hover:bg-slate-50 transition-all duration-200 ${
                index === histories.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <div className="font-semibold text-slate-900 truncate text-sm">
                    {history.storeNickname}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-slate-600 text-sm">
                    {new Date(history.payDate).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="text-slate-400 text-xs mt-0.5">
                    {new Date(history.payDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-md truncate border">
                    {history.orderId}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="text-slate-700 text-sm truncate" title={history.orderDetail}>
                    {history.orderDetail}
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <div className="text-slate-900 font-bold text-sm">
                    {history.payKRWAmount.toLocaleString()}
                    <span className="text-slate-700 font-semibold text-[12px] ml-1">KRW</span>
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5 bg-slate-50 px-2 py-0.5 rounded inline-block">
                    {history.payCoinAmount} {history.coinCurrency}
                  </div>
                </div>

                <div className="col-span-2 flex justify-center">
                <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full ${getStatusStyle(history.payType)}`}>
                  {getStatusText(history.payType)}
                </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 푸터 정보 */}
        <div className="mt-4 text-center text-xs text-slate-500">
          총 {histories.length}건의 결제 내역
        </div>

        {/* Pagination */}
        <div className="mt-auto flex justify-end text-xs text-gray-500">
          <div className="flex gap-2">
            <button
              disabled
              className="h-8 w-8 p-0 rounded-md border border-gray-300 bg-white text-gray-400 cursor-not-allowed"
            >
              {"<"}
            </button>
            <button
              className="h-8 w-8 p-0 rounded-md bg-[#FF7B25] text-white hover:bg-[#FF7B25]"
            >
              1
            </button>
            <button
              disabled
              className="h-8 w-8 p-0 rounded-md border border-gray-300 bg-white text-gray-400 cursor-not-allowed"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
