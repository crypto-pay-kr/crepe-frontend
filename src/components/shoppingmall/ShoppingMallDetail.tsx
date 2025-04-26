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
