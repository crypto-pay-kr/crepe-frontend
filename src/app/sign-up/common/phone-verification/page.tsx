import { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { verifySMS } from "@/api/user"; // 인증 요청 API
import Header from "@/components/common/Header";

interface PhoneVerificationProps {
  isStore?: boolean;
  errorMessage?: string; // 에러 메시지
}

export default function PhoneVerification({ isStore }: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const navigate = useNavigate();
  const location = useLocation();

  // 인증 코드 입력 처리
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // 다음 입력 필드로 포커스 이동
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // 모든 입력 필드가 채워졌는지 확인
  useEffect(() => {
    const isCodeComplete = verificationCode.every((digit) => digit !== "");
    if (isCodeComplete) {
      handleVerify(); // 모든 입력 필드가 채워지면 인증 요청
    }
  }, [verificationCode]);

  // 인증 요청 처리
  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      setErrorMessage("6자리 인증 코드를 입력해주세요.");
      return;
    }

    try {
      const storedData = sessionStorage.getItem("signUpData");
      if (!storedData) {
        setErrorMessage("회원가입 정보를 찾을 수 없습니다.");
        return;
      }

      const { phoneNumber } = JSON.parse(storedData);

      const response = await verifySMS(code, phoneNumber, "SIGN_UP");

      if (response.ok) {
        // 성공 시 다음 페이지로 이동
        const signUpData = JSON.parse(storedData);
        signUpData.phoneNumber = phoneNumber;
        sessionStorage.setItem("signUpData", JSON.stringify(signUpData));

        if (!isStore) {
          navigate("/additional/info");
        } else {
          navigate("/store/register");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("인증 요청 중 오류 발생:", error);
      setErrorMessage("인증 요청 중 오류가 발생했습니다.");
    }
  };

  // 번호 변경 처리
  const handleChangeNumber = () => {
    if (location.pathname.includes("/store/")) {
      navigate("/store/phone");
    } else {
      navigate("/phone");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={3} isStore={isStore} />

      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-2">휴대폰 번호 인증</h2>
          <p className="text-sm text-gray-500 mb-1">
            휴대폰에 전송된 6자리 숫자를 입력해주세요
          </p>
          <button
            className="text-blue-600 text-sm font-medium"
            onClick={handleChangeNumber}
          >
            번호 변경
          </button>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-6 gap-2 mb-4">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-full h-14 bg-transparent border-b-2 border-gray-200 text-center text-xl font-medium focus:border-blue-500 focus:outline-none transition-all"
              />
            ))}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <div className="text-center mb-16">
            <span className="text-gray-500 text-sm">코드가 전송되지 않았나요? </span>
            <button className="text-blue-600 text-sm font-medium">코드 재전송</button>
          </div>
        </div>

        <div className="flex-grow"></div>
      </main>
    </div>
  );
}