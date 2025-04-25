import React, { useState } from "react";

interface PasswordChangeFormProps {
  onSuccess: () => void;
}

export default function PasswordChangeForm({ onSuccess }: PasswordChangeFormProps): React.ReactElement {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState<boolean>(false);

  const verifyCurrentPassword = (): void => {
    // 실제 구현에서는 API 호출 등을 통해 현재 비밀번호 검증
    if (currentPassword) {
      setIsCurrentPasswordVerified(true);
    } else {
      setPasswordError("비밀번호를 입력해주세요.");
    }
  };

  const handlePasswordChange = (): void => {
    if (!isCurrentPasswordVerified) {
      setPasswordError("현재 비밀번호를 먼저 확인해주세요.");
      return;
    }

    if (!newPassword) {
      setPasswordError("새로운 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 변경 성공 시 성공 콜백 호출
    setPasswordError("");
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">비밀번호 변경</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">기존 비밀번호를 입력해주세요.</label>
        <div className="flex">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="비밀번호를 입력해주세요."
            disabled={isCurrentPasswordVerified}
          />
          <button 
            onClick={verifyCurrentPassword} 
            className={`ml-2 border px-3 py-2 rounded ${
              isCurrentPasswordVerified 
                ? "bg-gray-100 text-gray-500 border-gray-300" 
                : "bg-white border-[#0a2e65] text-[#0a2e65]"
            }`}
            disabled={isCurrentPasswordVerified}
          >
            비밀번호확인
          </button>
        </div>
      </div>

      {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">새로운 비밀번호 입력</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="비밀번호를 입력해주세요."
          disabled={!isCurrentPasswordVerified}
        />
        <p className="text-xs text-gray-500 mt-1">영문, 숫자, 특수기호를 혼합 8~16자리의 비밀번호</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">새로운 비밀번호 확인</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="비밀번호를 입력해주세요."
          disabled={!isCurrentPasswordVerified}
        />
        {newPassword && confirmPassword && newPassword !== confirmPassword && (
          <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
        )}
      </div>

      <button 
        onClick={handlePasswordChange} 
        className={`w-full py-3 rounded ${
          isCurrentPasswordVerified 
            ? "bg-[#0a2e65] text-white" 
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!isCurrentPasswordVerified}
      >
        변경하기
      </button>
    </div>
  );
}