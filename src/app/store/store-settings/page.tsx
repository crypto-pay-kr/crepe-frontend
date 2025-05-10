import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import MenuList, { MenuItemData } from "@/components/shoppingmall/MenuList";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";


export default function StoreSettingsPage() {
    const navigate = useNavigate();

    const isSeller = true;

    return (
        <>
            <Header title="내 가게 관리" isStore={true} />
            <div className="relative overflow-auto bg-white pb-36">
                <div className="pb-24">
                  <ShopInfo />
                </div>
            </div>
                            
            {isSeller && (
                    <div className="sticky bottom-16 left-0 right-0 flex justify-center space-x-4 px-10 py-4 bg-white shadow-lg border-t border-gray-200">
                        <Button
                            text="가게정보 수정"
                            onClick={() => navigate("/store/my/edit")}
                            className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white shadow-inner"
                        />
                        <Button
                            text="정산요청"
                            onClick={() => navigate("/settlement")}
                            className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white shadow-inner"
                        />
                    </div>
                )}
            <BottomNav />
        </>
    );
}
