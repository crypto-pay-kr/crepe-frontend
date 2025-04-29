import React from "react";

interface ProfileHeaderProps {
  username: string;
  onLogout: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, onLogout }) => {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{username}</h2>
        <button 
          onClick={onLogout} 
          className="bg-gray-200 hover:bg-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};
export default ProfileHeader;