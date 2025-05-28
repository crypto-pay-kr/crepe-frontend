import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { TimeSelectionModal } from "@/components/order/time-selection-modal"
import { RejectionReasonModal } from "@/components/order/reject-reason-modal"
import Button from '@/components/common/Button'
import { fetchOrders, acceptOrder, rejectOrder, completeOrder } from "@/api/store"
import { useNotifications } from '@/hooks/useNotifications'
import NotificationPermissionModal from '@/components/common/NotificationPermissionModal'

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
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  // 알림 관련 hooks
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    requestPermission, 
    subscribeToPush,
    showOrderNotification 
  } = useNotifications()

  // 컴포넌트 마운트 시 알림 권한 확인
  useEffect(() => {
    if (isSupported && permission === 'default') {
      // 첫 방문 시 알림 권한 요청 모달 표시
      setShowNotificationModal(true)
    }
  }, [isSupported, permission])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders(); 
        // 응답 데이터에서 주문 정보 매핑
        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order.orderId,
          number: order.orderId,
          type: order.orderType,
          status: order.status === "WAITING" ? "주문 접수" : order.status,
          items: order.orderDetails.map((detail: any) => ({
            name: detail.menuName,
            quantity: detail.menuCount,
          })),
          expanded: false,
        }));
        
        // 기존 주문과 비교하여 새 주문 감지
        const previousOrderIds = orders.map(order => order.id)
        const newOrders = mappedOrders.filter(order => !previousOrderIds.includes(order.id))
        
        // 새 주문이 있으면 알림 표시
        if (newOrders.length > 0 && orders.length > 0) {
          newOrders.forEach(order => {
            handleNewOrder({
              orderId: order.id,
              orderType: order.type,
              items: order.items
            })
          })
        }
        
        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    loadOrders();
  }, []);

  // 새 주문이 들어왔을 때 알림 표시
  const handleNewOrder = async (orderData: any) => {
    if (permission === 'granted') {
      const itemsText = orderData.items.map((item: OrderItem) => 
        `${item.name} ${item.quantity}개`
      ).join(', ')
      
      await showOrderNotification({
        orderId: orderData.orderId,
        type: 'new_order',
        message: `새로운 주문이 접수되었습니다: ${orderData.orderType}`,
        details: itemsText,
        storeName: '내 가게'
      })
    }
  }

  // 알림 권한 허용 처리
  const handleNotificationAllow = async () => {
    await requestPermission()
    if (permission === 'granted') {
      await subscribeToPush()
    }
    setShowNotificationModal(false)
  }

  const handleToggleExpand = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, expanded: !order.expanded } : order)))
  }

  // ------------------------------------
  //    OPEN MODALS
  // ------------------------------------
  const handleOpenAcceptModal = (id: string) => {
    setSelectedOrderId(id);
    setTimeModalOpen(true);
  };

  const handleOpenRejectModal = (id: string) => {
    setSelectedOrderId(id);
    setRejectionModalOpen(true);
  };

  // ------------------------------------
  //    API CALLS
  // ------------------------------------
  // 주문 수락
  const handleAccept = async (time: string) => {
    if (!selectedOrderId) return;
    try {

      const response = await acceptOrder(selectedOrderId, time);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 주문 상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "수락 완료", timeRemaining: parseInt(time) } : order,
        ),
      );

      // 주문 수락 알림
      if (permission === 'granted') {
        await showOrderNotification({
          orderId: selectedOrderId,
          type: 'order_accepted',
          message: `주문이 수락되었습니다 (${time}분 소요 예정)`,
          storeName: '내 가게'
        })
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    } finally {
      setTimeModalOpen(false);
    }
  };

  // 주문 거절
  const handleReject = async (reason: string) => {
    if (!selectedOrderId) return;
    try {

      const response = await rejectOrder(selectedOrderId, reason);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      //  상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: "거절됨", rejectionReason: reason } : order,
        ),
      );

      // 주문 거절 알림
      if (permission === 'granted') {
        await showOrderNotification({
          orderId: selectedOrderId,
          type: 'order_rejected',
          message: `주문이 거절되었습니다`,
          details: `사유: ${reason}`,
          storeName: '내 가게'
        })
      }
    } catch (error) {
      console.error("Failed to refuse order:", error);
    } finally {
      setRejectionModalOpen(false);
    }
  };

  // 주문 완료
  const handlePrepareComplete = async (id: string) => {
    try {

      const response = await completeOrder(id);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: "준비 완료", timeRemaining: undefined } : order,
        ),
      );

      // 주문 완료 알림
      if (permission === 'granted') {
        await showOrderNotification({
          orderId: id,
          type: 'order_completed',
          message: `주문이 준비 완료되었습니다`,
          storeName: '내 가게'
        })
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
    }
  };

  const handleCancelPrepareComplete = (id: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status: "수락 완료", timeRemaining: 15 } : order)))
  }

  const handleStoreSettings = () => {
    navigate("/store/manage")
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

      {/* 알림 권한 요청 모달 */}
      <NotificationPermissionModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        onAllow={handleNotificationAllow}
        onDeny={() => setShowNotificationModal(false)}
      />
    </div>
  )
}