import Header from "@/components/common/Header";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BusinessVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [businessNumber, setBusinessNumber] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);

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

  const isButtonDisabled = !businessNumber || !certificate;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <Header title="회원가입" progress={4} isStore={false} />

      {/* Main content */}
      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">사업자 인증</h2>
        </div>

        <div className="flex-1">
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

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">사업자 등록증 업로드 안내</h3>
                <p className="text-sm text-gray-600">
                  사업자 등록증은 심사를 위해 이용되며, 심사 후 안전하게 보관됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-grow"></div>
      </main>

      {/* Bottom fixed button area */}
      <div className="p-5 bg-white">
        <Button
          text="인증하기"
          onClick={handleVerify}
          className={`w-full py-3.5 rounded-xl font-medium text-white ${
            isButtonDisabled 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-[#0a2e65] hover:bg-[#081f45]"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
};

export default BusinessVerificationPage;