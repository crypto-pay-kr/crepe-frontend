"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronLeft, Camera } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../common/select"
import Button from "../common/Button"
import Input from "../common/TextInput"
import Header from "../common/Header"

interface StoreFormData {
  storeType: string
  storeName: string
  address: string
  image?: File | null
}

export default function StoreRegistrationForm() {
  const [formData, setFormData] = useState<StoreFormData>({
    storeType: "",
    storeName: "",
    address: "",
    image: null,
  })

  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateForm({ ...formData, [name]: value })
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, storeType: value }))
    validateForm({ ...formData, storeType: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }))
      validateForm({ ...formData, image: e.target.files![0] })
    }
  }

  const validateForm = (data: StoreFormData) => {
    const isValid = data.storeType && data.storeName && data.address
    setIsButtonDisabled(!isValid)
  }

  const onNext = () => {
    console.log("Form submitted:", formData)
    // Handle navigation or API call here
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <Header title="회원가입" progress={3} isStore={true} />

      {/* Form content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">가게 정보를</h2>
          <h2 className="text-2xl font-bold">입력해주세요</h2>
        </div>

        <div className="space-y-6 flex-1">
          {/* Store Type */}
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

          {/* Store Name */}
          <div>
            <Input
              name="storeName"
              value={formData.storeName}
              placeholder="가게명"
              className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus-visible:ring-0 px-0"
              onChange={(value) => handleInputChange({ target: { name: "storeName", value } } as unknown as React.ChangeEvent<HTMLInputElement>)}
            />
          </div>

          {/* Address */}
            <Input
              name="address"
              value={formData.address}
              placeholder="주소"
              className="border-t-0 border-x-0 border-b border-gray-300 rounded-none py-3 focus-visible:ring-0 px-0"
              onChange={(value) => handleInputChange({ target: { name: "address", value } } as unknown as React.ChangeEvent<HTMLInputElement>)}
            />
          </div>

          {/* Image Upload */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-2">대표 이미지</p>
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-center">
                <div className="flex items-center text-gray-500">
                  <Camera className="mr-2" size={20} />
                  <span>컴퓨터에서 업로드</span>
                </div>
              </div>
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-auto mb-4">
          <Button text="다음" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"}  />
        </div>
      </div>
  )
}