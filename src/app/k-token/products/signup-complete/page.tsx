

import Button from "@/components/common/Button"
import Header from "@/components/common/Header"
import AutoDebitInfo from "@/components/k-token/signup/AutoDebitInfo"

import SignUpCompleteBanner from "@/components/k-token/signup/SignUpCompleteBanner"
import SignUpCompleteProductInfo from "@/components/k-token/signup/SignUpCompleteProductInfo"
import { CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function KTokenProductSignupComplete() {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate("/user/coin")
  }

  // 실제 데이터(예시)
  const signupInfo = {
    productName: "청년도약토큰",
    startDate: "2025.05.09",
    endDate: "2026.05.09",
    monthlyAmount: "500,000원",
    baseRate: "연 3.7%(세전)",
    preferentialRate: "연 1.3%(세전)",
    finalRate: "연 5.0%(세전)",
  }
  const autoDebitInfo = {
    account: "우리은행 1002-123-456789",
    transferDay: "매월 25일",
    amount: "500,000원",
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="가입 완료" />

      <div className="flex-1 overflow-auto p-4">
        <SignUpCompleteBanner
          title="상품 가입이 완료되었습니다"
          description="청년도약토큰 상품 가입이 성공적으로 완료되었습니다. 가입 내역은 마이페이지에서 확인하실 수 있습니다."
        />

        {/* 가입 상품 정보 */}
        <SignUpCompleteProductInfo {...signupInfo} />
        {/* 자동이체 사용 */}
        <AutoDebitInfo {...autoDebitInfo} />

      </div>

      <div className="p-4">
        <Button text="홈으로 이동" onClick={handleHomeClick} fullWidth />
      </div>
    </div>
  )
}
