import React, { useState } from "react";

interface NicknameChangeFormProps {
  onSuccess: () => void;
}

export default function NicknameChangeForm({ onSuccess }: NicknameChangeFormProps): React.ReactElement {
  const [nickname, setNickname] = useState<string>("");
  const [isNicknameVerified, setIsNicknameVerified] = useState<boolean>(false);
  const [nicknameError, setNicknameError] = useState<string>("");

  const checkNicknameDuplicate = (): void => {
    // 실제 구현에서는 API 호출 등을 통해 닉네임 중복 검증
    if (!nickname) {
      setNicknameError("닉네임을 입력해주세요.");
      return;
    }
    
    // 닉네임 중복 검사 성공 시
    setIsNicknameVerified(true);
    setNicknameError("");
  };

  const handleNicknameChange = (): void => {
    if (!isNicknameVerified) {
      setNicknameError("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    // 닉네임 변경 성공 시 성공 콜백 호출
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">닉네임 변경</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">닉네임을 입력해주세요.</label>
        <div className="flex">
          <input
            type="text"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              setIsNicknameVerified(false); // 닉네임 변경 시 검증 상태 초기화
            }}
            className="flex-1 border rounded p-2"
            placeholder="닉네임을 입력해주세요."
          />
          <button 
            onClick={checkNicknameDuplicate} 
            className="ml-2 bg-white border border-[#0a2e65] text-[#0a2e65] px-3 py-2 rounded"
          >
            중복확인
          </button>
        </div>
        
        {nicknameError ? (
          <p className="text-xs text-red-500 mt-1">{nicknameError}</p>
        ) : isNicknameVerified ? (
          <p className="text-xs text-green-500 mt-1">사용 가능한 닉네임입니다.</p>
        ) : null}
      </div>

      <button 
        onClick={handleNicknameChange} 
        className={`w-full py-3 rounded ${
          isNicknameVerified 
            ? "bg-[#0a2e65] text-white" 
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!isNicknameVerified}
      >
        변경하기
      </button>
    </div>
  );
}