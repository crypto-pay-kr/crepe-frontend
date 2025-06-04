import React, { useEffect, useState } from "react";
import CryptocurrencyTags from "../common/CryptocurrencyTags";
import { changeStoreStatus, fetchMyStoreAllDetails, likeStore, unlikeStore } from '@/api/store'
import { Check, Heart } from 'lucide-react'
import { toast } from "react-toastify"; 
import { ApiError } from "@/error/ApiError";

interface ShopInfoDTO {
  storeId: number;
  storeName: string;
  storeNickname: string;
  storeAddress: string;
  likeCount: number;
  storeStatus: "OPEN" | "CLOSED";
  storeImageUrl: string;
  coinList: string[];
  menuList: any[];
}

function ShopInfo() {
  const [shopInfo, setShopInfo] = useState<ShopInfoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const data = await fetchMyStoreAllDetails();
        setShopInfo(data);
      } catch (err) {
        if (err instanceof ApiError) {
          toast.error(`${err.message}`); 
        } else {
          toast.error("가게 정보를 불러오는 데 실패했습니다."); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStoreInfo();
  }, []);


  const toggleStoreStatus = async () => {
    if (!shopInfo) return;
    const newStatus = shopInfo.storeStatus === "OPEN" ? "CLOSED" : "OPEN";
  
    try {
      await changeStoreStatus(newStatus);
      setShopInfo({ ...shopInfo, storeStatus: newStatus });
      toast.success(`가게 상태가 "${newStatus === "OPEN" ? "영업 중" : "영업 종료"}"로 변경되었습니다.`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`${err.message}`);
      } else {
        toast.error("가게 상태 변경 중 오류가 발생했습니다."); 
      }
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!shopInfo) return null;


  return (
    <div className="flex flex-col self-center mt-3 w-full text-center">

      <div className="flex justify-between items-center px-4 w-full mt-2">
        {/* 상태 표시 */}
        <div
          onClick={toggleStoreStatus}
          className={`flex items-center text-base font-semibold cursor-pointer transition duration-150 ${shopInfo.storeStatus === "OPEN" ? "text-green-800" : "text-red-600"
            }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 border ${shopInfo.storeStatus === "OPEN"
              ? "border-green-700 bg-green-100"
              : "border-gray-300 bg-gray-300"
              }`}
          >

            {shopInfo.storeStatus === "OPEN" && <Check size={14} className="text-white" />}
          </div>
          {shopInfo.storeStatus === "OPEN" ? "영업 중" : "영업 종료"}
        </div>

        {/* 좋아요 버튼 */}
        <div className="flex items-center text-sm text-zinc-500">
          <Heart size={18} className="mr-1 fill-red-500 stroke-red-500" />
          좋아요 {shopInfo.likeCount}개
        </div>
      </div>

      {/* 가게 이름 */}
      <h2 className="text-3xl font-bold tracking-tight">
        {shopInfo.storeNickname}
      </h2>

      {/* 가게 주소 */}
      <p className="text-base tracking-tight mt-2 text-gray-700">
        {shopInfo.storeAddress}
      </p>

      {/* 암호화폐 태그 */}
      <div className="flex justify-center mt-3 mb-2">
        <CryptocurrencyTags coins={shopInfo.coinList} />
      </div>

      {/* 가게 이미지  */}
      <h2 className="text-xl font-bold tracking-tight">
        <img
          src={shopInfo.storeImageUrl}
          alt="가게 이미지"
          className="w-full h-auto rounded-lg"
        />
      </h2>

      {/* 메뉴 리스트 */}
      <div className="mt-6 px-4">
        <h3 className="text-lg font-semibold mb-2 text-left">메뉴 목록</h3>
        {shopInfo.menuList.length === 0 ? (
          <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
        ) : (
          <ul>
            {shopInfo.menuList.map((menu, index) => (
              <li
                key={menu.menuId}
                className={`flex items-center gap-4 py-3 ${index !== shopInfo.menuList.length - 1 ? "border-b border-gray-200" : ""
                  }`}
              >
                <div className="flex-1 text-left">
                  <p className="font-semibold text-base">{menu.menuName}</p>
                  <p className="text-sm text-gray-600">
                    {typeof menu.menuPrice === "number"
                      ? `${menu.menuPrice.toLocaleString()}KRW`
                      : "가격 정보 없음"}
                  </p>
                </div>
                <img
                  src={menu.menuImage || "/placeholder.svg"}
                  alt={menu.menuName}
                  className="w-16 h-16 object-cover rounded-md"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShopInfo;