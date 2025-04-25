import React, { useState } from "react";

interface BusinessCertificateFormProps {
  onSuccess: () => void;
}

export default function BusinessCertificateForm({ onSuccess }: BusinessCertificateFormProps): React.ReactElement {
  const [businessNumber, setBusinessNumber] = useState<string>("");
  const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);
  const [businessNumberError, setBusinessNumberError] = useState<string>("");
  const [certificateError, setCertificateError] = useState<string>("");

  const validateBusinessNumber = (number: string): boolean => {
    // 사업자등록번호 유효성 검사 (10자리 숫자)
    const regex = /^\d{10}$/;
    return regex.test(number.replace(/-/g, ""));
  };

  const handleBusinessCertificateAttach = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // 파일 타입 검증 (이미지 또는 PDF)
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setCertificateError("이미지 또는 PDF 파일만 업로드 가능합니다.");
        return;
      }
      
      // 파일 크기 검증 (예: 10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        setCertificateError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }
      
      setBusinessCertificate(file);
      setCertificateError("");
    }
  };

  const handleBusinessCertificateChange = (): void => {
    // 사업자등록번호 검증
    if (!businessNumber) {
      setBusinessNumberError("사업자등록번호를 입력해주세요.");
      return;
    }

    if (!validateBusinessNumber(businessNumber)) {
      setBusinessNumberError("유효한 사업자등록번호 형식이 아닙니다.");
      return;
    } else {
      setBusinessNumberError("");
    }

    // 사업자등록증 파일 검증
    if (!businessCertificate) {
      setCertificateError("사업자등록증 파일을 첨부해주세요.");
      return;
    }

    // 여기서 실제 API 호출 등을 통해 사업자등록증 업로드
    // 성공 시 onSuccess 콜백 호출
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">사업자등록번호</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">사업자등록번호를 입력해주세요.</label>
        <input
          type="text"
          value={businessNumber}
          onChange={(e) => setBusinessNumber(e.target.value)}
          className={`w-full border rounded p-2 ${businessNumberError ? "border-red-500" : ""}`}
          placeholder="사업자등록번호를 입력해주세요."
        />
        {businessNumberError && <p className="text-xs text-red-500 mt-1">{businessNumberError}</p>}
      </div>

      <h3 className="text-md font-medium mb-2">사업자등록증 변경하기</h3>
      <div className="mb-4">
        <label htmlFor="business-certificate" className="block w-full">
          <div className={`w-full border rounded p-2 text-center cursor-pointer ${certificateError ? "border-red-500" : "border-gray-300"}`}>
            첨부하기
          </div>
          <input
            id="business-certificate"
            type="file"
            accept="image/*,.pdf"
            onChange={handleBusinessCertificateAttach}
            className="hidden"
          />
        </label>
        {businessCertificate && (
          <p className="text-xs text-gray-600 mt-2">선택된 파일: {businessCertificate.name}</p>
        )}
        {certificateError && <p className="text-xs text-red-500 mt-1">{certificateError}</p>}
      </div>

      <button 
        onClick={handleBusinessCertificateChange} 
        className={`w-full py-3 rounded ${
          businessNumber && businessCertificate 
            ? "bg-[#0a2e65] text-white" 
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!businessNumber || !businessCertificate}
      >
        변경하기
      </button>
    </div>
  );
}