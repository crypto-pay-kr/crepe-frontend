import React from "react";
import { COLORS } from "../../constants/colors";
import { Home, ShoppingBag, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
                                               icon,
                                               label,
                                               isActive,
                                               onClick,
                                             }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${isActive ? "text-blue-900" : "text-gray-500"}`}
  >
    {icon}
    <span className="text-xs mt-1 text-white">{label}</span>
  </button>
);

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSeller = location.pathname.includes("/store");
  const isUser = location.pathname.includes("/user");
  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: location.pathname === "/coin",
      onClick: () => navigate("/user-coin" ),
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: location.pathname === "/shop",
      onClick: () => navigate("/shoppingmall"),
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: location.pathname.includes("/my"),
      onClick: () => navigate(isSeller ? "/store/my" : "/home/my"),
    },
  ];

  return (
    <nav className={`bg-[${COLORS.blue}] border-t flex justify-around py-3`}>
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