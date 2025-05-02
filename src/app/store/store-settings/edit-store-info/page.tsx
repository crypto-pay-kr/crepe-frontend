import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { ChevronRight } from 'lucide-react'
import BottomNav from '@/components/common/BottomNavigate'
import Input from "@/components/common/Input";
const BASE_URL = import.meta.env.VITE_API_SERVER_URL;
import {
  updateStoreName,
  updateStoreAddress,
} from "@/api/store";

export default function StoreEditInfoPage() {
  const [newStoreName, setStoreName] = useState("")
  const [newAddress, setAddress] = useState("")
  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');

  const token = localStorage.getItem("accessToken");

  const handleStoreNameUpdate = async () => {
    if (!newStoreName.trim()) {
      alert("가게명을 입력해주세요!");
      return;
    }

    try {
      const response = await updateStoreName(token!, newStoreName);

      alert(`가게명이 "${newStoreName}"(으)로 변경되었습니다.`);
    } catch (err) {
      console.error("가게명 변경 실패:", err);
      alert("가게명 변경 중 오류가 발생했습니다.");
    }
  };


  const handleAddressUpdate = async () => {
    if (!newAddress.trim()) {
      alert("주소를 입력해주세요!");
      return;
    }

    try {
      const response = await updateStoreAddress(token!, newAddress);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "주소 변경에 실패했습니다.");
      }

      alert(`주소가 "${newAddress}"(으)로 변경되었습니다.`);
    } catch (err) {
      console.error("주소 변경 실패:", err);
      alert("주소 변경 중 오류가 발생했습니다.");
    }
  };

  const onNext = () => {
    navigate("/store/menu/add", {
      state: { isUser: true }
    });
  }


  const isButtonDisabled = false

  const menuItems = [
    { id: 1, name: "얼큰칼국수", price: 9000, image: "/menu.png" },
    { id: 2, name: "얼큰칼국수", price: 9000, image: "/menu.png" },
  ]

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="메뉴/결제수단 설정" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        {/* 가게명 변경 */}
        <div className="bg-white p-4 mb-2">
          <h2 className="font-medium mb-2 font-bold">가게명 변경</h2>
          <Input
            label="가게명"
            value={newStoreName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="가게명을 입력해주세요."
          />
          <Button text="변경하기"
                  onClick={handleStoreNameUpdate}
                  className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"></Button>
        </div>

        {/* 주소 변경 */}
        <div className="bg-white p-4 mb-2">
          <h2 className="font-medium mb-2 font-bold">주소</h2>
          <Input
            label="주소"
            value={newAddress}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력해주세요."
          />
          <Button text="변경하기"
                  onClick={handleAddressUpdate}
                  className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"></Button>
        </div>

        {/* 결제 수단 */}
        <div className="bg-white p-4 mb-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">결제 수단 지원 설정</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {menuItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-t border-gray-200">
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.price.toLocaleString()} KRW</p>
              </div>
              <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-20 h-20 object-cover rounded" />
            </div>
          ))}
        </div>

        {/* 메뉴 추가 버튼 */}
        <div className="p-5">
          <Button text="메뉴 추가하기" onClick={onNext} color={isButtonDisabled ? "gray" : "blue"} />
        </div>
      </div>


      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}





