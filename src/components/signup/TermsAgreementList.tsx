import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { TermsAgreementModal, TermsType } from "./TermsAgreementModal";

export function TermsAgreementList() {
  const [openModal, setOpenModal] = useState<TermsType | null>(null);

  const handleOpenModal = (type: TermsType) => {
    setOpenModal(type);
  };

  const handleCloseModal = () => {
    setOpenModal(null);
  };

  const termsList = [
    {
      type: "personalInfo" as TermsType,
      title: "[필수] 개인정보 수집/이용 동의",
      required: true,
    },
    {
      type: "uniqueIdInfo" as TermsType,
      title: "[필수] 고유식별정보 처리 동의",
      required: true,
    },
    {
      type: "telecomTerms" as TermsType,
      title: "[필수] 통신사 이용약관 동의",
      required: true,
    },
    {
      type: "serviceTerms" as TermsType,
      title: "[필수] 서비스 이용약관 동의",
      required: true,
    },
    {
      type: "thirdPartyInfo" as TermsType,
      title: "[필수] 개인정보 제 3자 제공 동의",
      required: true,
    },
  ];

  return (
    <div className="space-y-4">
      {termsList.map((term) => (
        <div
          key={term.type}
          onClick={() => handleOpenModal(term.type)}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
        >
          <span className="text-sm">{term.title}</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      ))}

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