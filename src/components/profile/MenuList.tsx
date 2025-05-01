import React from "react";
import MenuItem from "./MenuItem";
import { ReactNode } from "react";

export interface MenuOption {
  label: string;
  onClick: () => void;
  icon?: ReactNode; // 아이콘 추가
}

interface MenuListProps {
  menuItems: MenuOption[];
}

const MenuList: React.FC<MenuListProps> = ({ menuItems }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      {menuItems.map((item, index) => (
        <MenuItem 
          key={index} 
          label={item.label} 
          onClick={item.onClick}
          icon={item.icon} // 아이콘 전달
        />
      ))}
    </div>
  );
};

export default MenuList;