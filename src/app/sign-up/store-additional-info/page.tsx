import React, { useState } from "react";
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

interface StoreFormData {
  storeType: string;
  storeName: string;
  address: string;
  // 대표 이미지를 Base64 문자열로 저장
  imageBase64?: string;
}

export default function AdditionalStoreInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StoreFormData>({
    storeType: "",
    storeName: "",
    address: "",
    imageBase64: "",
  });
  // 미리보기용 Base64 문자열 상태 (ImageUploader가 기대하는 value)
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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

  const handleImageChange = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      const updatedForm = { ...formData, imageBase64: base64 };
      setFormData(updatedForm);
      setImageFile(file);
      validateForm(updatedForm);
    } catch (error) {
      console.error("이미지 변환 오류:", error);
    }
  };

  const validateForm = (data: StoreFormData) => {
    const isValid = data.storeType && data.storeName && data.address;
    setIsButtonDisabled(!isValid);
  };

  const onNext = () => {
    // 기존의 회원/가게 정보가 sessionStorage에 저장되어 있다면 병합
    const storedData = sessionStorage.getItem("signUpData") || "{}";
    let signUpData = {};
    try {
      signUpData = JSON.parse(storedData);
    } catch (error) {
      console.error("signUpData 파싱 오류:", error);
    }

    const updatedData = {
      ...signUpData,
      storeType: formData.storeType,
      storeName: formData.storeName,
      storeAddress: formData.address,
      // 대표 이미지를 Base64 문자열로 저장 (백엔드 전달 시 Blob 변환)
      storeImageBase64: formData.imageBase64,
    };

    localStorage.setItem("signUpData", JSON.stringify(updatedData));
    navigate("/store/verification");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={4} isStore={true} />
      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-1">가게 정보를</h2>
          <h2 className="text-2xl font-bold">입력해주세요</h2>
        </div>
        <div className="flex-1">
          <div className="space-y-6">
            <div>
              <Select onValueChange={handleSelectChange}>
                <SelectTrigger className="w-full border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus:ring-0">
                  <SelectValue placeholder="음식점" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">음식점</SelectItem>
                  <SelectItem value="cafe">카페</SelectItem>
                  <SelectItem value="bakery">베이커리</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                name="storeName"
                value={formData.storeName}
                placeholder="가게명"
                className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus-visible:ring-0 px-0"
                onChange={(e) => handleInputChange("storeName", e.target.value)}
              />
            </div>
            <div>
              <Input
                name="address"
                value={formData.address}
                placeholder="주소"
                className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus-visible:ring-0 px-0"
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>
            <div className="mt-4 mb-6">
              <ImageUploader
                value={imageFile}
                onChange={handleImageChange}
                label="대표 이미지"
                previewLabel="첨부된 이미지"
              />
            </div>
          </div>
        </div>
      </main>
      <div className="p-5 bg-white">
        <Button
          text="다음"
          onClick={onNext}
          className={`w-full py-3.5 rounded-xl font-medium text-white ${
            isButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}