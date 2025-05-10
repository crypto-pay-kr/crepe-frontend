import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/common/Header";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { signUpStore } from "@/api/store";

const BusinessVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStore = location.pathname.includes("/store/");
  
  const [businessNumber, setBusinessNumber] = useState("");
  const [certificate, setCertificate] = useState<File | null>(null);

  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessNumber(e.target.value);
  };

  const handleCertificateChange = (file: File) => {
    setCertificate(file);
  };

  // Base64 → Blob 변환
  const base64ToBlob = (base64: string, contentType = "image/png"): Blob => {
    const parts = base64.split(",");
    const byteCharacters = atob(parts[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const handleVerify = async () => {
    const storedData = localStorage.getItem("signUpData");
    if (!storedData) {
      alert("가게 및 회원정보가 없습니다.");
      return;
    }
    const signUpData = JSON.parse(storedData);

    // 서버가 요구하는 필드명: storeAddress
    // signUpData.address가 있다면 그대로 전달
    signUpData.storeAddress = signUpData.address ?? "";

    if (!businessNumber.trim()) {
      alert("사업자 등록번호를 입력해주세요.");
      return;
    }
    if (!certificate) {
      alert("사업자 등록증 이미지를 첨부해주세요.");
      return;
    }

    // 사업자 등록번호 추가
    signUpData.businessNumber = businessNumber.trim();

    // FormData 구성
    const formData = new FormData();
    formData.append(
      "storeData",
      new Blob([JSON.stringify(signUpData)], { type: "application/json" })
    );

    // 가게 대표이미지 첨부
    if (signUpData.storeImageBase64) {
      const blob = base64ToBlob(signUpData.storeImageBase64);
      formData.append("storeImage", blob, "storeImage.png");
    } else {
      alert("가게 대표 이미지를 업로드해주세요.");
      return;
    }

    // 사업자 등록증 파일 첨부
    formData.append("businessImage", certificate, certificate.name);

    try {
      const response = await signUpStore(formData);
      if (!response.ok) {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message}`);
        return;
      }

      // 회원가입 성공 시 저장된 정보 삭제
      sessionStorage.removeItem("signUpData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      alert("사업자 회원가입이 완료되었습니다.");
      navigate("/signup-complete");
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  const isButtonDisabled = !businessNumber || !certificate;

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={4} isStore={isStore} />
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
        </div>
      </main>
      <div className="p-5 bg-white">
        <Button
          text="인증하기"
          onClick={handleVerify}
          className={`w-full py-3.5 rounded-xl font-medium text-white ${
            isButtonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#0a2e65] hover:bg-[#081f45]"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
};

export default BusinessVerificationPage;