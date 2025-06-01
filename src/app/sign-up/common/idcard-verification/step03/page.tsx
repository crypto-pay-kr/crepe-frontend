import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

interface OCRData {
  name: string;
  personalNum: string; // 전체 주민등록번호 (백엔드 전송용)
  originalPersonalNum: string; // 원본 주민등록번호
  displayPersonalNum: string; // 마스킹된 주민등록번호 (화면 표시용)
  address: string;
  issueDate: string;
  authority: string;
}

export default function IDVerificationStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  // 주민등록번호 마스킹 처리 함수 - 성별까지만 보여주고 나머지는 *
  const maskPersonalNum = (personalNum: string) => {
    if (!personalNum) return "";
    
    // 모든 하이픈을 제거하고 깔끔하게 처리
    const cleanNum = personalNum.replace(/-/g, "");
    if (cleanNum.length >= 7) {
      // 앞 6자리 + 하이픈 + 성별 1자리 + * 6개
      return `${cleanNum.substring(0, 6)}-${cleanNum[6]}${"*".repeat(6)}`;
    }
    
    return personalNum;
  };

  // 안전하게 signupState에서 ocrData를 가져오거나 빈 객체로 기본값을 설정
  const signupState = location.state?.signupState || {};
  const rawOcrData = signupState.ocrData || {};
  
  const defaultOcrData: OCRData = {
    name: rawOcrData.name || "",
    personalNum: rawOcrData.personalNum || rawOcrData.originalPersonalNum || "",
    originalPersonalNum: rawOcrData.originalPersonalNum || rawOcrData.personalNum || "",
    displayPersonalNum: rawOcrData.displayPersonalNum || maskPersonalNum(rawOcrData.personalNum || ""),
    address: rawOcrData.address || "",
    issueDate: rawOcrData.issueDate || "",
    authority: rawOcrData.authority || "",
  };

  const [formData, setFormData] = React.useState<OCRData>(defaultOcrData);

  // 값 변경 시에도 문자열로 설정 (주민등록번호는 읽기 전용이므로 제외)
  const handleChange = (field: keyof Omit<OCRData, 'personalNum' | 'originalPersonalNum' | 'displayPersonalNum'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    navigate("/id/verification/step4", {
      state: {
        from: location.pathname,
        signupState: {
          ...signupState,
          ocrData: formData,
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="본인확인" />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">인증정보 확인 및 수정</h1>
        <p className="text-gray-600 mb-6">
          OCR 결과를 확인 후 필요시 정보를 수정해주세요.
        </p>
        <Input
          label="이름"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        
        {/* 주민등록번호 읽기 전용 필드 */}
        <div className="mb-4">
          <div className="text-sm mb-1 text-gray-500">주민등록번호</div>
          <div className="relative">
            <div className="w-full border-b py-2 border-gray-300 text-gray-900 bg-gray-50">
              {formData.displayPersonalNum || maskPersonalNum(formData.personalNum)}
            </div>
          </div>
        </div>
        
        <Input
          label="발급일"
          value={formData.issueDate}
          onChange={(e) => handleChange("issueDate", e.target.value)}
        />
        <Input
          label="발급지역"
          value={formData.authority}
          onChange={(e) => handleChange("authority", e.target.value)}
        />
      </div>
      <div className="p-6">
        <Button text="다음" onClick={handleSubmit} fullWidth className="text-base font-medium" />
      </div>
    </div>
  );
}