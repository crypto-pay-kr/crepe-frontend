"use client";

import React, { useState } from "react";
import { StoreInfo } from "./StoreInfo";
import { CartItem } from "./CartItem";
import { CartFooter } from "./CartFooter";
import { CartItemType, StoreInfoType } from "./type";
import Header from "@/components/common/Header";


const ShoppingCart: React.FC = () => {
    // Sample data for the store info
    const storeInfo: StoreInfoType = {
        name: "명동칼국수 상암IT타워점",
        address: "부천광역시 마장동 본훈구 21동 2층",
        likes: 50,
        isOpen: true,
        supportedCoins: [
            { name: "XRP", className: "bg-zinc-400 bg-opacity-50" },
            { name: "SOL", className: "bg-indigo-700 bg-opacity-30" },
            {
                name: "USDT",
                className: "bg-emerald-400 bg-opacity-60 text-stone-500",
            },
        ],
    };

    // Sample data for cart items
    const [cartItems] = useState<CartItemType[]>([
        {
            id: "1",
            name: "얼큰칼국수",
            price: "9000 KRW",
            quantity: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/21b3ee1a88f4da6a4223eb85b1262623b4483168?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a",
        },
        {
            id: "2",
            name: "얼큰칼국수",
            price: "9000 KRW",
            quantity: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/21b3ee1a88f4da6a4223eb85b1262623b4483168?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a",
        },
        {
            id: "3",
            name: "얼큰칼국수",
            price: "9000 KRW",
            quantity: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/21b3ee1a88f4da6a4223eb85b1262623b4483168?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a",
        },
        {
            id: "4",
            name: "얼큰칼국수",
            price: "9000 KRW",
            quantity: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/21b3ee1a88f4da6a4223eb85b1262623b4483168?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a",
        },
        {
            id: "5",
            name: "얼큰칼국수",
            price: "9000 KRW",
            quantity: 5,
            image: "https://cdn.builder.io/api/v1/image/assets/TEMP/21b3ee1a88f4da6a4223eb85b1262623b4483168?placeholderIfAbsent=true&apiKey=dfb0c1f2d9e8499aa6de387bae897f9a",
        },
    ]);

    const handleAddMore = () => {
        console.log("Add more items");
        // Implementation for adding more items
    };

    const handleSelectPayment = () => {
        console.log("Select payment method");
        // Implementation for selecting payment method
    };

    return (
        <main className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px]">
            <StoreInfo storeInfo={storeInfo} />

            <section
                className="self-center mt-14 w-full h-[424px] max-w-[336px]"
                aria-label="Shopping Cart Items"
            >
                {cartItems.map((item) => (
                    <CartItem key={item.id} item={item} />
                ))}
            </section>

            <CartFooter
                totalAmount="3000 KRW"
                onAddMore={handleAddMore}
                onSelectPayment={handleSelectPayment}
            />
        </main>
    );
};

export default ShoppingCart;
