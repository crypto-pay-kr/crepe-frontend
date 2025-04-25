import React from "react";
import { COLORS } from "../../constants/colors";

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  className?: string; 
}



const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  label, 
  isActive,
  onClick
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${isActive ? "text-blue-900" : "text-gray-500"}`}
  >
    {icon}
    <span className="text-xs mt-1 text-white">{label}</span>
  </button>
);

interface BottomNavProps {
  navItems: Array<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick?: () => void;
  }>;
}

const BottomNav: React.FC<BottomNavProps> = ({ navItems }) => {
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