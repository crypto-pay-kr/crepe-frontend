"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Home, ShoppingBag, Store, User } from 'lucide-react'
import BottomNav from '@/components/common/BottomNavigate'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Button from '@/components/common/Button'

export default function StoreSettings() {
  const [storeName, setStoreName] = useState("")
  const [address, setAddress] = useState("")
  const navigate = useNavigate()
  const isSeller = location.pathname.includes('/store');

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/home")
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: false,
      onClick: () => navigate("/shop")
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: true,
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
    }
  ];


  const handleStoreNameUpdate = () => {
    if (!storeName.trim()) {
      alert("가게명을 입력해주세요!")
      return
    }
    console.log("입력된 가게명:", storeName)
    alert(`가게명이 "${storeName}"(으)로 변경됩니다`)
  }

  const handleAddressUpdate = () => {
    if (!address.trim()) {
      alert("주소를 입력해주세요!")
      return
    }
    console.log("입력된 주소:", address)
    alert(`주소가 "${address}"(으)로 변경됩니다`)
  }

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
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border-b border-gray-300 p-2 bg-transparent focus:outline-none"
            placeholder="가게명을 입력해주세요."
          />
          <button
            onClick={handleStoreNameUpdate}
            className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"
          >
            변경하기
          </button>
        </div>

        {/* 주소 변경 */}
        <div className="bg-white p-4 mb-2">
          <h2 className="font-medium mb-2 font-bold">주소</h2>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className=" w-full border-b border-gray-300 p-2 bg-transparent focus:outline-none"
            placeholder="주소를 입력해주세요."
          />
          <button
            onClick={handleAddressUpdate}
            className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"
          >
            변경하기
          </button>
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
      <BottomNav navItems={navItems} />
  </div>
  )
}
