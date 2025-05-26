import { useState } from "react";
import { cartItems } from "@/mocks/stores";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export function useCartItems() {
    const [items, setItems] = useState<CartItem[]>(cartItems);
    
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