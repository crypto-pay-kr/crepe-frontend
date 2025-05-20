import { useState } from "react";
import Header from "../common/Header";
import Button from "../common/Button";
import { useNavigate, useLocation } from "react-router-dom";

interface PhoneVerificationProps {
  onNext: () => void;
  buttonColor: "blue" | "gray";
  isStore?: boolean;
  onToggleColor: () => void;
  onCodeChange: (code: string) => void; // 인증 코드 변경 핸들러
}

export default function PhoneVerification({
  onNext,
  buttonColor,
  isStore,
  onToggleColor,
  onCodeChange,
}: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const location = useLocation();

  // 인증 코드 입력 처리
  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // 부모 컴포넌트로 전체 인증 코드 전달
      onCodeChange(newCode.join(""));

      // 다음 입력 필드로 포커스 이동
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // 번호 변경 처리
  const handleChangeNumber = () => {
    // 경로에 따라 다른 페이지로 이동
    if (location.pathname.includes("/store/")) {
      navigate("/store/phone");
    } else {
      navigate("/phone");
    }
  };

  // 버튼 활성화 여부
  const isButtonDisabled = verificationCode.some((digit) => !digit);

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
          <div className="grid grid-cols-6 gap-2 mb-10">
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

          <div className="text-center mb-16">
            <span className="text-gray-500 text-sm">코드가 전송되지 않았나요? </span>
            <button className="text-blue-600 text-sm font-medium">코드 재전송</button>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#0066FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V12"
                    stroke="#0066FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="#0066FF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">인증번호 유효시간</h3>
                <p className="text-sm text-gray-600">
                  인증번호는 SMS로 발송되며, 5분 동안 유효합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow"></div>
      </main>

      <div className="p-5 bg-white">
        <Button
          text={buttonColor === "blue" ? "다음" : "인증하기"}
          onClick={() => {
            onToggleColor();
            if (buttonColor === "blue") {
              onNext();
            }
          }}
          className={`w-full py-3.5 rounded-xl font-medium text-white ${
            isButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : buttonColor === "blue"
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}