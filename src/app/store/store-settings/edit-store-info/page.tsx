import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@/components/common/Header'
import Button from '@/components/common/Button'
import { ChevronRight } from 'lucide-react'
import BottomNav from '@/components/common/BottomNavigate'
import Input from "@/components/common/Input";
import PaymentCurrencySetModal from "@/components/shoppingmall/PaymentCurrencySetModal";
import {
  updateStoreName,
  updateStoreAddress,
  fetchMyStoreAllDetails
} from "@/api/store";
import { toast } from "react-toastify";
import { ApiError } from "@/error/ApiError";


interface MenuItem {
  menuId: number;
  menuName: string;
  menuPrice: number;
  menuImage: string;
}

interface StoreData {
  storeId: number;
  storeName: string;
  storeAddress: string;
  menuList: MenuItem[];
  // ... 기타 필드들
}

export default function StoreEditInfoPage() {
  const [newStoreName, setStoreName] = useState("")
  const [newAddress, setAddress] = useState("")
  const [originalStoreName, setOriginalStoreName] = useState("") // 원본 데이터 보관용
  const [originalAddress, setOriginalAddress] = useState("") // 원본 데이터 보관용
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  const handleStoreNameUpdate = async () => {
    if (!newStoreName.trim()) {
      toast.error("가게명을 입력해주세요!");
      return;
    }

    // 기존 이름과 같으면 업데이트하지 않음
    if (newStoreName === originalStoreName) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    try {
      const response = await updateStoreName(newStoreName);
      toast.success(`가게명이 "${newStoreName}"(으)로 변경되었습니다.`);
      setOriginalStoreName(newStoreName); // 성공 시 원본 데이터 업데이트
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`); // ApiError의 메시지를 toast로 표시
      } else {
        toast.error("가게명 변경 중 오류가 발생했습니다."); // 일반 오류 처리
      }
    }
  };
  const handleAddressUpdate = async () => {
    if (!newAddress.trim()) {
      toast.error("주소를 입력해주세요!");
      return;
    }

    // 기존 주소와 같으면 업데이트하지 않음
    if (newAddress === originalAddress) {
      toast.info("변경된 내용이 없습니다.");
      return;
    }

    try {
      const response = await updateStoreAddress(newAddress);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "주소 변경에 실패했습니다.");
      }
      toast.success(`주소가 "${newAddress}"(으)로 변경되었습니다.`);
      setOriginalAddress(newAddress); // 성공 시 원본 데이터 업데이트
    } catch (e) {
      if (e instanceof ApiError) {
        toast.error(`${e.message}`); // ApiError의 메시지를 toast로 표시
      } else {
        toast.error("주소 변경 중 오류가 발생했습니다."); // 일반 오류 처리
      }
    }
  };

  const onNext = () => {
    navigate("/store/menu/add", {
      state: { isUser: true }
    });
  }

  const isButtonDisabled = false

  useEffect(() => {
    const loadStoreData = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem("accessToken")!;
        const data: StoreData = await fetchMyStoreAllDetails();
        console.log("API 응답:", data);

        // 기존 데이터를 state에 설정
        setStoreName(data.storeName || "");
        setAddress(data.storeAddress || "");
        setOriginalStoreName(data.storeName || "");
        setOriginalAddress(data.storeAddress || "");
        setMenuItems(data.menuList ?? []);
      } catch (e) {
        if (e instanceof ApiError) {
          toast.error(`${e.message}`); // ApiError의 메시지를 toast로 표시
        } else {
          toast.error("가게 정보를 불러오는 데 실패했습니다."); // 일반 오류 처리
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, []);

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <Header title="메뉴/결제수단 설정" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">가게 정보를 불러오는 중...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header title="메뉴/결제수단 설정" />

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 overflow-auto">
        {/* 가게명 변경 */}
        <div className="bg-white p-5 mb-2">
          <Input
            label="가게명"
            value={newStoreName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="가게명을 입력해주세요."
          />
          <Button
            text="변경하기"
            onClick={handleStoreNameUpdate}
            className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"
          />
        </div>

        {/* 주소 변경 */}
        <div className="bg-white p-5 mb-2">
          <Input
            label="주소"
            value={newAddress}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="주소를 입력해주세요."
          />
          <Button
            text="변경하기"
            onClick={handleAddressUpdate}
            className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"
          />
        </div>

        {/* 결제 수단 지원 설정 */}
        <div className="bg-white p-4 mb-2 cursor-pointer" onClick={() => setModalOpen(true)}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">결제 수단 지원 설정</h2>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {menuItems.map((item) => (
            <div
              key={item.menuId}
              className="flex justify-between items-center py-2 border-t border-gray-200 cursor-pointer"
              onClick={() => navigate(`/store/menu/edit/${item.menuId}`)}
            >
              <div>
                <h3 className="font-medium">{item.menuName}</h3>
                <p className="text-sm text-gray-600">{item.menuPrice.toLocaleString()} KRW</p>
              </div>
              <img
                src={item.menuImage || "/placeholder.svg"}
                alt={item.menuName}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          ))}

          {/* 메뉴 추가 버튼 */}
          <div className="p-3">
            <Button
              text="메뉴 추가하기"
              onClick={onNext}
              color={isButtonDisabled ? "gray" : "blue"}
              className="mt-3 w-full bg-[#0a2158] text-white py-3 rounded-lg font-medium"
            />
          </div>
        </div>
      </div>

      <PaymentCurrencySetModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="결제 수단 선택"
        coins={[
          { name: "XRP" },
          { name: "USDT" },
          { name: "SOL" }
        ]}
      />

      <BottomNav />
    </div>
  )
}