import React, { useState } from "react";

interface NicknameChangeFormProps {
  onSuccess: () => void;
  onSubmit: (data: { newNickname: string }) => Promise<void>;
}

export default function NicknameChangeForm({ onSuccess,  onSubmit, }: NicknameChangeFormProps): React.ReactElement {
  const [oldNickname, setOldNickname] = useState<string>("");
  const [newNickname, setNewNickname] = useState<string>("");
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

  const handleNicknameChange = async (): Promise<void> => {
    if (!isNicknameVerified) {
      setNicknameError("닉네임 중복 확인을 먼저 해주세요.");
      return;
    }

    try {
      await onSubmit({ newNickname: nickname });
      onSuccess();
    } catch (err) {
      console.error("닉네임 변경 실패", err);
      setNicknameError("닉네임 변경 중 오류가 발생했습니다.");
    }
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
            className="ml-2 text-sm bg-white bg-[#4B5EED]  px-3 py-2 rounded text-[#4B5EED] border border-[#4B5EED]"
          >
            중복 확인
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
        className={`w-full py-2 rounded ${
          isNicknameVerified
            ? "bg-[#4B5EED] text-white"
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!isNicknameVerified}
      >
        변경하기
      </button>
    </div>
  );
}