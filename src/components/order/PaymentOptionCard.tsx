import React from "react";
import { motion } from "framer-motion";
import RadioButton from "./radioButton";
import { PaymentOption } from "@/constants/paymentOption";
import PaymentInfo from "./PaymentInfo";

interface PaymentOptionCardProps {
  option: PaymentOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
  animationDelay: number;
}

export default function PaymentOptionCard({
  option,
  isSelected,
  onSelect,
  animationDelay,
}: PaymentOptionCardProps) {
  return (
    <motion.div
      className={`p-4 rounded-lg border ${
        isSelected ? "border-[#002169]" : "border-gray-200"
      } ${option.insufficientBalance ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={() => {
        if (!option.insufficientBalance) {
          onSelect(option.id);
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      whileHover={!option.insufficientBalance ? { scale: 1.02 } : {}}
      whileTap={!option.insufficientBalance ? { scale: 0.98 } : {}}
    >
      <div className="flex justify-between items-center">
        <PaymentInfo option={option} />
        <RadioButton isSelected={isSelected} />
      </div>
    </motion.div>
  );
}