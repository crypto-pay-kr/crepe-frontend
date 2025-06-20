import BottomNav from '@/components/common/BottomNavigate'
import React, { useEffect, useState } from 'react'
import Header from '@/components/common/Header'
import { fetchUserPayHistory } from '@/api/user'
import { ApiError } from '@/error/ApiError'
import { toast } from 'react-toastify'

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
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const getStatusStyle = (payType: string) => {
    const styles: { [key: string]: string } = {
      PENDING: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200',
      REFUND: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200',
      APPROVED: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200',
    };
    return styles[payType] || 'bg-gray-50 text-gray-600 border border-gray-200';
  };

  const getStatusText = (payType: string) => {
    const texts: { [key: string]: string } = {
      PENDING: '수락 대기',
      REFUND: '환불 완료',
      APPROVED: '결제 완료',
    };
    return texts[payType] || payType;
  };


  useEffect(() => {
    fetchUserPayHistory()
      .then((data) => {
        setHistories(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((e) => {
        if (e instanceof ApiError) {
          toast(e.message); // 커스텀 에러 메시지
        } else {
          toast("예기치 못한 오류가 발생했습니다.");
        }
        setError("결제 내역 불러오기 실패");
      });
  }, [page, pageSize]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="결제 내역" />
      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-6 pb-24">

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
        <div className="mt-4 text-center text-sm text-slate-500">
          총 {histories.length}건의 결제 내역
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
