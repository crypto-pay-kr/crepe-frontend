import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import MenuList, { MenuItemData } from "@/components/shoppingmall/MenuList";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";
import { stores, menuItems } from "@/mocks/stores";
import Button from "@/components/common/Button";

function MallDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const isSeller = false; // 판매자인지 여부를 확인하는 변수 (예시)

    const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);

    const addToCart = (item: { id: number; name: string; price: number }) => {
        const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
            setCartItems(
                cartItems.map((cartItem) =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                )
            );
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        }
    };

    // id에 해당하는 가게 데이터 찾기
    const store = stores.find((store) => store.id === Number(id));

    if (!store) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-lg font-bold text-gray-500">가게를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <>
            <Header title="가게상세" isStore={false} />
            <div className="overflow-auto bg-white pb-36">
                    <ShopInfo storeId={Number(id)} />
                    <img
                        src="/store-image.png"
                        alt="명동칼국수 가게사진"
                        className="object-contain mt-6 w-full aspect-[0.8]"
                    />
                    <MenuList menuItems={menuItems} addToCart={addToCart} />
                </div>
                {/* New container with horizontal padding */}
                <div className="px-10 py-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            {cartItems.reduce((total, item) => total + item.quantity, 0)}개 항목
                        </span>
                        <span className="font-bold">
                            {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} KRW
                        </span>
                    </div>
                    <div className="flex justify-center gap-4 mb-2">
                        <Button
                            text="취소하기"
                            onClick={() => {
                                setCartItems([]); // reset cart items count
                            }}
                            className="w-1/2 rounded-[9px] font-medium bg-gray-300 text-white shadow-inner"
                        />
                        <Button
                            text="장바구니로 이동"
                            onClick={() => navigate("/mall/store/cart")}
                            className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white"
                        />
                    </div>
                </div>
            <BottomNav />
        </>
    );
}

export default MallDetailPage;