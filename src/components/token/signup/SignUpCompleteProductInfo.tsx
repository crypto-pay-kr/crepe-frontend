
import { motion } from "framer-motion";

export interface SignUpCompleteProductInfoProps {
  productName: string;
  productType: string;
  startDate: string;
  endDate: string;
  monthlyAmount: string;
  baseRate: string;
  interestRate?: string; 
  finalRate: string;
}

export default function SignUpCompleteProductInfo({
  productName,
  productType,
  startDate,
  endDate,
  monthlyAmount,
  baseRate,
  interestRate,
  finalRate,
}: SignUpCompleteProductInfoProps) {
  return (
    <motion.div
      className="border rounded-md p-4 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-medium mb-3">가입 상품 정보</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <div className="text-gray-600">상품명</div>
          <div className="font-medium">{productName}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">가입일</div>
          <div>{startDate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">만기일</div>
          <div>{endDate}</div>
        </div>

        {productType === "INSTALLMENT" && (
          <div className="flex justify-between">
            <div className="text-gray-600">납입액</div>
            <div>예치 후 결정</div>
          </div>
        )}
        {productType === "SAVING" && (
          <div className="flex justify-between">
            <div className="text-gray-600">납입금액</div>
            <div>{monthlyAmount}</div>
          </div>
        )}
        {/* VOUCHER는 월 납입금액 자체를 숨김 */}

        <div className="flex justify-between">
          <div className="text-gray-600">기본금리</div>
          <div>{baseRate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">우대금리</div>
          <div>{interestRate}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-600">최종금리</div>
          <div className="font-medium">{finalRate}</div>
        </div>
      </div>
    </motion.div>
  );
}