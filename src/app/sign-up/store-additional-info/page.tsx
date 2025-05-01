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
    <div className="flex flex-col h-screen bg-white">
      <Header title="회원가입" progress={4} isStore={true} />

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">가게 정보를</h2>
          <h2 className="text-2xl font-bold">입력해주세요</h2>
        </div>

        <div className="space-y-6 flex-1">
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

          <div className="mt-4 mb-1">
            <ImageUploader
              value={formData.image}
              onChange={handleImageChange}
              label="대표 이미지"
              previewLabel="첨부된 이미지"
            />
          </div>
        </div>

        <div className="mt-auto mb-4">
          <Button
            text="다음"
            onClick={onNext}
            color={isButtonDisabled ? "gray" : "blue"}
          />
        </div>
      </div>
    </div>
  );
}
