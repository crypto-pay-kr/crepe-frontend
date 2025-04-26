import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { Home, ShoppingBag, User } from "lucide-react"


export default function PayCompletePage() {
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="주문 요청" isStore={false} />
      <motion.div
        className="flex-grow bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="p-4">
          <div className="text-center text-xl font-bold my-6">주문이 접수되었습니다.</div>

          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#002169] text-white flex items-center justify-center mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-xs text-[#002169] font-medium">주문요청</div>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mb-2">
                2
              </div>
              <div className="text-xs text-gray-500">주문확인</div>
            </div>
            <div className="w-16 h-1 bg-gray-300"></div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center mb-2">
                3
              </div>
              <div className="text-xs text-gray-500">준비완료</div>
            </div>
          </div>

          <div className="border rounded-lg p-4 mb-4">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold">Order #90897</div>
                <div className="text-xs text-green-500">주문 완료</div>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-1">명동 칼국수 마장동</div>
            <div className="text-xs text-gray-500">
              <div>칼국수 외 1개</div>
              <div>주문일시: 2024년 12월 20일 19시 52분</div>
              <div>주문번호: 11YP0000PM12</div>
              <div>주문매장: 테스트시...</div>
            </div>
          </div>
        </div>
        <div className="p-4 mt-auto">
          <button
            className="bg-[#002169] text-white h-12 rounded-md font-medium w-full"
            onClick={() => navigate("/mall")}
          >
            확인
          </button>
        </div>
      </motion.div>
      <BottomNav/>
    </div>
  )
}
