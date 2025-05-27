import React from "react";
import Header from "../common/Header";
import Button from "../common/Button";
import Input from "../common/Input";
export interface EmailPasswordProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEmailBlur: () => void; // 이메일 입력 후 포커스 아웃 핸들러
  onNext: () => void;
  isStore: boolean;
  emailMessage: string; // 이메일 검증 메시지
  emailMessageColor: string; // 메시지 색상
  isEmailValid: boolean; // 이메일 유효성 여부
  passwordMessage: string; // 비밀번호 검증 메시지
}

export default function EmailPassword({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onNext,
  isStore,
  emailMessage,
  emailMessageColor,
  isEmailValid,
  passwordMessage,
}: EmailPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false); // 비밀번호 표시 상태

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 버튼 활성화 여부
  const isButtonDisabled = !isEmailValid || !password;

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={1} isStore={isStore} />

      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">회원가입을 위한</h2>
          <p className="text-2xl font-bold mb-8">정보를 입력해주세요</p>
        </div>

        <div className="flex-1">
          {/* 이메일 입력 */}
          <div className="mb-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              onBlur={onEmailBlur} // 포커스 아웃 시 이메일 중복 확인
              placeholder="이메일을 입력해주세요"
            />
            {emailMessage && (
              <p className={`text-sm ${emailMessageColor}`}>{emailMessage}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-4">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              disabled={!isEmailValid} // 이메일 유효하지 않으면 비활성화
            />
            {passwordMessage && (
              <p className="text-red-500 text-sm">{passwordMessage}</p>
            )}
          </div>
        </div>

        {/* 자동으로 늘어나는 여백 추가 */}
        <div className="flex-grow"></div>
      </main>

      <div className="p-5 bg-white">
        <Button
          text="다음"
          onClick={onNext}
          className={`w-full py-3.5 rounded-lg font-medium text-white ${
            isButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={isButtonDisabled}
        />
      </div>
    </div>
  );
}