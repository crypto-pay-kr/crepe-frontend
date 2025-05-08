import Header from "@/components/common/Header";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import BottomNav from "@/components/common/BottomNavigate";
import CartItemList from "@/components/order/CartItemList";
import CartSummary from "@/components/order/CartSummary";
import AddMoreItemsButton from "@/components/order/AddMoreItemButton";
import { CartItem } from "@/types/cart";
import { getStoreDetail } from "@/api/shop";
import { StoreDetail } from "@/types/store";


export default function CartPage() {

    const navigate = useNavigate();

    const [items, setItems] = useState<CartItem[]>([]);
    const id = items.length > 0 ? items[0].storeId : 0;

    // 2) 가게 상세 정보
    const [storeData, setStoreData] = useState<{
        likeCount: number;
        storeName: string;
        storeAddress: string;
        coinStatus: any[];
    } | null>(null);


    // 3) 컴포넌트 마운트 시 로컬 스토리지에서 cartItems 불러오기
    useEffect(() => {
        const savedCart = localStorage.getItem("cartItems");
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        } else {
            console.warn("로컬 스토리지에 장바구니 데이터가 없습니다.");
            navigate(-1);
        }
    }, []);

    // 4) 가게 상세 정보 API 호출
    useEffect(() => {
        if (items.length > 0) {
            const loadStoreData = async () => {
                try {
                    const id = items[0].storeId; // items에서 storeId 추출
                    console.log("Fetching store data for id:", id);

                    const data = await getStoreDetail(id);
                    setStoreData({
                        likeCount: data.likeCount,
                        storeName: data.storeName,
                        storeAddress: data.storeAddress,
                        coinStatus: data.coinStatus,
                    });
                } catch (err) {
                    console.error("Error fetching store data:", err);
                }
            };
            loadStoreData();
        }
    }, [items]);

        // 총 금액 계산 및 로컬 스토리지에 저장
        const totalPrice = items.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);
        useEffect(() => {
            localStorage.setItem("totalPrice", totalPrice.toString());
        }, [totalPrice]);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* 헤더를 일반 흐름에 배치 (fixed 없음) */}
            <Header title="장바구니" isStore={false} />

            {/* 스크롤 가능한 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-5">
                    {/* 상점 정보 카드 */}
                    <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
                        <ShopInfo
                            storeId={Number(id)}
                            likeCount={storeData?.likeCount || 0}
                            coinStatus={storeData?.coinStatus || []}
                            storeName={storeData?.storeName || ""}
                            storeAddress={storeData?.storeAddress || ""}
                        />
                    </div>

                    {/* 장바구니 섹션 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
                            주문 상품 목록
                        </h2>

                        {/* 로컬 스토리지에서 불러온 cartItems 목록 표시 */}
                        <div className="space-y-5">
                            <CartItemList
                                items={items}
                                // 필요 시 수량 증가/감소 로직도 이곳에서 구현 가능
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

                        {/* 더 담으러 가기 버튼 */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                            <AddMoreItemsButton onClick={() => navigate(`/mall/store/${id}`)} />
                        </div>
                    </div>

                    {/* 결제 정보 카드 */}
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-12">
                        <CartSummary
                            totalPrice={totalPrice}
                            onCheckoutClick={() => navigate("/mall/store/order")}
                        />
                    </div>
                </div>
            </div>

            {/* 바텀 네비게이션 */}
            <BottomNav />
        </div>
    );
}