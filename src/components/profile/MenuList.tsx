import React from "react";
import MenuItem from "./MenuItem";

export interface MenuOption {
  label: string;
  onClick: () => void;
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
        />
      ))}
    </div>
  );
};

export default MenuList;