import React from "react";
import { motion } from "framer-motion";
import PaymentOptionCard from "./PaymentOptionCard";
import { PaymentOption } from "@/constants/paymentOption";


interface PaymentOptionsListProps {
  options: PaymentOption[];
  selectedPaymentId: string | null;
  onSelectPayment: (id: string) => void;
}

export default function PaymentOptionsList({ 
  options, 
  selectedPaymentId, 
  onSelectPayment 
}: PaymentOptionsListProps) {
  return (
    <div className="space-y-4 h-96">
      {options.map((option, index) => (
        <PaymentOptionCard 
          key={option.id}
          option={option}
          isSelected={selectedPaymentId === option.id}
          onSelect={onSelectPayment}
          animationDelay={0.2 + index * 0.1}
        />
      ))}
    </div>
  );
}