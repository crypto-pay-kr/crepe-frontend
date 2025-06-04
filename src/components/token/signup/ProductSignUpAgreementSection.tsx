import React, { useState } from "react";
import ProductSignUpAgreement from "./ProductSignUpAgreement";
import { TermsAgreementModal, TermsType } from "@/components/signup/TermsAgreementModal";

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
  const [openModal, setOpenModal] = useState<TermsType | null>(null); // 모달 상태 추가

  const handleOpenModal = (type: TermsType) => {
    setOpenModal(type); // 모달 열기
  };

  const handleCloseModal = () => {
    setOpenModal(null); // 모달 닫기
  };

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
        onClick={() => handleOpenModal("personalInfo")} // 모달 열기
      />
      <ProductSignUpAgreement
        label="[필수] 고유식별정보 처리 동의"
        checked={consents.identification}
        onToggle={() => toggleConsent("identification")}
        onClick={() => handleOpenModal("uniqueIdInfo")} // 모달 열기
      />
      <ProductSignUpAgreement
        label="[필수] 통신사 이용약관 동의"
        checked={consents.telecom}
        onToggle={() => toggleConsent("telecom")}
        onClick={() => handleOpenModal("telecomTerms")} // 모달 열기
      />
      <ProductSignUpAgreement
        label="[필수] 서비스 이용약관 동의"
        checked={consents.service}
        onToggle={() => toggleConsent("service")}
        onClick={() => handleOpenModal("serviceTerms")} // 모달 열기
      />
      <ProductSignUpAgreement
        label="[필수] 개인정보 제 3자 제공 동의"
        checked={consents.thirdParty}
        onToggle={() => toggleConsent("thirdParty")}
        onClick={() => handleOpenModal("thirdPartyInfo")} // 모달 열기
      />

      {/* 약관 모달 */}
      {openModal && (
        <TermsAgreementModal
          isOpen={true}
          onClose={handleCloseModal}
          type={openModal}
        />
      )}
    </div>
  );
}