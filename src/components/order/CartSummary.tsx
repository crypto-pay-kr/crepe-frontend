import React from "react";
import Button from "@/components/common/Button";

interface CartSummaryProps {
    totalPrice: number;
    onCheckoutClick: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, onCheckoutClick }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                결제 정보
            </h2>
            
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-gray-600">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()} KRW</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>배송비</span>
                    <span>0 KRW</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>할인 금액</span>
                    <span>0 KRW</span>
                </div>
            </div>
            
            <div className="flex justify-between items-center py-4 border-t border-b mb-6">
                <span className="font-medium text-gray-800">총 결제 금액</span>
                <span className="font-bold text-xl text-blue-700">{totalPrice.toLocaleString()} KRW</span>
            </div>
            
            <Button
                text="결제수단 선택"
                onClick={onCheckoutClick}
                className="w-full py-3 rounded-lg font-medium bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-md"
            />
        </div>
    );
};

export default CartSummary;