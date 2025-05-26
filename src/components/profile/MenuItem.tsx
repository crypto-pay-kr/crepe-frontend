import React, { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface MenuItemProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode; // 아이콘 추가
}

const MenuItem: React.FC<MenuItemProps> = ({ label, onClick, icon }) => {
  return (
    <button 
      onClick={onClick} 
      className="w-full flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
    >
      <div className="flex py-2 items-center gap-3">
        {icon && <div>{icon}</div>}
        <span className="text-gray-700">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-400" />
    </button>
  );
};

export default MenuItem;