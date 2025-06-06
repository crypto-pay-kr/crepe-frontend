import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"
import { TimeSelectionModal } from "@/components/order/time-selection-modal"
import { RejectionReasonModal } from "@/components/order/reject-reason-modal"
import Button from '@/components/common/Button'
import { toast } from "react-toastify";
import { ApiError } from "@/error/ApiError";
import { fetchOrders, handleOrderAction } from "@/api/store";

interface OrderItem {
  name: string
  quantity: number
}

interface Order {
  id: string
  number: string
  clientOrderNumber?: string 
  type: string
  status: string
  items: OrderItem[]
  readyAt?: string // 예상 마감 시간
  expanded: boolean
  rejectionReason?: string
  createdAt?: string // 주문 생성 시간 추가
  updatedAt?: string // 주문 업데이트 시간 추가
  isNew?: boolean // 신규 주문 표시용 (프론트엔드에서 계산)
  isJustAdded?: boolean // 방금 추가된 주문 (애니메이션용, 프론트엔드에서 계산)
}

export default function OrderStatusPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [orders, setOrders] = useState<Order[]>([])
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [previousOrderIds, setPreviousOrderIds] = useState<Set<string>>(new Set())
  const [updatedAtMap, setUpdatedAtMap] = useState<Map<string, string>>(new Map())
  const [audioPlayCount, setAudioPlayCount] = useState<Map<string, number>>(new Map())
  const [audioEnabled, setAudioEnabled] = useState(false) // 오디오 활성화 상태
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 커스텀 CSS 스타일 추가
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slide-down {
        0% {
          opacity: 0;
          transform: translateY(-50px);
          scale: 0.95;
        }
        100% {
          opacity: 1;
          transform: translateY(0);
          scale: 1;
        }
      }
      
      @keyframes pulse-border {
        0%, 100% {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        50% {
          border-color: #1d4ed8;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5);
        }
      }
      
      .animate-slide-down {
        animation: slide-down 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }
      
      .animate-pulse-border {
        animation: pulse-border 2s ease-in-out infinite;
      }
      
      .new-order-indicator {
        position: relative;
        overflow: hidden;
      }
      
      .new-order-indicator::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #3b82f6, transparent);
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 오디오 초기화
  useEffect(() => {
    const enableAudio = () => {
      audioRef.current = new Audio('/new-order.mp3');
      audioRef.current.preload = 'auto';
      setAudioEnabled(true); // 오디오 활성화
    };

    document.addEventListener('click', enableAudio, { once: true }); // 첫 클릭 시 오디오 활성화

    return () => {
      document.removeEventListener('click', enableAudio);
    };
  }, []);

  // 새 주문 알림 사운드 재생 (WAITING 상태의 신규 주문만, 주문당 최대 3번)
  const playNewOrderSound = (orderId: string) => {
    if (!audioEnabled || !audioRef.current) return;

    const currentCount = audioPlayCount.get(orderId) || 0;

    if (currentCount < 3) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      setAudioPlayCount(prev => new Map(prev).set(orderId, currentCount + 1));
    }
  }

  // 남은 시간 계산 함수
  const calculateTimeRemaining = (readyAt?: string, orderId?: string) => {
    if (!readyAt || !orderId) return null;

    const updatedAt = updatedAtMap.get(orderId); // 상태에서 updatedAt 가져오기
    if (!updatedAt) return null;

    const updatedTime = new Date(updatedAt);
    const readyTime = new Date(readyAt);
    const diffInMs = readyTime.getTime() - updatedTime.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes > 0) {
      return `${diffInMinutes}분 남음`;
    } else if (diffInMinutes < 0) {
      return `${Math.abs(diffInMinutes)}분 초과`;
    } else {
      return "-";
    }
  };

  // 신규 주문 판별 함수 (5분 이내 + WAITING 상태만) - 프론트엔드에서 계산
  const isNewOrder = (order: any) => {
    if (!order.createdAt) return false;

    const now = new Date();
    const orderTime = new Date(order.createdAt);
    const timeDiff = (now.getTime() - orderTime.getTime()) / 1000 / 60; // 분 단위

    // 5분 이내이고 "주문 접수"(WAITING) 상태인 경우만 신규 주문으로 표시
    return timeDiff <= 5 && order.status === "주문 접수";
  };

  // 준비완료 상태에서 5분 경과 시 종료 처리 함수
  const shouldExpireOrder = (order: any) => {
    if (order.status !== "준비 완료" || !order.updatedAt) return false;

    const now = new Date();
    const updatedAt = new Date(order.updatedAt);
    const timeDiff = (now.getTime() - updatedAt.getTime()) / 1000 / 60; // 분 단위

    return timeDiff >= 10;
  };

  const statusMap = {
    "WAITING": "주문 접수",
    "PAID": "수락 완료",
    "REFUSED": "주문 거절",
    "COMPLETED": "준비 완료",
    "EXPIRED": "종료",
  };

  // 주문 데이터 로드 함수// 주문 데이터 로드 함수
  const loadOrders = async () => {
    try {
      const data = await fetchOrders();

      const mappedOrders: Order[] = data.map((order: any) => ({
        id: order.orderId,
        clientOrderNumber: order.clientOrderNumber, // 클라이언트 주문 번호
        number: order.orderId,
        type: order.orderType,
        status: statusMap[order.status as keyof typeof statusMap] || order.status,
        items: order.orderDetails.map((detail: any) => ({
          name: detail.menuName,
          quantity: detail.menuCount,
        })),
        expanded: false,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: order.updatedAt || new Date().toISOString(),
        readyAt: order.readyAt, // 서버에서 받아온 예상 마감 시간
        isNew: false, // 일단 false로 설정, 아래에서 계산
        isJustAdded: false,
      }));

      // 최신순으로 정렬 (createdAt 기준)
      const sortedOrders = mappedOrders.sort((a, b) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      // 프론트엔드에서 isNew 계산 및 자동 종료 처리
      const ordersWithNewFlag = sortedOrders.map(order => {
        // 준비완료 상태에서 5분 경과 시 자동으로 종료 상태로 변경
        if (shouldExpireOrder(order)) {
          return {
            ...order,
            status: "종료",
            isNew: false
          };
        }

        return {
          ...order,
          isNew: isNewOrder(order)
        };
      });

      // 신규 주문 감지 (이전에 없던 주문ID + WAITING 상태만)
      const currentOrderIds = new Set(ordersWithNewFlag.map(order => order.id));
      const newWaitingOrderIds = [...currentOrderIds].filter(id => {
        const order = ordersWithNewFlag.find(o => o.id === id);
        return !previousOrderIds.has(id) && order?.status === "주문 접수";
      });

      if (newWaitingOrderIds.length > 0 && previousOrderIds.size > 0) {
        // WAITING 상태의 신규 주문이 있고, 처음 로드가 아닌 경우
        newWaitingOrderIds.forEach(orderId => playNewOrderSound(orderId));

        // 방금 추가된 WAITING 주문만 애니메이션 적용
        const ordersWithAnimation = ordersWithNewFlag.map(order => ({
          ...order,
          isJustAdded: newWaitingOrderIds.includes(order.id)
        }));

        setOrders(ordersWithAnimation);

        // 애니메이션 완료 후 isJustAdded 제거
        setTimeout(() => {
          setOrders(prev => prev.map(order => ({ ...order, isJustAdded: false })));
        }, 600);
      } else {
        setOrders(ordersWithNewFlag);
      }

      setPreviousOrderIds(currentOrderIds);

      // updatedAt 상태를 서버에서 불러온 값으로 동기화
      const updatedAtFromServer = new Map(
        mappedOrders.map((order) => [order.id, order.updatedAt || new Date().toISOString()])
      );
      setUpdatedAtMap(updatedAtFromServer);

    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  // 초기 로드 및 5초마다 자동 새로고침
  useEffect(() => {
    loadOrders(); // 초기 로드

    // 5초마다 주문 새로고침
    intervalRef.current = setInterval(() => {
      loadOrders();
    }, 5000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
      const updatedAt = new Date().toISOString();
      const readyAt = new Date(Date.now() + parseInt(time) * 60 * 1000).toISOString();

      await handleOrderAction(selectedOrderId, "accept", { preparationTime: time });

      setUpdatedAtMap((prev) => new Map(prev).set(selectedOrderId, updatedAt));

      // 주문 상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: "수락 완료", readyAt, isNew: false }
            : order
        )
      );
      toast.success("주문이 수락되었습니다.");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    } finally {
      setTimeModalOpen(false);
    }
  };

  // 주문 거절
  const handleReject = async (reason: string) => {
    if (!selectedOrderId) return;
    try {
      await handleOrderAction(selectedOrderId, "refuse", { refusalReason: reason });

      // 주문 상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: "주문 거절", rejectionReason: reason, isNew: false }
            : order
        )
      );

      toast.success("주문이 거절되었습니다.");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    } finally {
      setRejectionModalOpen(false);
    }
  };

  // 준비 완료
  const handlePrepareComplete = async (id: string) => {
    try {
      await handleOrderAction(id, "complete");

      // 주문 상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? { ...order, status: "준비 완료", readyAt: undefined }
            : order
        )
      );

      toast.success("준비가 완료되었습니다.");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    }
  };

  // 준비 완료 취소
  const handleCancelPrepareComplete = async (id: string, readyAt: string) => {
    const now = new Date();
    const readyTime = new Date(readyAt);
    const diffInMs = readyTime.getTime() - now.getTime();
    const diffInMinutes = Math.ceil(Math.floor(diffInMs / (1000 * 60)) / 10) * 10;
    const finalMinutes = diffInMinutes >= 0 ? `${diffInMinutes}분` : "10분";

    try {
      await handleOrderAction(id, "cancel", { preparationTime: finalMinutes });

      // 주문 상태 업데이트
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? { ...order, status: "수락 완료", readyAt: finalMinutes }
            : order
        )
      );
      toast.success("준비 완료가 취소되었습니다.");
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`);
      } else {
        toast.error("예기치 못한 오류가 발생했습니다.");
      }
    }
  };


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
      case "주문 거절":
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

      {/* 오디오 상태는 이제 항상 활성화되므로 알림 제거 */}

      <main className="flex-1 bg-gray-100 overflow-auto">
        {orders.map((order, index) => (
          <div
            key={order.id}
            className={`bg-white mb-2 border-b border-gray-200 mt-2 transition-all duration-300 ease-out ${order.isJustAdded
              ? 'animate-slide-down'
              : ''
              } ${order.isNew
                ? 'new-order-indicator animate-pulse-border border-2'
                : 'border'
              }`}
            style={{
              animationDelay: order.isJustAdded ? `${index * 100}ms` : '0ms'
            }}
          >
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold">{order.clientOrderNumber}번</h2>
                    {order.isNew && (
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-bounce">
                          NEW!
                        </span>
                        <span className="text-xs text-red-500 font-semibold">
                          (5분 이내)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-600 text-base mr-2">{order.type}</p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-sm ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                      주문 번호 #{order.number}
                    </p>
                  {order.createdAt && (
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </p>
                  )}
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

                  {(order.status === "주문 거절" || order.status === "거절됨") && order.rejectionReason && (
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
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                    >
                      거절
                    </button>
                    <button
                      onClick={() => handleOpenAcceptModal(order.id)}
                      className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      수락
                    </button>
                  </>
                )}

                {(order.status === "수락 완료" || order.status === "준비 완료 취소") && (
                  <>
                    <div className={`px-4 py-2 rounded-md ${order.readyAt && new Date(order.readyAt) < new Date()
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                      }`}>
                      {calculateTimeRemaining(order.readyAt, order.id) || "시간 정보 없음"}
                    </div>
                    <button
                      onClick={() => handlePrepareComplete(order.id)}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      준비 완료
                    </button>
                  </>
                )}

                {order.status === "준비 완료" && order.readyAt && (
                  <button
                    onClick={() => handleCancelPrepareComplete(order.id, order.readyAt || "10분")}
                    className="ml-auto px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    준비 완료 취소
                  </button>
                )}

                {/* 종료 상태일 때는 버튼 표시하지 않음 */}
                {order.status === "종료" && (
                  <div className="ml-auto px-4 py-2 bg-gray-100 text-gray-500 rounded-md">완료됨</div>
                )}

                {(order.status === "주문 거절" || order.status === "거절됨") && (
                  <div className="ml-auto px-4 py-2 bg-red-100 text-red-500 rounded-md">거절됨</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">주문이 없습니다.</p>
          </div>
        )}
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