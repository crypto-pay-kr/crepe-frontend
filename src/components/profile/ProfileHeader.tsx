import React from 'react';
import { Shield, ShieldCheck, ShieldX, LogOut, AlertTriangle } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  onLogout: () => void;
  hasOtpEnabled: boolean;
}

export default function ProfileHeader({ username, onLogout, hasOtpEnabled }: ProfileHeaderProps): React.ReactElement {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* 프로필 아바타 */}
          <div 
            className="w-16 h-16 rounded-full border-1 border-gray-400 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #93c5fd, #d8b4fe)'
            }}
          >
            <span className="text-white text-xl font-semibold" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
              {username.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* 사용자 정보 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{username}</h2>
            <div className="flex items-center space-x-2 mt-1">
              {hasOtpEnabled ? (
                <div className="flex items-center space-x-1">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">보안 강화됨</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <ShieldX className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-orange-600 font-medium">보안 취약</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* 로그아웃 버튼 */}
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">로그아웃</span>
        </button>
      </div>
      
      {/* 간소화된 보안 상태 표시 */}
      <div className={`rounded-lg p-3 ${hasOtpEnabled ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex items-center space-x-2">
          {hasOtpEnabled ? (
            <ShieldCheck className="w-4 h-4 text-green-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          )}
          <span className={`text-sm font-medium ${hasOtpEnabled ? 'text-green-800' : 'text-orange-800'}`}>
            {hasOtpEnabled ? '2차 인증으로 계정이 보호되고 있습니다' : '2차 인증 설정을 권장합니다'}
          </span>
        </div>
      </div>
    </div>
  );
}