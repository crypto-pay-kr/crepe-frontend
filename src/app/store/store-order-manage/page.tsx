import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ChevronDown, ChevronUp, Home, ShoppingBag, User } from "lucide-react"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { TimeSelectionModal } from "@/components/order/time-selection-modal"
import { RejectionReasonModal } from "@/components/order/reject-reason-modal"
import Button from '@/components/common/Button'

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
  const [orders, setOrders] = useState<Order[]>([])
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage
        const response = await fetch('http://localhost:8080/store/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json()

        // Map API response to match the Order interface
        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order.orderId,
          number: order.orderId,
          type: order.orderType,
          status: order.status === "WAITING" ? "주문 접수" : order.status, // Map status
          items: order.orderDetails.map((detail: any) => ({
            name: detail.menuName,
            quantity: detail.menuCount,
          })),
          expanded: false, // Default to collapsed
        }))

        setOrders(mappedOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      }
    }

    fetchOrders()
  }, [])

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
      setTimeModalOpen(false)
    }
  }

  const handleReject = (reason: string) => {
    if (selectedOrderId) {
      console.log(`주문 ${selectedOrderId} 거절 사유: ${reason}`)
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "거절됨", rejectionReason: reason } : order,
        ),
      )
      setRejectionModalOpen(false)
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

  const isSeller = location.pathname.includes('/store')

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
      <Header title="주문 현황" />

      <main className="flex-1 bg-gray-100 overflow-auto">
        {orders.map((order) => (
          <div key={order.id} className="bg-white mb-2 border-b border-gray-200 mt-2">
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-bold">Order #{order.number}</h2>
                  <div className="flex items-center">
                    <p className="text-gray-600 text-base mr-2">{order.type}</p> 
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm`} 
                      style={{ color: "#0C2B5F" }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleToggleExpand(order.id)} className="p-1 rounded-full">
                  <img
                    src={order.expanded ? "/foldingbutton.png" : "/expandbutton.png"}
                    alt={order.expanded ? "Collapse" : "Expand"}
                    className="w-7 h-7"
                  />
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

      <div className="p-4 bg-gray-100">
        <Button text="가게 설정" onClick={handleStoreSettings} className="w-full py-4 bg-[#0a2e65] text-white rounded-md font-medium">
        </Button>
      </div>

      <BottomNav />

      <TimeSelectionModal isOpen={timeModalOpen} onClose={() => setTimeModalOpen(false)} onAccept={handleAccept} />
      <RejectionReasonModal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        onReject={handleReject}
      />
    </div>
  )
}