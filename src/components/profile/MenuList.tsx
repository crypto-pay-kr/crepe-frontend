import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface MenuOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: string; // 배지 텍스트 (예: "활성화됨", "미설정")
}

interface MenuListProps {
  menuItems: MenuOption[];
}

export default function MenuList({ menuItems }: MenuListProps): React.ReactElement {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
            index === 0 ? 'rounded-t-xl' : ''
          } ${
            index === menuItems.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <div className="flex-shrink-0">
                {item.icon}
              </div>
            )}
            <span className="text-gray-900 font-medium text-left">
              {item.label}
            </span>
            {item.badge && (
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                item.badge === '활성화됨' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.badge}
              </span>
            )}
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      ))}
    </div>
  );
}