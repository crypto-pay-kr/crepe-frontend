import React from "react";
import ProductSignUpAgreement from "./ProductSignUpAgreement";

interface ProductSignUpAgreementSectionProps {
  consents: {
    all: boolean;
    privacy: boolean;
    identification: boolean;
    telecom: boolean;
    service: boolean;
    thirdParty: boolean;
  };
  toggleAll: () => void;
  toggleConsent: (
    key: "privacy" | "identification" | "telecom" | "service" | "thirdParty"
  ) => void;
}

export default function ProductSignUpAgreementSection({
  consents,
  toggleAll,
  toggleConsent,
}: ProductSignUpAgreementSectionProps) {
  return (
    <div className="space-y-4">
      {/* 전체 동의 */}
      <ProductSignUpAgreement
        label="전체동의"
        checked={consents.all}
        onToggle={toggleAll}
      />

      {/* 개별 동의 항목 */}
      <ProductSignUpAgreement
        label="[필수] 개인정보 수집/이용 동의"
        checked={consents.privacy}
        onToggle={() => toggleConsent("privacy")}
      />
      <ProductSignUpAgreement
        label="[필수] 고유식별정보 처리 동의"
        checked={consents.identification}
        onToggle={() => toggleConsent("identification")}
      />
      <ProductSignUpAgreement
        label="[필수] 통신사 이용약관 동의"
        checked={consents.telecom}
        onToggle={() => toggleConsent("telecom")}
      />
      <ProductSignUpAgreement
        label="[필수] 서비스 이용약관 동의"
        checked={consents.service}
        onToggle={() => toggleConsent("service")}
      />
      <ProductSignUpAgreement
        label="[필수] 개인정보 제 3자 제공 동의"
        checked={consents.thirdParty}
        onToggle={() => toggleConsent("thirdParty")}
      />
    </div>
  );
}