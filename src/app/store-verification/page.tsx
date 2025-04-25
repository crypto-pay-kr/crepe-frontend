import Header from "@/components/common/Header";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BusinessVerification: React.FC = () => {
  const navigate = useNavigate();
  const [businessNumber, setBusinessNumber] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);

  // Input 컴포넌트는 onChange로 문자열을 받으므로, handleBusinessNumberChange도 값만 전달
  const handleBusinessNumberChange = (value: string) => {
    setBusinessNumber(value);
  };

  const handleCertificateChange = (file: File) => {
    setCertificate(file);
  };

  const handleVerify = () => {
    if (!businessNumber) {
      alert("사업자 등록번호를 입력해주세요.");
      return;
    }
    
    if (!certificate) {
      alert("사업자 등록증을 첨부해주세요.");
      return;
    }

    navigate("/signup-complete");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header title="회원 가입" progress={5} isStore={true} />

      {/* Main content */}
      <main className="flex-1 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-2">사업자 인증</h2>
        
        {/* 사업자 등록번호 입력 필드를 wrapper로 감싸 margin 추가 */}
        <div className="mb-6">
          <Input
            label="사업자 등록번호"
            value={businessNumber}
            onChange={handleBusinessNumberChange}
            placeholder="사업자 등록번호 10자리를 입력해주세요"
          />
        </div>

        <div className="mb-8">
          <ImageUploader 
            label="사업자 등록증 업로드"
            previewLabel="선택된 파일"
            onChange={handleCertificateChange}
            value={certificate}
          />
        </div>

        <div className="mt-auto">
          <button
            onClick={handleVerify}
            className={`w-full py-4 rounded-lg ${
              businessNumber && certificate ? "bg-[#0a2e65] text-white" : "bg-gray-300 text-gray-700"
            }`}
            disabled={!businessNumber || !certificate}
          >
            인증하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default BusinessVerification;