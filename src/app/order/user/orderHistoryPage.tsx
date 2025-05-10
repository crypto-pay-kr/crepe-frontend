import { ShoppingCart } from "lucide-react";
import React from "react";
import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNavigate';
import { OrderSection } from '@/components/coin/OrderSection';
import { Order } from "@/constants/coinData";

const SAMPLE_ORDERS: Order[] = [
  {
    id: "90897",
    status: "completed",
    storeName: "명동 칼국수 마장동",
    orderItems: "칼국수 외 1개",
    orderDate: "2024년 12월 20일 9시 52분",
    orderNumber: "11YPD000PM12",
    storeLocation: "명동지점",
  },
  {
    id: "90897",
    status: "cancelled",
    reason: "자리 없음",
    storeName: "명동 칼국수 마장동",
    orderItems: "칼국수 외 1개",
    orderDate: "2024년 12월 20일 9시 52분",
    orderNumber: "11YPD000PM12",
    storeLocation: "명동지점",
  },
];

export default function OrderHistory() {
  return (
    <div className="flex h-full flex-col bg-gray-50">
      <Header title="주문 내역" />
      <main className="flex-1 overflow-auto px-4 py-6">
        <OrderSection orders={SAMPLE_ORDERS} />
      </main>
      <BottomNav />
    </div>
  );
}
