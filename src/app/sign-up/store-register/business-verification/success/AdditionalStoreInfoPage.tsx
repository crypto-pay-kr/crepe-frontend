import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import ImageUploader from "@/components/common/ImageUploader";
import Input from "@/components/common/TextInput";
import Button from "@/components/common/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { fileToBase64 } from "@/utils/fileToBase64";
import { signUpStore } from "@/api/store";

interface BusinessOcrData {
  registerNumber: string;
  corpName: string | null;
  representativeName: string;
  openDate: string;
  address: string;
  businessType: string;
  businessItem: string;
}

interface StoreFormData {
  storeType: string;
  storeName: string;
  businessNumber: string;
  address: string;
  imageBase64?: string;
}

// Base64 → Blob 변환 유틸
function base64ToBlob(base64: string, contentType = "image/png"): Blob {
  const parts = base64.split(",");
  const byteCharacters = atob(parts[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

export default function AdditionalStoreInfoPage() {
  const navigate = useNavigate();

  const [ocrData, setOcrData] = useState<BusinessOcrData | null>(null);
  const [formData, setFormData] = useState<StoreFormData>({
    storeType: "",
    storeName: "",
    businessNumber: "",
    address: "",
    imageBase64: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // OCR 결과 (businessOcrResult) 불러오기
  useEffect(() => {
    const savedOcr = localStorage.getItem("businessOcrResult");
    if (savedOcr) {
      setOcrData(JSON.parse(savedOcr));
    }
  }, []);

  // OCR 결과를 폼에 반영
  useEffect(() => {
    if (ocrData) {
      setFormData((prev) => ({
        ...prev,
        storeName: ocrData.corpName || "",
        businessNumber: ocrData.registerNumber || "",
        address: ocrData.address || "",
      }));
    }
  }, [ocrData]);

  // 폼 값 변경
  const handleInputChange = (name: string, value: string) => {
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  const handleSelectChange = (value: string) => {
    const updatedForm = { ...formData, storeType: value };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  // 대표 이미지 업로드 (Base64 변환)
  const handleImageChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const updated = { ...formData, imageBase64: base64 };
      setFormData(updated);
      setImageFile(file);
      validateForm(updated);
    } catch (error) {
      console.error("이미지 변환 오류:", error);
    }
  };

  // 필수 필드 모두 채워졌는지 확인
  const validateForm = (data: StoreFormData) => {
    const isValid = data.storeType && data.storeName && data.businessNumber && data.address;
    setIsButtonDisabled(!isValid);
  };

  // 회원가입 완료 처리
  const onSubmit = async () => {
    try {
      // 세션에 저장된 signUpData 불러오기
      const storedData = sessionStorage.getItem("signUpData") || "{}";
      const signUpData = JSON.parse(storedData);

      // 서버에서 요구하는 필드명으로 매핑
      const signUpPayload = {
        ...signUpData,
        storeName: formData.storeName,
        businessNumber: formData.businessNumber,
        storeAddress: formData.address,
        storeType: formData.storeType,
        representativeName: ocrData?.representativeName,
        businessType: ocrData?.businessType,
      };

      // FormData 구성
      const multipart = new FormData();
      multipart.append(
        "storeData",
        new Blob([JSON.stringify(signUpPayload)], { type: "application/json" })
      );

      // 대표 이미지
      if (formData.imageBase64) {
        const imageBlob = base64ToBlob(formData.imageBase64);
        multipart.append("storeImage", imageBlob, "storeImage.png");
      }

      // 사업자등록증 이미지 (businessImage)도 함께 전송
      const businessBase64 = localStorage.getItem("businessImageBase64");
      if (businessBase64) {
        const businessBlob = base64ToBlob(businessBase64);
        multipart.append("businessImage", businessBlob, "businessImage.png");
      }

      // API 요청
      const response = await signUpStore(multipart);
      if (!response.ok) {
        const errorData = await response.json();
        alert(`회원가입 실패: ${errorData.message}`);
        return;
      }

      // 로컬/세션 정리 후 완료 페이지로 이동
      localStorage.removeItem("businessOcrResult");
      localStorage.removeItem("businessImageBase64");

      sessionStorage.clear();
      
      alert("회원가입이 완료되었습니다.");
      navigate("/signup-complete");
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={4} isStore={true} />
      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">가게정보 입력</h2>
          <p className="text-sm text-gray-600">OCR 결과가 자동으로 입력됩니다.</p>
        </div>
        <div className="flex-1 space-y-6">
          <div>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus:ring-0">
                <SelectValue placeholder="가게 업종 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="음식점">음식점</SelectItem>
                <SelectItem value="카페">카페</SelectItem>
                <SelectItem value="베이커리">베이커리</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              name="storeName"
              label="가게명(상호)"
              value={formData.storeName}
              placeholder="가게명을 입력하세요."
              className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus:ring-0 px-0"
              onChange={(e) => handleInputChange("storeName", e.target.value)}
            />
          </div>
          <div>
            <Input
              name="businessNumber"
              label="사업자등록번호"
              value={formData.businessNumber}
              placeholder="사업자 등록번호"
              className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus:ring-0 px-0"
              onChange={(e) => handleInputChange("businessNumber", e.target.value)}
            />
          </div>
          <div>
            <Input
              name="address"
              label="주소"
              value={formData.address}
              placeholder="주소"
              className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus:ring-0 px-0"
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          </div>
          <div className="mt-4 mb-6">
            <ImageUploader
              label="대표 이미지"
              previewLabel="첨부된 이미지"
              value={imageFile}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </main>
      <div className="p-5 bg-white">
        <Button
          text="회원가입 완료"
          onClick={onSubmit}
          disabled={isButtonDisabled}
          className={`w-full py-3.5 rounded-xl font-medium text-white ${isButtonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
        />
      </div>
    </div>
  );
}