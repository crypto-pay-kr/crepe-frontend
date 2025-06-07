import React from "react";
import { PaymentOption } from "@/constants/paymentOption";
import PaymentOptionCard from "./PaymentOptionCard";

interface PaymentOptionsListProps {
  options: PaymentOption[];
  selectedPaymentId: string | null;
  onSelectPayment: (id: string) => void;
}

const PaymentOptionsList: React.FC<PaymentOptionsListProps> = ({
  options,
  selectedPaymentId,
  onSelectPayment,
}) => {
  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <PaymentOptionCard
        key={`${option.type}-${option.id}`} // 고유한 key 설정
        option={option}
        isSelected={selectedPaymentId === option.id}
        onSelect={onSelectPayment}
        animationDelay={index * 0.1} // 애니메이션 딜레이 추가
        />
      ))}
    </div>
  );
};

export default PaymentOptionsList;