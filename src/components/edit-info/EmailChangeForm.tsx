import React, { useState } from "react";

interface EmailChangeFormProps {
  onSuccess: () => void;
}

export default function EmailChangeForm({ onSuccess }: EmailChangeFormProps): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (): void => {
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("E-mail 주소가 형식에 맞지 않습니다.");
      return;
    }

    // 이메일 변경 성공 시 성공 콜백 호출
    setEmailError("");
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">이메일 변경</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">이메일을 입력해주세요.</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (e.target.value && !validateEmail(e.target.value)) {
              setEmailError("E-mail 주소가 형식에 맞지 않습니다.");
            } else {
              setEmailError("");
            }
          }}
          className={`w-full border rounded p-2 ${emailError ? "border-red-500" : ""}`}
          placeholder="이메일을 입력해주세요."
        />
        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
      </div>

      <button 
        onClick={handleEmailChange} 
        className="w-full bg-[#0a2e65] text-white py-3 rounded"
      >
        변경하기
      </button>
    </div>
  );
}