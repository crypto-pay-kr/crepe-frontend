import React from 'react';
import { LogOut, Shield } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  onLogout: () => void;
  hasOtpEnabled?: boolean; // 2차 인증 활성화 여부
}

export default function ProfileHeader({ 
  username, 
  onLogout, 
  hasOtpEnabled = false 
}: ProfileHeaderProps): React.ReactElement {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-black text-xl font-bold">
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {username}
              </h2>
              {hasOtpEnabled && (
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <Shield size={12} className="text-green-600" />
                  <span className="text-xs font-medium text-green-600">2차인증</span>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">프로필 관리</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="로그아웃"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
}