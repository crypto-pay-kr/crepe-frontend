import BottomNav from "@/components/common/BottomNavigate";
import Header from "@/components/common/Header";
import MenuList, { MenuItemData } from "@/components/shoppingmall/MenuList";
import ShopInfo from "@/components/shoppingmall/ShoppingmallInfo";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";
import { stores, menuItems } from "@/mocks/stores";
import Button from "@/components/common/Button";

function MyStoreManagePage() {
    const navigate = useNavigate();

    const isSeller = true;

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
            <Header title="내 가게 관리" isStore={true} />
            <div className="relative overflow-auto bg-white pb-36">
                <div className="pb-24"> {/* 버튼 높이만큼 아래쪽 패딩 추가 */}
                    <ShopInfo storeId={1} />
                    <img
                        src="/store-image.png"
                        alt="명동칼국수 가게사진"
                        className="object-contain mt-6 w-full aspect-[0.8]"
                    />
                    <MenuList menuItems={menuItems} />
                </div>
            </div>
                            
            {isSeller && (
                    <div className="sticky bottom-16 left-0 right-0 flex justify-center space-x-4 px-10 py-4 bg-white shadow-lg border-t border-gray-200">
                        <Button
                            text="가게정보 수정"
                            onClick={() => navigate("/store-settings")}
                            className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white shadow-inner"
                        />
                        <Button
                            text="정산요청"
                            onClick={() => navigate("/store-coin")}
                            className="w-1/2 rounded-[9px] font-medium bg-[#0C2B5F] text-white shadow-inner"
                        />
                    </div>
                )}
            <BottomNav navItems={navItems} />
        </>
    );
}

export default MyStoreManagePage;