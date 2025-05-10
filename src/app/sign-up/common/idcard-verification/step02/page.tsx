import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import CameraComponent from "@/components/common/CameraComponent";
import { processIdentityCard } from "@/api/user";

export default function IDVerificationStep2() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // 파일 업로드 버튼 클릭
  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시 미리보기 생성
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCapturedImage(URL.createObjectURL(file));
    }
  };

  // 다시 촬영하기 (파일 삭제)
  const handleRetake = () => {
    setUploadedFile(null);
    setCapturedImage(null);
  };

  // "다음" 버튼 클릭 시 OCR API를 호출한 후 Step03 페이지로 이동
  const handleNext = async () => {
    if (uploadedFile || capturedImage) {
      try {
        let fileToSend: File | null = null;
        if (uploadedFile) {
          fileToSend = uploadedFile;
        } else if (capturedImage) {
          // capturedImage (dataURL) → Blob → File 변환
          const res = await fetch(capturedImage);
          const blob = await res.blob();
          fileToSend = new File([blob], "captured.png", { type: "image/png" });
        }
        if (!fileToSend) {
          throw new Error("No file to send for OCR processing.");
        }
        const ocrResponse = await processIdentityCard(fileToSend);
        // Step03로 이동하며 OCR 데이터를 state로 전달
        navigate("/id/verification/step3", { state: ocrResponse });
      } catch (err) {
        console.error(err);
        alert("OCR 처리 중 오류가 발생했습니다.");
      }
    } else {
      alert("신분증 이미지가 필요합니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="본인확인" />
      <div className="mt-20 relative w-10/12 self-center h-64 rounded overflow-hidden">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Uploaded ID"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <CameraComponent onCapture={setCapturedImage} />
        )}
      </div>
      {/* mt-auto 로 하단으로 밀기 */}
      <div className="p-4 bg-white space-y-3 mt-auto">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button text="파일 업로드" fullWidth onClick={handleFileUpload} />
        <Button text="다음" fullWidth onClick={handleNext} />
        {capturedImage && (
          <Button text="다시 촬영하기" fullWidth onClick={handleRetake} />
        )}
      </div>
    </div>
  );
}