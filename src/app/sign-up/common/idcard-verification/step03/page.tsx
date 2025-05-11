import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";

interface OCRData {
  name: string;
  personalNum: string;
  address: string;
  issueDate: string;
  authority: string;
}

export default function IDVerificationStep3() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const ocrData: OCRData = state || {
    // 기본 빈 값 또는 에러 처리
    name: "",
    personalNum: "",
    address: "",
    issueDate: "",
    authority: ""
  };

  const [formData, setFormData] = React.useState<OCRData>(ocrData);

  const handleChange = (field: keyof OCRData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // 제출 전 검증 및 제출 로직 구현
    navigate("/id/verification/step4");
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
        <div className="mb-6">
          <label className="block text-gray-500 mb-2">주민등록번호</label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.personalNum.split("-")[0] || ""}
              onChange={(e) =>
                handleChange("personalNum", e.target.value + "-" + (formData.personalNum.split("-")[1] || ""))
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
      </div>
      <div className="p-4">
        <Button text="다음" onClick={handleSubmit} fullWidth />
      </div>
    </div>
  );
}