import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { SubscribeProductResponse } from "@/api/subscribe";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import SignUpCompleteBanner from "@/components/token/signup/SignUpCompleteBanner";
import SignUpCompleteProductInfo from "@/components/token/signup/SignUpCompleteProductInfo";
import { motion } from "framer-motion";

// ISO → YYYY.MM.DD 포맷 유틸
function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
}

// 숫자 변환을 위한 유틸
function toNumber(value?: number | string) {
  if (value === undefined || value === null) {
    return 0;
  }
  return typeof value === "number" ? value : parseFloat(value);
}

export default function TokenProductSignupComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  // 앞단에서 state로 구독 응답이 넘어오지 않았다면 접근 차단
  const state = location.state as { subscribeResponse?: SubscribeProductResponse } | null;
  if (!state?.subscribeResponse) {
    alert("상품 가입 정보가 없습니다. 상세 페이지로 이동합니다.");
    return <Navigate to="/token/onsale/products" replace />;
  }

  const { subscribeResponse } = state;


  // baseRate, interestRate, potentialMaxRate를 숫자로 변환
  const base = toNumber(subscribeResponse.baseInterestRate);
  const rate = toNumber(subscribeResponse.interestRate);
  const potMax = toNumber(subscribeResponse.potentialMaxRate);

  // 최종금리가 interestRate + potentialMaxRate인지 여부 확인
  const finalRateValue = subscribeResponse.potentialMaxRate !== undefined
    ? rate + potMax
    : rate;

  // interestRate는 (최종금리 - baseRate)로 표시
  const additionalRate = finalRateValue - base;

  console.log("subscribeResponse:", subscribeResponse);
  console.log("subscribeResponse.baseRate:", subscribeResponse.baseInterestRate);

  // 화면에 표시할 정보만 추려서 가공
  const signupInfo = {
    productName: subscribeResponse.productName,
    productId: subscribeResponse.productId,
    productType: subscribeResponse.productType,
    bankName: subscribeResponse.bankName,
    startDate: formatDate(subscribeResponse.subscribeDate),
    endDate: formatDate(subscribeResponse.expiredDate),
    monthlyAmount: `${subscribeResponse.balance.toLocaleString()}`,         // balance
    baseInterestRate: ` ${subscribeResponse.baseInterestRate}%`,                     // interestRate
    interestRate: ` ${additionalRate.toFixed(1)}%` || "-",                         // interestRate      
    additionalMessage: subscribeResponse.additionalMessage,   // additionalMessage
    finalRate:
      subscribeResponse.potentialMaxRate !== undefined
        ? `연 ${(subscribeResponse.interestRate + subscribeResponse.potentialMaxRate).toFixed(1)}%`
        : `연 ${subscribeResponse.interestRate}%`,                            // potentialMaxRate
    voucherCode: subscribeResponse.voucherCode,                                // voucherCode
  };


  return (
    <div className="flex flex-col h-full">
      <Header title="가입 완료" />

      <motion.div
        className="flex-1 overflow-auto p-4 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SignUpCompleteBanner
          title="상품 가입이 완료되었습니다"
          description={`${signupInfo.productName} 상품이 성공적으로 가입되었습니다.`}
        />

        <SignUpCompleteProductInfo {...signupInfo} />

        {signupInfo.additionalMessage && (
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-2">추가 안내</p>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-gray-600 whitespace-pre-line">{signupInfo.additionalMessage}</p>
            </div>
          </div>
        )}

        {signupInfo.voucherCode && (
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-gray-700">발급된 상품권 코드:</p>
            <p className="font-mono break-all">{signupInfo.voucherCode}</p>
          </div>
        )}

      </motion.div>

      <motion.div
        className="p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Button text="홈으로 이동" onClick={() => navigate("/my/coin")} fullWidth />
      </motion.div>
    </div>
  );
}