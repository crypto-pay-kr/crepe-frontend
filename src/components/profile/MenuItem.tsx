import React from "react";

interface MenuItemProps {
  label: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick }) => (
  <button 
    onClick={onClick} 
    className="w-full py-4 px-4 border-b flex justify-between items-center hover:bg-gray-50 transition-colors"
  >
    <span>{label}</span>
    <span>&gt;</span>
  </button>
);

export default MenuItem;