import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown, ChevronUp, Home, ShoppingBag, User } from "lucide-react"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { TimeSelectionModal } from "@/components/order/time-selection-modal"
import { RejectionReasonModal } from "@/components/order/reject-reason-modal"



interface OrderItem {
  name: string
  quantity: number
}

interface Order {
  id: string
  number: string
  type: string
  status: string
  items: OrderItem[]
  timeRemaining?: number
  expanded: boolean
  rejectionReason?: string
}

export default function OrderStatusPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      number: "90897",
      type: "매장 식사",
      status: "주문 접수",
      items: [
        { name: "일반 감자수", quantity: 5 },
        { name: "양념 감자수", quantity: 2 },
        { name: "새우튀김", quantity: 1 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
      ],
      expanded: true,
    },
    {
      id: "2",
      number: "90897",
      type: "포장 주문",
      status: "수락 완료",
      timeRemaining: 15,
      items: [
        { name: "일반 감자수", quantity: 5 },
        { name: "양념 감자수", quantity: 2 },
        { name: "새우튀김", quantity: 1 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
      ],
      expanded: true,
    },
    {
      id: "3",
      number: "90897",
      type: "포장 주문",
      status: "준비 완료",
      items: [
        { name: "일반 감자수", quantity: 5 },
        { name: "양념 감자수", quantity: 2 },
        { name: "새우튀김", quantity: 1 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
      ],
      expanded: true,
    },
    {
      id: "4",
      number: "90897",
      type: "포장 주문",
      status: "종료",
      items: [
        { name: "일반 감자수", quantity: 5 },
        { name: "양념 감자수", quantity: 2 },
        { name: "새우튀김", quantity: 1 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
        { name: "보링핫식", quantity: 2 },
      ],
      expanded: true,
    },
  ])

  // 모달 상태 관리
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const handleToggleExpand = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, expanded: !order.expanded } : order)))
  }

  const handleOpenAcceptModal = (id: string) => {
    setSelectedOrderId(id)
    setTimeModalOpen(true)
  }

  const handleOpenRejectModal = (id: string) => {
    setSelectedOrderId(id)
    setRejectionModalOpen(true)
  }

  const handleAccept = (time: number) => {
    if (selectedOrderId) {
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "수락 완료", timeRemaining: time } : order,
        ),
      )
      setTimeModalOpen(false) // 모달 닫기
    }
  }

  const handleReject = (reason: string) => {
    if (selectedOrderId) {
      console.log(`주문 ${selectedOrderId} 거절 사유: ${reason}`)
      // 상태를 '거절됨'으로 변경하고 거절 사유 저장
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "거절됨", rejectionReason: reason } : order,
        ),
      )
      setRejectionModalOpen(false) // 모달 닫기
    }
  }

  const handlePrepareComplete = (id: string) => {
    setOrders(
      orders.map((order) => (order.id === id ? { ...order, status: "준비 완료", timeRemaining: undefined } : order)),
    )
  }

  const handleCancelPrepareComplete = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "수락 완료", timeRemaining: 15 } : order)))
  }

  const handleStoreSettings = () => {
    navigate("/store-settings")
  }
  
  const isSeller = location.pathname.includes('/store');
  const navItems = [
      {
        icon: <Home className="w-6 h-6" color="white" />,
        label: "홈",
        isActive: false,
        onClick: () => navigate("/")
      },
      {
        icon: <ShoppingBag className="w-6 h-6" color="white" />,
        label: "쇼핑몰",
        isActive: false,
        onClick: () => navigate("/shop")
      },
      {
        icon: <User className="w-6 h-6" color="white" />,
        label: "마이페이지",
        isActive: true,
        onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
      }
    ];
    
  // 상태에 따른 배경색 클래스 반환
  const getStatusColor = (status: string) => {
    switch (status) {
      case "주문 접수":
        return "bg-blue-100 text-blue-800"
      case "수락 완료":
        return "bg-yellow-100 text-yellow-800"
      case "준비 완료":
        return "bg-green-100 text-green-800"
      case "거절됨":
        return "bg-red-100 text-red-800"
      case "종료":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header title="주문 현황"  />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 bg-gray-100 overflow-auto">
        {orders.map((order) => (
          <div key={order.id} className="bg-white mb-2 border-b border-gray-200">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-bold">Order #{order.number} - N분 전</h2>
                  <div className="flex items-center">
                    <p className="text-gray-600 text-sm mr-2">{order.type}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleToggleExpand(order.id)} className="p-1 rounded-full bg-gray-100">
                  {order.expanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>

              {order.expanded && (
                <div className="mt-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1 text-sm">
                      <span>{item.name}</span>
                      <span>{item.quantity}개</span>
                    </div>
                  ))}
                  
                  {/* 거절된 주문에 대한 거절 사유 표시 */}
                  {order.status === "거절됨" && order.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded-md">
                      <p className="text-red-600 text-sm font-medium">거절 사유: {order.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 flex justify-between">
                {order.status === "주문 접수" && (
                  <>
                    <button
                      onClick={() => handleOpenRejectModal(order.id)}
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-md"
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleOpenAcceptModal(order.id)}
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md"
                    >
                      수락
                    </button>
                  </>
                )}

                {order.status === "수락 완료" && (
                  <>
                    <div className="px-4 py-2 bg-red-100 text-red-600 rounded-md">{order.timeRemaining}분 남음</div>
                    <button
                      onClick={() => handlePrepareComplete(order.id)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md"
                    >
                      준비 완료
                    </button>
                  </>
                )}

                {order.status === "준비 완료" && (
                  <button
                    onClick={() => handleCancelPrepareComplete(order.id)}
                    className="ml-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md"
                  >
                    준비 완료 취소
                  </button>
                )}

                {order.status === "종료" && (
                  <div className="ml-auto px-4 py-2 bg-gray-100 text-gray-500 rounded-md">완료됨</div>
                )}
                
                {order.status === "거절됨" && (
                  <div className="ml-auto px-4 py-2 bg-red-100 text-red-500 rounded-md">거절됨</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* 가게 설정 버튼 */}
      <div className="p-4 bg-gray-100">
        <button onClick={handleStoreSettings} className="w-full py-4 bg-[#0a2e65] text-white rounded-md font-medium">
          가게 설정
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav />

      {/* 모달 컴포넌트 */}
      <TimeSelectionModal isOpen={timeModalOpen} onClose={() => setTimeModalOpen(false)} onAccept={handleAccept} />
      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onReject={handleReject}
      />
    </div>
  )
}