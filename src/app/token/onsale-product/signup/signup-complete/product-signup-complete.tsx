import React from "react";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import AutoDebitInfo from "@/components/token/signup/AutoDebitInfo";
import SignUpCompleteBanner from "@/components/token/signup/SignUpCompleteBanner";
import SignUpCompleteProductInfo from "@/components/token/signup/SignUpCompleteProductInfo";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TokenProductSignupComplete() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/my/coin");
  };

  // 실제 데이터(예시)
  const signupInfo = {
    productName: "청년도약토큰",
    startDate: "2025.05.09",
    endDate: "2026.05.09",
    monthlyAmount: "500,000원",
    baseRate: "연 3.7%(세전)",
    preferentialRate: "연 1.3%(세전)",
    finalRate: "연 5.0%(세전)",
  };
  const autoDebitInfo = {
    account: "우리은행 1002-123-456789",
    transferDay: "매월 25일",
    amount: "500,000원",
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="가입 완료" />

      <motion.div
        className="flex-1 overflow-auto p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUpCompleteBanner
          title="상품 가입이 완료되었습니다"
          description="청년도약토큰 상품 가입이 성공적으로 완료되었습니다. 가입 내역은 마이페이지에서 확인하실 수 있습니다."
        />

        {/* 가입 상품 정보 */}
        <SignUpCompleteProductInfo {...signupInfo} />
        {/* 자동이체 사용 */}
        <AutoDebitInfo {...autoDebitInfo} />
      </motion.div>

      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button text="홈으로 이동" onClick={handleHomeClick} fullWidth />
      </motion.div>
    </div>
  );
}