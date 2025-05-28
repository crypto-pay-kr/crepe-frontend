import React from "react";
import InfoItem from "@/components/common/InfoItem";

export interface ProductAdditionalInfoProps {
  depositorProtection: string;
  productType: string;
  selectionEnrollment: string[];
  interestRateNotice: string;
}

export default function ProductAdditionalInfo({
  depositorProtection,
  productType,
  selectionEnrollment,
  interestRateNotice,
}: ProductAdditionalInfoProps) {
  return (
    <div className="p-4">
      <h2 className="font-medium mb-2">예금자보호</h2>
      <div className="space-y-2">
        <InfoItem text={depositorProtection} />
      </div>

      <h2 className="font-medium mb-2 mt-4">상품유형</h2>
      <div className="space-y-2">
        <InfoItem text={productType} />
      </div>

      <h2 className="font-medium mb-2 mt-4">우대금리 적용 조건</h2>
      <div className="space-y-2">
        {selectionEnrollment.map((item, index) => (
          <InfoItem key={index} text={item} />
        ))}
      </div>

      <h2 className="font-medium mb-2 mt-4">우대이자율 안내</h2>
      <div className="space-y-2">
        <InfoItem text={interestRateNotice} />
      </div>
    </div>
  );
}