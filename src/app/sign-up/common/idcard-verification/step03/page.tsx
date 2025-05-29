import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

interface OCRData {
  name: string;
  personalNum: string; // 반드시 string
  address: string;
  issueDate: string;
  authority: string;
}

export default function IDVerificationStep3() {
  const navigate = useNavigate();
  const location = useLocation();

  // 안전하게 signupState에서 ocrData를 가져오거나 빈 객체로 기본값을 설정
  const signupState = location.state?.signupState || {};
  const defaultOcrData: OCRData = signupState.ocrData || {
    name: "",
    personalNum: "",
    address: "",
    issueDate: "",
    authority: "",
  };

  const [formData, setFormData] = React.useState<OCRData>(defaultOcrData);

  // 값 변경 시에도 문자열로 설정
  const handleChange = (field: keyof OCRData, value: string) => {
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

  // personalNum 안전 처리
  const personalNumSplit = formData.personalNum?.split("-") ?? [];
  const frontNum = personalNumSplit[0] || "";
  const backNum = personalNumSplit[1] || "";

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
        <div className="mb-6">
          <label className="block text-gray-500 mb-2">주민등록번호</label>
          <div className="flex items-center">
            <input
              type="text"
              value={frontNum}
              onChange={(e) =>
                handleChange("personalNum", e.target.value + "-" + backNum)
              }
              className="w-full py-3 px-0 border-0 border-b border-gray-300 focus:outline-none focus:border-[#0a2d6b] text-xl"
              maxLength={6}
            />
            <span className="mx-4 text-xl">-</span>
            <input
              type="text"
              value={formData.personalNum.split("-")[1] || ""}
              readOnly
              className="w-full py-3 px-0 border-0 border-b border-gray-300 focus:outline-none text-xl"
            />
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
          onChange={(e) => handleChange("issueDate", e.target.value)}
        />
      </div>
      <div className="p-6">
        <Button text="다음" onClick={handleSubmit} fullWidth className="text-sm font-medium" />
      </div>
    </div>
  );
}