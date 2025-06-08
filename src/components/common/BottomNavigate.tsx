import React from "react";
import { COLORS } from "../../constants/colors";
import { Home, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { isSellerToken } from "@/utils/authUtils";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center
      relative py-2 px-4 rounded-xl
      transition-all duration-200 ease-out
      flex-1 min-w-0
      focus:outline-none focus:ring-0 focus:border-0
      ${isActive
      ? "bg-blue-50 shadow-sm transform scale-105"
      : "hover:bg-gray-50 active:scale-95"
    }
    `}
  >
    <div className={`
      transition-all duration-200
      ${isActive ? "text-blue-600 scale-110" : "text-gray-500"}
    `}>
      {icon}
    </div>
    <span className={`
      text-xs mt-1 font-medium transition-all duration-200
      ${isActive ? "text-blue-600" : "text-gray-500"}
      whitespace-nowrap
    `}>
      {label}
    </span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-blue-500 rounded-full shadow-sm" />
    )}
  </button>
);

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = sessionStorage.getItem("accessToken");
  const isSeller = isSellerToken(token);

  const navItems = [
    {
      icon: <Home className="w-6 h-6" />,
      label: "홈",
      isActive: location.pathname === "/my/coin",
      onClick: () => navigate("/my/coin"),
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: "쇼핑몰",
      isActive: location.pathname === "/mall" || location.pathname === "/store",
      onClick: () => navigate(isSeller ? "/store" : "/mall"),
    },
    {
      icon: <User className="w-6 h-6" />,
      label: "마이페이지",
      // 수정된 부분: 정확한 마이페이지 경로만 체크
      isActive: (isSeller && location.pathname === "/store/my") || 
                (!isSeller && location.pathname === "/user/my"),
      onClick: () => navigate(isSeller ? "/store/my" : "/user/my"),
    },
  ];

  return (
    <nav className={`
      bg-white/95 
      flex items-center
      py-1.5 px-4
      relative
      focus:outline-none 
      before:absolute before:inset-0 before:bg-gradient-to-t before:from-gray-50/30 before:to-transparent before:pointer-events-none
    `}>
      {navItems.map((item, index) => (
        <NavButton
          key={index}
          icon={item.icon}
          label={item.label}
          isActive={item.isActive}
          onClick={item.onClick}
        />
      ))}
    </nav>
  );
};

export default BottomNav;