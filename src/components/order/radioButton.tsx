import React from "react";
import { motion } from "framer-motion";

interface RadioButtonProps {
  isSelected: boolean;
}

export default function RadioButton({ isSelected }: RadioButtonProps) {
  return (
    <motion.div
      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
      animate={{
        borderColor: isSelected ? "#4B5EED" : "#d1d5db",
        boxShadow: isSelected ? "0 0 0 2px rgba(0, 33, 105, 0.2)" : "none",
      }}
    >
      {isSelected && (
        <motion.div
          className="w-4 h-4 rounded-full bg-[#4B5EED]"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
}