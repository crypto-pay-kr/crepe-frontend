import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User } from "lucide-react";
import { Settings, BarChart2, CreditCard, HelpCircle } from "lucide-react";
import Header from "@/components/common/Header";
import ProfileHeader from "@/components/profile/ProfileHeader";
import MenuList, { MenuOption } from "@/components/profile/MenuList";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useEffect, useState } from "react";
import { fetchMyUserInfo } from "@/api/user";
import { fetchMyStoreAllDetails } from "@/api/store";


export default function MyPage(): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("...");
  const token = localStorage.getItem("accessToken");

  // 경로를 기반으로 사용자 타입 결정 (변경된 경로 구조 반영)
  const isSeller = location.pathname.includes('/store');

  const handleEditInfo = (): void => {
    // 유저 타입에 따라 다른 편집 페이지로 이동
    if (isSeller) {
      navigate("/store/my/edit");
    } else {
      navigate("/home/my/edit");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        if (isSeller) {
          const storeData = await fetchMyStoreAllDetails(token);
          setUsername(storeData.storeName);
        } else {
          const userData = await fetchMyUserInfo(token);
          setUsername(userData.nickname);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };

    fetchUserData();
  }, [token, isSeller]);

  const handleLogout = (): void => {
    // Logout logic here
    console.log("Logging out...");
  };

  // 메뉴 항목 정의
  const getMenuItems = (): MenuOption[] => {
    const baseMenuItems: MenuOption[] = [
      {
        label: "내 정보 수정",
        onClick: handleEditInfo,
        icon: <Settings size={18} color="#6366f1" />
      },
    ];

    if (isSeller) {
      baseMenuItems.push({
        label: "결산리포트",
        onClick: () => navigate("/settlement"),
        icon: <BarChart2 size={18} color="#10b981" />
      });
    }

    baseMenuItems.push(
      {
        label: "결제 내역",
        onClick: () => navigate(isSeller ? "/store/my/payment-history" : "/home/my/payment-history"),
        icon: <CreditCard size={18} color="#f59e0b" />
      },
      {
        label: "고객 센터",
        onClick: () => navigate(isSeller ? "/store/my/customer-support" : "/home/my/customer-support"),
        icon: <HelpCircle size={18} color="#0ea5e9" />
      }
    );

    return baseMenuItems;
  };



  return (
    <div className="flex flex-col h-screen">
      <Header title={isSeller ? "판매자 페이지" : "마이페이지"} />
      <main className="flex-1 p-4 bg-gray-50">
        <ProfileHeader
          username={username}
          onLogout={handleLogout}
        />
        <MenuList menuItems={getMenuItems()} />
      </main>
      <BottomNav  />
    </div>
  );
}