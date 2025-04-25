import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../common/Header";
import { Home, ShoppingBag, User } from "lucide-react";
import BottomNav from "../common/BottomNavigate";
import { menuItems } from "@/mocks/stores"; // Import menuItems from stores.ts

export default function ShoppingMallDetail() {
    const navigate = useNavigate();
    const { id } = useParams(); // Retrieve the store ID from the route parameters
    const [cartItems, setCartItems] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
    const [showCartButton, setShowCartButton] = useState(false);

    const isSeller = false; // 판매자인지 여부를 확인하는 변수 (예시)

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
            onClick: () => navigate("/shop"),
        },
        {
            icon: <User className="w-6 h-6" color="white" />,
            label: "마이페이지",
            isActive: false,
            onClick: () => navigate(isSeller ? "/my/store" : "/my"),
        },
    ];

    const storeId = parseInt(id || "0", 10);
    const storeDetails = menuItems.find((item) => item.id === storeId);

    if (!storeDetails) {
        return <div>Store not found</div>;
    }

    const goBack = () => {
        navigate(-1);
    };

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
        setShowCartButton(true);
    };

    return (
        <>
                <div className="relative">
                    <div className="w-full h-64 relative mb-4">
                        <img src={storeDetails.image} alt={storeDetails.name} className="object-cover w-full h-full" />
                    </div>
                    <div className="p-4">
                        <h1 className="text-xl font-bold">{storeDetails.name}</h1>
                        <p className="text-lg text-blue-600">{parseInt(storeDetails.price).toLocaleString()} KRW</p>
                    </div>
                </div>
        </>
    );
}
