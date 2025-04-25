"use client"

import Header from "@/components/common/Header"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { stores, cartItems } from "@/mocks/stores";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import { Home, ShoppingBag, User } from "lucide-react";
import BottomNav from "@/components/common/BottomNavigate";
import Button from "@/components/common/Button";

export default function CartPage() {

    const isSeller = false; // 판매자인지 여부를 확인하는 변수 (예시)

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // id에 해당하는 가게 데이터 찾기
    const store = stores.find((store) => store.id === Number(id));

    const [isOpen, setIsOpen] = useState(true);
    const [items, setItems] = useState(cartItems);

    const increaseQuantity = (id: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const calculateTotalPrice = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const totalPrice = calculateTotalPrice();

    const navItems = [
        {
            icon: <Home className="w-6 h-6" color="white" />,
            label: "홈",
            isActive: false,
            onClick: () => navigate("/home"),
        },
        {
            icon: <ShoppingBag className="w-6 h-6" color="white" />,
            label: "쇼핑몰",
            isActive: true, // 현재 활성화된 탭
            onClick: () => navigate("/shoppingmall"),
        },
        {
            icon: <User className="w-6 h-6" color="white" />,
            label: "마이페이지",
            isActive: false,
            onClick: () => navigate(isSeller ? "/my/store" : "/my"),
        },
    ];

    return (
        <>
            <Header title="장바구니" isStore={false} />
            <div className="p-4">
                <ShopInfo storeId={1} />
                <div className="space-y-4 mb-6">
                    <div className="overflow-auto bg-white">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                <div className="flex items-center">
                                    <div className="mr-3">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            width="60"
                                            height="60"
                                            className="rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-sm text-blue-600">{item.price.toLocaleString()} KRW</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center text-blue-600"
                                        onClick={() => decreaseQuantity(item.id)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M5 12H19"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button
                                        className="w-8 h-8 flex items-center justify-center text-blue-600"
                                        onClick={() => increaseQuantity(item.id)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 5V19M5 12H19"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center mb-4">
                        <button
                            className="flex items-center justify-center text-[#002169] font-medium"
                            onClick={() => navigate("/shopping/store")}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-1"
                            >
                                <path
                                    d="M12 5V19M5 12H19"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>더 담으러 가기</span>
                        </button>
                    </div>
                </div>

                <div className="p-4">

                    <div className="flex justify-between items-center py-4 border-t border-b">
                        <span className="font-medium">총금액</span>
                        <span className="font-bold text-lg">{totalPrice.toLocaleString()} KRW</span>

                    </div>
                    <Button
                        text="결제수단 선택"
                        onClick={() => navigate("/shoppingmall/store/order")}
                        className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white"
                    />

                </div>



            </div>

            <BottomNav navItems={navItems} />
        </>
    )
}
