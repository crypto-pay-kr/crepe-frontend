import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import Button from "@/components/common/Button";
import OrderProgressBar from "@/components/order/OrderProcessBar";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import OrderStatusMessage from "@/components/order/OrderStatusMessage";
import { getOrderDetails } from "@/api/order";

export default function PayCompletePage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const getCurrentStep = (status: string): number => {
    switch (status) {
      case "WAITING":
        return 1;
      case "PAID":
        return 2;
      case "COMPLETED":
        return 3;
      default:
        return 1;
    }
  };

  useEffect(() => {
    if (!orderId) return;
    const fetchAndUpdate = async () => {
      try {
        const data = await getOrderDetails(orderId);
        setOrderDetails(data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };

    // 최초 한 번 호출
    fetchAndUpdate();

    const interval = setInterval(fetchAndUpdate, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  // 페이지 로드시 localStorage에서 totalPrice와 cartItems 제거
  useEffect(() => {
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("cartItems");
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header title="주문 요청" isStore={false} />
      <motion.div
        className="flex-grow"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="p-6">
          <motion.div variants={itemVariants}>
            <OrderStatusMessage orderStatus={orderDetails ? orderDetails.orderStatus : "WAITING"} />
          </motion.div>

          {/* 주문 상태에 따라 currentStep 업데이트 */}
          <motion.div variants={itemVariants}>
            <OrderProgressBar currentStep={orderDetails ? getCurrentStep(orderDetails.orderStatus) : 1} />
          </motion.div>

          <motion.div variants={itemVariants} className="my-8 transition-all duration-300 hover:shadow-lg rounded-xl">
            {orderDetails ? (
              <OrderSummaryCard
                orderId={orderDetails.orderId}
                totalPrice={orderDetails.totalPrice}
                orderStatus={orderDetails.orderStatus}
                orderType={orderDetails.orderType}
                orderDetails={orderDetails.orderDetails}
              />
            ) : (
              <p>주문 상세 정보를 불러오는 중...</p>
            )}
          </motion.div>

          <motion.div className="mt-6" variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              text="홈으로 돌아가기"
              onClick={() => navigate("/mall")}
              color="primary"
              className="py-4 rounded-xl text-base font-medium shadow-lg"
              fullWidth={true}
            />
          </motion.div>

          <motion.div className="mt-6 text-center text-gray-500 text-sm" variants={itemVariants}>
            {/* 추가 정보 */}
          </motion.div>
        </div>
      </motion.div>
      <BottomNav />
    </div>
  );
}