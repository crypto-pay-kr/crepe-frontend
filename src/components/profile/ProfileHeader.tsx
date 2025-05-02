import React from "react";
import { LogOut } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, onLogout }) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{username}</h2>
          <button 
            onClick={onLogout} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ProfileHeader;