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

interface StoreFormData {
  storeType: string;
  storeName: string;
  address: string;
  image?: File | null;
}

export default function AdditionalStoreInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StoreFormData>({
    storeType: "",
    storeName: "",
    address: "",
    image: null,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  const handleSelectChange = (value: string) => {
    const updatedForm = { ...formData, storeType: value };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  const handleImageChange = (file: File) => {
    const updatedForm = { ...formData, image: file };
    setFormData(updatedForm);
    validateForm(updatedForm);
  };

  const validateForm = (data: StoreFormData) => {
    const isValid = data.storeType && data.storeName && data.address;
    setIsButtonDisabled(!isValid);
  };

  const onNext = () => {
    // 필요한 처리 로직 이후 이동
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
                onChange={(value) =>
                  handleInputChange({
                    target: { name: "storeName", value },
                  } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>

            <div>
              <Input
                name="address"
                value={formData.address}
                placeholder="주소"
                className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus-visible:ring-0 px-0"
                onChange={(value) =>
                  handleInputChange({
                    target: { name: "address", value },
                  } as unknown as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>

            <div className="mt-4 mb-6">
              <ImageUploader
                value={formData.image}
                onChange={handleImageChange}
                label="대표 이미지"
                previewLabel="첨부된 이미지"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mt-8">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">가게 정보 입력 안내</h3>
                <p className="text-sm text-gray-600">
                  입력하신 정보는 사용자에게 표시되는 정보이므로 정확하게 입력해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-grow"></div>
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