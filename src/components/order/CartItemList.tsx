import React from "react";
import { CartItem } from "@/hooks/useCartItems";

interface CartItemListProps {
    items: CartItem[];
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
}

const CartItemList: React.FC<CartItemListProps> = ({ items, onIncrease, onDecrease }) => {
    return (
        <div className="space-y-5">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <div className="flex-shrink-0 mr-4">
                        <div className="relative">
                            <img
                                src={item.image} // 이미지 표시
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg shadow-sm"
                            />
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                                {item.quantity}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-base font-medium text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-blue-600 font-medium">
                            {item.price.toLocaleString()} KRW
                        </p>
                    </div>

                    <div className="flex items-center space-x-1">
                        <button
                            className="w-8 h-8 flex items-center justify-center text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={() => onDecrease(item.id)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5 12H19"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <span className="w-6 text-center font-medium text-gray-700">{item.quantity}</span>
                        <button
                            className="w-8 h-8 flex items-center justify-center text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            onClick={() => onIncrease(item.id)}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    );
};

export default CartItemList;