import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import Button from "@/components/common/Button";
import BottomNav from "@/components/common/BottomNavigate";
import ImageUploader from "@/components/common/ImageUploader";
import Input from '@/components/common/Input' // Import the ImageUploader component

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

export default function MenuEditPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>(); 
  
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
          { code: "XRP", amount: 3.2 },
          { code: "SOL", amount: 3.2 },
        ],
        image: null,
      });
      // 실제로는 가격에 따라 자동으로 계산되기 때문에 cryptoPrices 값은 중요하지 않습니다
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


  const handleImageChange = (file: File) => {
    setMenuItem({ ...menuItem, image: file });
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

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <Header
        title={isAddMode ? "메뉴 추가" : "메뉴 수정"}/>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-4 bg-white overflow-auto">
        {/* 음식명 */}
        <div className="mb-4 mt-5">
          <Input
            label="음식명"
            value={menuItem.name}
            onChange={(value) => setMenuItem({ ...menuItem, name: value })}
            placeholder="음식명을 입력해주세요."
          />
        </div>

        {/* 가격 */}
        <div className="mb-4">
          <Input
            label="가격"
            value={menuItem.price}
            onChange={(value) => setMenuItem({ ...menuItem, price: value.replace(/[^0-9]/g, "") })}
            placeholder="가격을 입력해주세요."
            type="text"
          />
        </div>

        {/* 각 코인 금액 - 자동 계산 */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">각 코인 금액</label>
          <div className="space-y-3">
            {menuItem.cryptoPrices.map((crypto) => (
              <div key={crypto.code} className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    crypto.code === "XRP" ? "bg-gray-200 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {crypto.code}
                </span>
                <span className="font-medium">
                  {menuItem.price ? (parseFloat(menuItem.price) / 2500).toFixed(2) : "0.00"} {crypto.code}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">* 원화 가격 입력 시 자동으로 코인 가격이 계산됩니다.</p>
          </div>
        </div>

        {/* 이미지 업로드 - ImageUploader 컴포넌트 사용 */}
        <div className="mb-6">
          <ImageUploader
            label="음식사진 업로드"
            previewLabel="선택된 이미지"
            onChange={handleImageChange}
            value={menuItem.image}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3 mt-6">
          {isEditMode && (
            <Button text="삭제하기" onClick={handleDelete} className="w-full bg-red-500 text-white py-3 rounded-lg"></Button>
          )}
          <Button text={isAddMode ? "추가하기" : "수정하기"} onClick={handleSubmit} className="w-full bg-[#0a2e65] text-white py-3 rounded-lg">
          </Button>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNav/>
    </div>
  );
}