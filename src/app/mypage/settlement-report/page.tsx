import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import Header from '@/components/common/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card"
import React, { useEffect, useState } from 'react'
import BottomNav from '@/components/common/BottomNavigate'
import { getStatusCount, getStorePayment } from '@/api/store'


export default function StoreSettlementReportPage() {
  const [monthlyData, setMonthlyData] = useState<{ shortMonth: string, amount: number }[]>([])

  const [statusStats, setStatusStats] = useState<{
    [key: string]: number
  }>({
    PENDING: 0, // 대기
    REFUNDED: 0, // 환불
    ACCEPTED: 0, // 성공
    FAILED: 0 // 실패
  })
  const totalStats =
    (statusStats.ACCEPTED ?? 0) +
    (statusStats.REFUNDED ?? 0) +
    (statusStats.PENDING ?? 0) +
    (statusStats.FAILED ?? 0)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getStorePayment()

        const baseMonths = Array.from({ length: 12 }, (_, i) => ({
          shortMonth: `${i + 1}`,
          amount: 0,
        }))

        // 내역에 없어도 월 별 기본 값 0
        const transformed = baseMonths.map(base => {
          const found = data.find((item: { month: number }) => `${item.month}` === base.shortMonth)
          return {
            ...base,
            amount: found ? found.totalAmount : 0,
          }
        })

        setMonthlyData(transformed)
      } catch (error) {
        console.error("월별 결제 금액 조회 실패:", error)
      }

      try {
        const countData = await getStatusCount()
        const formatted: { [key: string]: number } = {}
        countData.forEach((item: { status: string; count: number }) => {
          formatted[item.status] = item.count
        })
        setStatusStats(formatted)
      } catch (error) {
        console.error("거래 상태별 통계 조회 실패:", error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex flex-col h-screen relative bg-gray-50 overflow-hidden">
      <div className="shrink-0">
        <Header title="결산 리포트" />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base text-indigo-400 font-semibold mb-3">환불 내역</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(statusStats.REFUNDED || 0).toLocaleString()}
                    <span className="ml-2 text-sm text-gray-900">건</span>
                  </p>
                </div>
                <div className="p-3 bg-indigo-200 rounded-xl shadow">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base text-emerald-600 font-semibold mb-3">총 주문</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalStats.toLocaleString()}
                    <span className="ml-2 text-sm text-gray-900">건</span>
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl shadow">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base text-violet-600 font-semibold mb-3">성공 주문</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(statusStats.ACCEPTED || 0).toLocaleString()}
                    <span className="ml-2 text-sm text-gray-900">건</span>
                  </p>
                </div>
                <div className="p-3 bg-violet-200 rounded-xl shadow">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base text-rose-500 font-semibold mb-3">실패 주문</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(statusStats.FAILED || 0).toLocaleString()}
                    <span className="ml-2 text-sm text-gray-900">건</span>
                  </p>
                </div>
                <div className="p-3 bg-rose-200 rounded-xl shadow">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Chart Section */}
        <Card className="bg-gradient-to-br from-white to-slate-50 border border-gray-100 shadow-sm hover:shadow-md transition duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">월별 주문 성공 금액</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="shortMonth" tick={{ fontSize: 11, fill: "#666" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#666" }} width={35} />
                  <Bar dataKey="amount" fill="#6FA5FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>

      <div>
        <BottomNav />
      </div>
    </div>
  )
}