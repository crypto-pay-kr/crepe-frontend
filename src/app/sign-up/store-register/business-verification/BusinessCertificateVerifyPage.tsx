import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { uploadBusinessLicense } from "@/api/store"; // 실제 OCR API 호출 함수 예시

export default function BusinessCertificateVerifyPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<null | {
    registerNumber: string;
    corpName: string | null;
    representativeName: string;
    openDate: string;
    address: string;
    businessType: string;
    businessItem: string;
  }>(null);

  // 파일 선택 시 Base64 변환 + localStorage 저장
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      setImage(base64Data);
      localStorage.setItem("businessImageBase64", base64Data); // 사업자등록증 이미지 저장
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // 파일 선택 버튼 클릭
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // OCR 검증 요청
  const handleVerify = async () => {
    if (!image) return;
    try {
      setIsUploading(true);
      // dataURL → Blob 변환
      const res = await fetch(image);
      const blob = await res.blob();
      const fileToSend = new File([blob], fileName || "license.png", { type: blob.type });

      // 실제 OCR API 호출 (예: uploadBusinessLicense)
      const response = await uploadBusinessLicense(fileToSend);

      // OCR 결과 저장
      localStorage.setItem("businessOcrResult", JSON.stringify(response));

      // 성공 시 다음 단계 페이지 이동
      navigate("/store/register/info");
    } catch (error) {
      console.error("OCR 업로드 오류:", error);
      alert("OCR 처리 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 파일 초기화
  const handleReset = () => {
    setImage(null);
    setFileName("");
    setVerificationResult(null);
    localStorage.removeItem("businessImageBase64");
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="사업자 정보확인" />
      <div className="bg-white pb-24 flex-1 flex flex-col">
        <div className="p-4 flex items-center">
          <h2 className="text-xl font-bold">사업자등록증 업로드</h2>
        </div>
        <div className="px-4">
          <p className="text-sm text-gray-600 mb-4">
            사업자등록증을 업로드하여 OCR 검증을 진행해주세요.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          {!image ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500"
              onClick={handleUploadClick}
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                클릭하여 사업자등록증 업로드
              </p>
              <p className="text-xs text-gray-500">JPG, PNG 파일 등</p>
            </div>
          ) : (
            <div className="mb-4">
              <div
                className="relative rounded-lg overflow-hidden mb-4"
                style={{ height: "300px" }}
              >
                <img src={image} alt="사업자등록증" className="object-contain w-full h-full" />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">파일명: {fileName}</p>
              {!verificationResult && (
                <button
                  onClick={handleVerify}
                  disabled={isUploading}
                  className="bg-[#002169] w-full h-12 text-white rounded-md font-medium"
                >
                  {isUploading ? "OCR 검증 중..." : "OCR 검증 요청"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}