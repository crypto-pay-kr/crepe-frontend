import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import PaymentOptionsList from "@/components/order/PaymentOptionList";
import { PaymentOption } from "@/constants/paymentOption";


export default function SelectPaymentPage() {
    const navigate = useNavigate();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    const paymentOptions: PaymentOption[] = [
        { id: "KRW", label: "KRW", amount: "33,000 KRW", insufficientBalance: false },
        { id: "XRP", label: "XRP", amount: "9.9 XRP", insufficientBalance: false },
        { id: "SOL", label: "SOL", amount: "0.4 SOL", insufficientBalance: true },
    ];

    const handlePaymentSelect = (method: string) => {
        setSelectedPayment(method);
    };

    const handlePayment = () => {
        if (!selectedPayment) return;
        
        const selectedOption = paymentOptions.find(option => option.id === selectedPayment);
        
        if (selectedOption?.insufficientBalance) {
        navigate("/mall/store/order");
        } else {
        navigate("/mall/store/order-pending");
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
        <Header title="결제수단 선택" isStore={false} />
        
        <div className="flex-grow page-container bg-white pb-0 pt-5">
            <div className="p-4 min-h-[70vh]">
            <PaymentOptionsList 
                options={paymentOptions} 
                selectedPaymentId={selectedPayment} 
                onSelectPayment={handlePaymentSelect} 
            />
            </div>
            
            <div className="flex justify-center mt-auto px-4 pb-4">
            <Button
                text="주문하기"
                onClick={handlePayment}
                color="primary"
                disabled={!selectedPayment}
                fullWidth={true}
            />
            </div>
        </div>
        
        <BottomNav />
        </div>
    );
}