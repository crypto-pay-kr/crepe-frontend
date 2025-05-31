import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import CameraComponent from "@/components/common/CameraComponent";
import { processIdentityCard } from "@/api/user";
import { Check } from "lucide-react";

export default function IDVerificationStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const signupState = location.state?.signupState || {};

  // 주민등록번호 마스킹 처리 함수
  const maskPersonalNum = (personalNum: string) => {
    if (!personalNum) return "";
    
    const cleanNum = personalNum.replace(/-/g, "");
    if (cleanNum.length < 7) return personalNum;
    
    // 앞 6자리 + 성별(7번째 자리) + 나머지는 *
    const front = cleanNum.substring(0, 6);
    const gender = cleanNum.substring(6, 7);
    const masked = "*".repeat(6);
    
    return `${front}-${gender}${masked}`;
  };

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
          const res = await fetch(capturedImage);
          const blob = await res.blob();
          fileToSend = new File([blob], "captured.png", { type: "image/png" });
        }
        if (!fileToSend) {
          throw new Error("No file to send for OCR processing.");
        }
        
        const ocrResponse = await processIdentityCard(fileToSend);
        
        // OCR 데이터 처리: 주민등록번호는 원본과 마스킹된 버전 모두 저장
        const processedOcrData = {
          ...ocrResponse,
          originalPersonalNum: ocrResponse.personalNum, // 원본 저장 (백엔드 전송용)
          displayPersonalNum: maskPersonalNum(ocrResponse.personalNum), // 마스킹된 버전 (화면 표시용)
        };
        
        // Step03로 이동하며 처리된 OCR 데이터를 state로 전달
        navigate("/id/verification/step3", {
          state: {
            from: location.pathname,
            signupState: {
              ...signupState,
              ocrData: processedOcrData,
            },
          },
        });
      } catch (error : any)  {
        console.error("OCR 처리 중 오류 발생:", error.message);
        alert(error.message);
      }
    } else {
      alert("신분증 이미지가 필요합니다.");
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header title="본인확인" />

      <div className="px-5 py-4">
        <h2 className="text-xl font-bold text-gray-800">신분증 촬영</h2>
        <p className="text-sm text-gray-500 mt-1">
          신분증의 모든 정보가 잘 보이도록 촬영해주세요
        </p>
      </div>

      <div className="flex-1 px-5 flex flex-col">
        {/* 카메라/이미지 영역 */}
        <div className="w-full h-80 bg-white rounded-xl overflow-hidden shadow-md">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage}
                alt="Uploaded ID"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs flex items-center space-x-1">
                <Check size={14} />
                <span>이미지 준비완료</span>
              </div>
            </div>
          ) : (
            <CameraComponent onCapture={setCapturedImage} />
          )}
        </div>

        {/* 안내 메시지 */}
        {!capturedImage && (
          <div className="mt-4 bg-blue-50 border border-blue-100 p-3 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800">촬영 가이드</h3>
            <ul className="mt-1 text-xs text-blue-700 list-disc pl-5 space-y-1">
              <li>신분증이 프레임 안에 완전히 들어오도록 해주세요</li>
              <li>밝은 곳에서 그림자 없이 촬영하세요</li>
              <li>모든 정보가 선명하게 보여야 합니다</li>
            </ul>
          </div>
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="p-5 py-5 space-y-3 bg-white border-t border-gray-200 shadow-inner">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button text="파일 업로드" fullWidth onClick={handleFileUpload} className="text-base font-medium py-2"/>
        <Button text="다음" fullWidth onClick={handleNext} className="text-base font-medium py-2"/>
        {capturedImage && (
          <Button text="다시 촬영하기" fullWidth onClick={handleRetake} className="text-base font-medium py-2" />
        )}
      </div>
    </div>
  );
}