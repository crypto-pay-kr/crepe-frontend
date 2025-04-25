import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";
import Header from "@/components/common/Header";
import ProfileHeader from "@/components/profile/ProfileHeader";
import MenuList, { MenuOption } from "@/components/profile/MenuList";
import BottomNav from "@/components/common/BottomNavigate";

export default function MyPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 경로를 기반으로 사용자 타입 결정 (변경된 경로 구조 반영)
  const isSeller = location.pathname.includes('/store');
  
  const handleEditInfo = (): void => {
    // 유저 타입에 따라 다른 편집 페이지로 이동
    if (isSeller) {
      navigate("/store/my/edit-info");
    } else {
      navigate("/home/my/edit-info");
    }
  };

  const handleLogout = (): void => {
    // Logout logic here
    console.log("Logging out...");
  };

  // 메뉴 항목 정의
  const getMenuItems = (): MenuOption[] => {
    const baseMenuItems: MenuOption[] = [
      { label: "내 정보 수정", onClick: handleEditInfo },
    ];
    
    if (isSeller) {
      baseMenuItems.push({ 
        label: "결산리포트", 
        onClick: () => navigate("/store/my/settlement-report") 
      });
    }
    
    baseMenuItems.push(
      { 
        label: "결제 내역", 
        onClick: () => navigate(isSeller ? "/store/my/payment-history" : "/home/my/payment-history") 
      },
      { 
        label: "고객 센터", 
        onClick: () => navigate(isSeller ? "/store/my/customer-support" : "/home/my/customer-support") 
      }
    );
    
    return baseMenuItems;
  };

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: false,
      onClick: () => navigate("/")
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: false,
      onClick: () => navigate("/shop")
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: true,
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my")
    }
  ];

  return (
    <div className="flex flex-col h-screen">
      <Header title={isSeller ? "판매자 페이지" : "마이페이지"} />  
      <main className="flex-1 p-4 bg-gray-50">
        <ProfileHeader 
          username={isSeller ? "판매자동동동" : "유저동동동"} 
          onLogout={handleLogout} 
        />
        <MenuList menuItems={getMenuItems()} />
      </main>
      <BottomNav navItems={navItems} />
    </div>
  );
}