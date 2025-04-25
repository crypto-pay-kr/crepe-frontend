import React, { useState } from "react";

interface PhoneChangeFormProps {
  onSuccess: () => void;
}

export default function PhoneChangeForm({ onSuccess }: PhoneChangeFormProps): React.ReactElement {
  const [phone, setPhone] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isCodeSent, setIsCodeSent] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");

  const validatePhone = (phone: string): boolean => {
    // 기본적인 한국 휴대폰 번호 형식 검증 (010-1234-5678 또는  )
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    return phoneRegex.test(phone);
  };

  const sendVerificationCode = (): void => {
    if (!phone) {
      setPhoneError("휴대전화번호를 입력해주세요.");
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError("휴대전화번호 형식이 올바르지 않습니다.");
      return;
    }

    // 인증번호 발송 성공 시
    setPhoneError("");
    setIsCodeSent(true);
    // 실제 구현에서는 API 호출 등을 통해 인증번호 발송
  };

  const verifyCode = (): void => {
    if (!verificationCode) {
      setCodeError("인증번호를 입력해주세요.");
      return;
    }

    // 인증번호 검증 (예: 1234라고 가정)
    if (verificationCode === "1234") {
      setIsVerified(true);
      setCodeError("");
    } else {
      setCodeError("인증번호가 맞지 않습니다.");
    }
  };

  const handlePhoneChange = (): void => {
    if (!isVerified) {
      setCodeError("휴대폰 번호 인증을 먼저 완료해주세요.");
      return;
    }

    // 휴대폰 변경 성공 시 성공 콜백 호출
    onSuccess();
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-2">휴대폰 변경</h2>
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">휴대전화번호를 입력해주세요.</label>
        <div className="flex">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setIsCodeSent(false);
              setIsVerified(false);
            }}
            className={`flex-1 border rounded p-2 ${phoneError ? "border-red-500" : ""}`}
            placeholder="휴대전화번호를 입력해주세요."
            disabled={isVerified}
          />
          <button 
            onClick={sendVerificationCode} 
            className={`ml-2 border px-3 py-2 rounded ${
              isVerified 
                ? "bg-gray-100 text-gray-500 border-gray-300" 
                : "bg-white border-[#0a2e65] text-[#0a2e65]"
            }`}
            disabled={isVerified}
          >
            인증번호 전송
          </button>
        </div>
        {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
      </div>

      {isCodeSent && (
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">인증번호 입력</label>
          <div className="flex">
            <input 
              type="text" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={`flex-1 border rounded p-2 ${codeError ? "border-red-500" : ""}`} 
              placeholder="인증번호를 입력해주세요." 
              disabled={isVerified}
            />
            <button 
              onClick={verifyCode} 
              className={`ml-2 border px-3 py-2 rounded ${
                isVerified 
                  ? "bg-gray-100 text-gray-500 border-gray-300" 
                  : "bg-white border-[#0a2e65] text-[#0a2e65]"
              }`}
              disabled={isVerified}
            >
              번호 확인
            </button>
          </div>
          {codeError ? (
            <p className="text-xs text-red-500 mt-1">{codeError}</p>
          ) : isVerified ? (
            <p className="text-xs text-green-500 mt-1">인증이 완료되었습니다.</p>
          ) : null}
        </div>
      )}

      <button 
        onClick={handlePhoneChange} 
        className={`w-full py-3 rounded ${
          isVerified 
            ? "bg-[#0a2e65] text-white" 
            : "bg-gray-300 text-gray-500"
        }`}
        disabled={!isVerified}
      >
        변경하기
      </button>
    </div>
  );
}