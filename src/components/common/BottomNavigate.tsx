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

const NavButton: React.FC<NavButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${isActive ? "text-blue-900" : "text-gray-500"}`}
  >
    {icon}
    <span className="text-xs mt-1 text-white">{label}</span>
  </button>
);

/**
 * 토큰 문자열을 수동으로 파싱해 페이로드(JSON)을 추출하는 함수
 */
function parseJwt(token: string) {
  try {
    // JWT는 3개의 마침표로 구분된 문자열입니다. [0]=header, [1]=payload, [2]=signature
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    // base64Url -> base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // base64 디코딩 후 JSON 파싱
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT 파싱 중 오류 발생:", error);
    return null;
  }
}

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = sessionStorage.getItem("accessToken") || "";
  let role = "";
  if (token) {
    const decoded = parseJwt(token);
    // 파싱이 정상적으로 됐다면 role 값을 꺼냄
    if (decoded && decoded.role) {
      role = decoded.role;
    }
  }
  const isSeller = role === "SELLER";

  const navItems = [
    {
      icon: <Home className="w-6 h-6" color="white" />,
      label: "홈",
      isActive: location.pathname === "/my/coin",
      onClick: () => navigate("/my/coin"),
    },
    {
      icon: <ShoppingBag className="w-6 h-6" color="white" />,
      label: "쇼핑몰",
      isActive: location.pathname === "/mall" || location.pathname === "/store",
      onClick: () => navigate(isSeller ? "/store" : "/mall"),
    },
    {
      icon: <User className="w-6 h-6" color="white" />,
      label: "마이페이지",
      isActive: location.pathname.includes("/my"),
      onClick: () => navigate(isSeller ? "/store/my" : "/user/my"),
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