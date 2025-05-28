// src/components/common/NotificationPermissionModal.tsx
"use client";
import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export default function NotificationPermissionModal({
  isOpen,
  onClose,
  onAllow,
  onDeny
}: NotificationPermissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 m-4 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">알림 권한</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">
            새로운 주문과 주문 상태 변경을 실시간으로 알려드릴게요!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700"
          >
            나중에
          </button>
          <button
            onClick={onAllow}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg"
          >
            허용
          </button>
        </div>
      </div>
    </div>
  );
}