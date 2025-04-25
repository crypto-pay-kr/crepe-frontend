'use client'

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {  Home, ShoppingBag, User } from "lucide-react";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";

interface CryptoCurrency {
  code: string;
  amount: number;
}

interface MenuItemData {
  id?: string;
  name: string;
  price: string;
  cryptoPrices: CryptoCurrency[];
  image?: File | null;
}

export default function MenuEdit(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>(); // URL 경로 파라미터를 통해 id 가져오기
  
  // 현재 경로가 /menu/add인지 /menu/edit인지 확인
  const isAddMode = location.pathname === "/store/menu/add";
  const isEditMode = location.pathname === "/store/menu/edit" || location.pathname.startsWith("/store/menu/edit/");

  const [menuItem, setMenuItem] = useState<MenuItemData>({
    name: "",
    price: "",
    cryptoPrices: [
      { code: "XRP", amount: 3.3 },
      { code: "SOL", amount: 3.3 },
    ],
    image: null,
  });

  useEffect(() => {
    // 수정 모드일 경우 기존 데이터 불러오기
    if (isEditMode && id) {
      // 실제 구현에서는 API 호출로 데이터를 가져옵니다
      // 여기서는 예시 데이터를 사용합니다
      setMenuItem({
        id: id,
        name: "불고기 버거",
        price: "8000",
        cryptoPrices: [
          { code: "XRP", amount: 3.3 },
          { code: "SOL", amount: 3.3 },
        ],
        image: null,
      });
    }
  }, [isEditMode, id]);


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuItem({ ...menuItem, name: e.target.value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 입력 가능하도록
    const value = e.target.value.replace(/[^0-9]/g, "");
    setMenuItem({ ...menuItem, price: value });
  };

  const handleCryptoPriceChange = (code: string, value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    setMenuItem({
      ...menuItem,
      cryptoPrices: menuItem.cryptoPrices.map((crypto) =>
        crypto.code === code ? { ...crypto, amount: numValue } : crypto
      ),
    });
  };

  const handleImageAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMenuItem({ ...menuItem, image: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    // 실제 구현에서는 API 호출로 데이터를 저장합니다
    if (isAddMode) {
      alert("메뉴가 추가되었습니다.");
    } else {
      alert("메뉴가 수정되었습니다.");
    }
    navigate(-1);
  };

  const handleDelete = () => {
    // 실제 구현에서는 API 호출로 데이터를 삭제합니다
    if (window.confirm("정말로 이 메뉴를 삭제하시겠습니까?")) {
      alert("메뉴가 삭제되었습니다.");
      navigate(-1);
    }
  };
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

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header
        title={isAddMode ? "메뉴 추가" : "메뉴 수정"}/>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        {/* 음식명 */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">음식명</label>
          <input
            type="text"
            value={menuItem.name}
            onChange={handleNameChange}
            className="w-full border-b border-gray-300 p-2 bg-transparent focus:outline-none"
            placeholder="가게명을 입력해주세요."
          />
        </div>

        {/* 가격 */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">가격</label>
          <input
            type="text"
            value={menuItem.price}
            onChange={handlePriceChange}
            className="w-full border-b border-gray-300 p-2 bg-transparent focus:outline-none"
            placeholder="가격을 입력해주세요."
          />
        </div>

        {/* 각 코인 금액 */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">각 코인 금액</label>
          <div className="flex flex-wrap gap-2">
            {menuItem.cryptoPrices.map((crypto) => (
              <div key={crypto.code} className="flex items-center">
                <span
                  className={`px-2 py-1 rounded text-sm mr-2 ${
                    crypto.code === "XRP" ? "bg-gray-200" : "bg-purple-200"
                  }`}
                >
                  {crypto.code}
                </span>
                <input
                  type="number"
                  value={crypto.amount}
                  onChange={(e) => handleCryptoPriceChange(crypto.code, e.target.value)}
                  className="w-16 border-b border-gray-300 p-1 bg-transparent focus:outline-none"
                  step="0.1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 음식사진 업로드 */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">음식사진 업로드</label>
          <label htmlFor="food-image" className="block w-full">
            <div className="w-full bg-gray-300 text-gray-700 py-3 rounded text-center cursor-pointer">첨부하기</div>
            <input id="food-image" type="file" accept="image/*" onChange={handleImageAttach} className="hidden" />
          </label>
          {menuItem.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">선택된 파일: {menuItem.image.name}</p>
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                이미지 자리
              </div>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3 mt-6">
          {isEditMode && (
            <button onClick={handleDelete} className="w-full bg-red-500 text-white py-3 rounded">
              삭제하기
            </button>
          )}
          <button onClick={handleSubmit} className="w-full bg-[#0a2e65] text-white py-3 rounded">
            {isAddMode ? "추가하기" : "수정하기"}
          </button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav navItems={navItems} />
    </div>
  );
}