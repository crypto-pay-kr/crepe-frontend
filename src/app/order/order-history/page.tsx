import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import { OrderSection } from "@/components/coin/OrderSection";
import { Order } from "@/types/order";
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

  interface LocalOrder extends Order {
    orderDateRaw: string; // ISO 날짜 문자열
  }

  // 서버 응답 → 프런트 Order 형식으로 변환
  function mapToLocalOrder(data: ServerOrderResponse[]): LocalOrder[] {
    return data.map((item) => {
      // createdAt 은 ISO 날짜 문자열
      const rawDate = item.createdAt; // eg) "2025-05-10T01:31:57.886928"

      // 사람이 보기에 좋은 형식으로 변환 (예: "2025년 6월 7일 오후 12:31")
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
        // 새로 추가한 필드 (정렬용)
        orderDateRaw: rawDate,
      };
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const response = await getOrderHistory();
        // 1) 서버 응답을 로컬 Order 형식으로 변환
        let localOrders = mapToLocalOrder(response);

        // 2) orderDate를 기반으로 최신순(내림차순) 정렬
        localOrders = localOrders.sort(
          (a, b) =>
            new Date(b.orderDateRaw).getTime() - new Date(a.orderDateRaw).getTime()
        );

        // 3) 정렬된 결과를 setOrders
        setOrders(localOrders);
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