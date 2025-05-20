import { CartItem } from "@/hooks/useCartItems";
import React from "react";
import QuantityControl from "./QuantityControl";


interface CartItemCardProps {
    item: CartItem;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item, onIncrease, onDecrease }) => {
    return (
        <div className="flex justify-between items-center border-b pb-4">
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
            <QuantityControl
                quantity={item.quantity}
                onIncrease={() => onIncrease(item.id)}
                onDecrease={() => onDecrease(item.id)}
            />
        </div>
    );
};

export default CartItemCard;