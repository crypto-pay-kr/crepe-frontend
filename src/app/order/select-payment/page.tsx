"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import BottomNav from "@/components/common/BottomNavigate"
import { Home, ShoppingBag, User } from "lucide-react";
import Header from "@/components/common/Header"
import Button from "@/components/common/Button"


export default function OrderPage() {
    const navigate = useNavigate();
    const [usePoints, setUsePoints] = useState(false)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)


    const isSeller = false; // 판매자인지 여부를 확인하는 변수 (예시)

    const handlePaymentSelect = (method: string) => {
        setSelectedPayment(method)
    }

    const handlePayment = () => {
        if (selectedPayment === "SOL") {
            // SOL 잔액 부족 시 충전 페이지로 이동
            navigate("/coin/deposit")
        } else {
            // 정상 결제 진행
            navigate("/order/loading")
        }
    }


    const paymentOptions = [
        { id: "KRW", label: "KRW", amount: "33,000 KRW", insufficientBalance: false },
        { id: "XRP", label: "XRP", amount: "9.9 XRP", insufficientBalance: false },
        { id: "SOL", label: "SOL", amount: "0.4 SOL", insufficientBalance: true },
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <Header title="결제수단 선택" isStore={false} />
            <div className="flex-grow page-container bg-white pb-0 pt-5">
                <div className="p-4 min-h-[70vh]">
                    <motion.div
                        className="flex items-center mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                    </motion.div>

                    <div className="space-y-4 h-96">
                        {paymentOptions.map((option, index) => (
                            <motion.div
                                key={option.id}
                                className={`p-4 rounded-lg border ${selectedPayment === option.id ? "border-[#002169]" : "border-gray-200"
                                    }`}
                                onClick={() => handlePaymentSelect(option.id)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        <div className="flex items-center">
                                            <span className="text-lg font-bold">{option.amount}</span>
                                            {option.insufficientBalance && <span className="ml-2 text-sm text-red-500">잔액 부족</span>}
                                        </div>
                                    </div>
                                    <motion.div
                                        className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                                        animate={{
                                            borderColor: selectedPayment === option.id ? "#002169" : "#d1d5db",
                                            boxShadow: selectedPayment === option.id ? "0 0 0 2px rgba(0, 33, 105, 0.2)" : "none",
                                        }}
                                    >
                                        {selectedPayment === option.id && (
                                            <motion.div
                                                className="w-4 h-4 rounded-full bg-[#002169]"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-auto">
                    <Button
                        text="주문하기"
                        onClick={() => navigate("/mall/store/order-pending")}
                        className="mx-4 rounded-[9px] font-medium bg-[#0C2B5F] text-white py-2 px-4"
                    />
                </div>
            </div>
            <BottomNav/>
        </div>
    )
}
