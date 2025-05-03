import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/common/Header";
import BottomNav from "@/components/common/BottomNavigate";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import CartItemList from "@/components/order/CartItemList";
import AddMoreItemsButton from "@/components/order/AddMoreItemButton";
import CartSummary from "@/components/order/CartSummary";
import { fetchStoreDetail } from "@/api/shop";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}
export default function CartPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const storeId = id ? parseInt(id) : 1;
  
    // 서버에서 받아온 가게 정보
    const [storeData, setStoreData] = useState<{
      likeCount: number;
      storeName: string;
      storeAddress: string;
      coinStatus: any[];
    } | null>(null);
  
    // 로컬 스토리지 장바구니
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
    // 가게 상세 정보 가져오기
    useEffect(() => {
      const loadStoreData = async () => {
        try {
          const data = await fetchStoreDetail(storeId);
          setStoreData({
            likeCount: data.likeCount,
            storeName: data.storeName,
            storeAddress: data.storeAddress,
            coinStatus: data.coinStatus,
          });
        } catch (err) {
          console.error(err);
        }
      };
      loadStoreData();
    }, [storeId]);
  
    // 컴포넌트 마운트 시 로컬 스토리지에서 장바구니 읽어오기
    useEffect(() => {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }, []);
  
    // 수량 증가
    const increaseQuantity = (id: number) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    };
  
    // 수량 감소
    const decreaseQuantity = (id: number) => {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    };
  
    // 총 결제 금액 계산
    const calculateTotalPrice = () =>
      cartItems.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
  
    // "더 담으러 가기" 버튼 클릭 시 로컬 스토리지에 장바구니 저장
    const handleAddMoreItems = () => {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      navigate(`/mall/store/${storeId}`);
    };
  
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="장바구니" isStore={false} />
  
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            {/* 상점 정보 */}
            <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
              {storeData && (
                <ShopInfo
                  likeCount={storeData.likeCount}
                  storeName={storeData.storeName}
                  storeAddress={storeData.storeAddress}
                  coinStatus={storeData.coinStatus}
                />
              )}
            </div>
  
            {/* 장바구니 섹션 */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                주문 상품 목록
              </h2>
  
              {/* 장바구니 아이템 목록 */}
              <div className="space-y-5">
                <CartItemList
                  items={cartItems}
                  onIncrease={increaseQuantity}
                  onDecrease={decreaseQuantity}
                />
              </div>
  
              {/* 더 담으러 가기 버튼 */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <AddMoreItemsButton onClick={handleAddMoreItems} />
              </div>
            </div>
  
            {/* 결제 정보 */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-12">
              <CartSummary
                totalPrice={calculateTotalPrice()}
                onCheckoutClick={() => navigate("/mall/store/order")}
              />
            </div>
          </div>
        </div>
  
        <BottomNav />
      </div>
    );
  }