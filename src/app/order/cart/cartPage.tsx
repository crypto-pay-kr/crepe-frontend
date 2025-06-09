import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import CartItemList from "@/components/order/CartItemList";
import CartSummary from "@/components/order/CartSummary";
import AddMoreItemsButton from "@/components/order/AddMoreItemButton";
import { CartItem } from "@/types/cart";
import { getStoreDetail } from "@/api/shop";
// store.ts에서 StoreDetail 타입을 가져옵니다.
import type { StoreDetail } from "@/types/store";
import CryptocurrencyTags from "@/components/common/CryptocurrencyTags";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  const [storeData, setStoreData] = useState<StoreDetail | null>(null);

  const id = items.length > 0 ? items[0].storeId : 0;
  
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    } else {
      console.warn("로컬 스토리지에 장바구니 데이터가 없습니다.");
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const loadStoreData = async () => {
        try {
          const id = items[0].storeId; // items에서 storeId 추출
          const data = await getStoreDetail(id);
          setStoreData(data);
        } catch (err) {
          console.error("Error fetching store data:", err);
        }
      };
      loadStoreData();
    }
  }, [items]);

  const totalPrice = items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  useEffect(() => {
    localStorage.setItem("totalPrice", totalPrice.toString());
  }, [totalPrice]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="장바구니" isStore={false} />

      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          {/* 상점 정보 카드 */}
          <div className="text-center px-4 mt-4 mb-5">
            <h2 className="text-2xl font-bold tracking-tight">
              {storeData?.storeNickname}
            </h2>

            <p className="text-base tracking-tight mt-2 text-gray-700">
              주소: {storeData?.storeAddress}
            </p>

            <div className="flex justify-center mt-5 mb-5">
              <CryptocurrencyTags coins={storeData?.coinList || []} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
              주문 상품 목록
            </h2>
            <div className="space-y-5">
              <CartItemList
                items={items}
                onIncrease={(id) => {
                  setItems(prevItems => {
                    const updated = prevItems.map(item =>
                      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    localStorage.setItem("cartItems", JSON.stringify(updated));
                    return updated;
                  });
                }}
                onDecrease={(id) => {
                  setItems(prevItems => {
                    const updated = prevItems.map(item =>
                      item.id === id
                        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                        : item
                    ).filter(item => item.quantity > 0);
                    localStorage.setItem("cartItems", JSON.stringify(updated));
                    return updated;
                  });
                }}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <AddMoreItemsButton onClick={() => navigate(`/mall/store/${id}`)} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 mb-12">
            <CartSummary
              totalPrice={totalPrice}
              onCheckoutClick={() => navigate("/mall/store/order")}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}