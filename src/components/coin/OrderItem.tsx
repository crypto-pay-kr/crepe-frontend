import { Check, ShoppingBag, X } from "lucide-react";
import ChevronRight from "../common/ChevronRight";
import { Order } from "@/constants/coinData";
import { useNavigate } from "react-router-dom"; 

interface OrderItemProps {
  order: Order;
}

export function OrderItem({ order }: OrderItemProps) {
  const navigate = useNavigate();
  const {
    id,
    status,   // WAITING | PAID | CANCELLED | COMPLETED
    reason,   // 거절 메시지 
    storeName,
    orderItems,
    orderDate,
    totalPrice,
    storeLocation
  } = order;

  // 상태 라벨
  function getStatusLabel(st: string, reason?: string) {
    switch (st) {
      case "WAITING":
        return "주문 접수";
      case "PAID":
        return "주문 수락";
      case "COMPLETED":
        return "준비 완료";
      case "CANCELLED":
        // 거절 사유 표시
        return `주문 거절${reason ? " - " + reason : ""}`;
      default:
        return "알 수 없는 상태";
    }
  }

  // 상태별 배지 색
  function getStatusBadgeColor(st: string) {
    switch (st) {
      case "WAITING":
      case "PAID":
      case "COMPLETED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  }

  const statusLabel = getStatusLabel(status, reason);
  const badgeColor = getStatusBadgeColor(status);

  // "WAITING", "PAID", "COMPLETED"는 ✔, "CANCELLED"는 ✖
  const isAccepted = ["WAITING", "PAID", "COMPLETED"].includes(status);

  return (
    <div className="mb-6 rounded-2xl bg-white shadow-md">
      <div className="flex items-center justify-between border-b p-6">
        <div className="flex items-center">
          <div className="relative mr-4">
            <ShoppingBag className="h-8 w-8" />
            <div
              className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${badgeColor}`}
            >
              {isAccepted ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <X className="h-4 w-4 text-white" />
              )}
            </div>
          </div>
          <p className="text-xl font-medium">주문번호 {id}</p>
        </div>
        <div className="text-base text-gray-500">
          <p>{statusLabel}</p>
        </div>
        <button
          onClick={() => navigate(`/mall/store/pay-complete/${id}`)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6">
        <p className="mb-3 text-lg font-medium">{storeName}</p>
        <div className="text-base text-gray-500">
          <p>{orderItems}</p>
          <p>주문금액: {totalPrice}</p>
          <p>주문점포: {storeLocation}</p>
          <p>주문일시: {orderDate}</p>
        </div>
      </div>
    </div>
  );
}