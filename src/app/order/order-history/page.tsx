import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import { OrderSection } from "@/components/coin/OrderSection";
import { Order } from "@/constants/coinData";
import { getOrderHistory } from "@/api/order";

export default function MyOrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  // 서버 응답 타입
  interface ServerOrderResponse {
    orderId: string;
    totalPrice: number;
    orderStatus: string;        // "WAITING" | "PAID" | "CANCELLED" | "COMPLETED" 등
    message?: string;           // 거절 사유 예) "주문이 거절되었습니다. 사유 : 재고없음"
    orderType: string;          // "TAKE_OUT" 등
    storeName: string;
    storeAddress: string;
    createdAt: string;          // ISO string ex) "2025-05-10T01:31:57.886928"
    orderDetails: {
      menuName: string;
      menuCount: number;
      menuPrice: number;
    }[];
  }

  // 서버 응답 → 프런트 Order 형식으로 변환
  function mapToLocalOrder(data: ServerOrderResponse[]): Order[] {
    return data.map((item) => {
      // createdAt 날짜 포맷
      const dateObj = new Date(item.createdAt);
      const formattedDate = dateObj.toLocaleString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });

      return {
        // 기존 Order 구성
        id: item.orderId,
        // 백엔드의 orderStatus를 그대로 기록 (WAITING, PAID, CANCELLED, COMPLETED 등)
        status: item.orderStatus,
        reason: item.message || "", // 'message'를 'reason' 속성에 매핑
        storeName: item.storeName,
        orderItems: item.orderDetails
          .map((detail) => `${detail.menuName} x ${detail.menuCount}`)
          .join(", "),
        orderDate: formattedDate,
        orderNumber: item.orderId,
        totalPrice: item.totalPrice.toString(),
        storeLocation: item.storeAddress,
      };
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await getOrderHistory(); 
        setOrders(mapToLocalOrder(response));
      } catch (err) {
        console.error("Failed to fetch order history:", err);
      }
    })();
  }, []);

  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="주문 내역" />
      <main className="flex-1 overflow-auto px-4 py-6">
        <OrderSection orders={orders} />
      </main>
      <BottomNav />
    </div>
  );
}