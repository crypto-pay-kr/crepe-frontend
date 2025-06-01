import { useState } from "react";
import { CartItem } from "@/types/cart"; 

export function useCartItems() {
    const [items, setItems] = useState<CartItem[]>(() => {
        // 초기 상태를 localStorage에서 가져오거나 빈 배열로 설정
        const storedItems = localStorage.getItem("cartItems");
        return storedItems ? JSON.parse(storedItems) : [];
    });
    
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
    
    return {
        items,
        setItems,
        increaseQuantity,
        decreaseQuantity,
        calculateTotalPrice
    };
}