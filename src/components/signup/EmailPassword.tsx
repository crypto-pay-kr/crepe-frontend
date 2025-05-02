import React from "react";
import Header from "../common/Header";
import Button from "../common/Button";
import Input from "../common/Input";

export interface EmailPasswordProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNext: () => void;
  isStore: boolean;
  errorMessage: string;
}

export default function EmailPassword({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onNext,
  isStore,
  errorMessage,
}: EmailPasswordProps) {
  const [showPassword, setShowPassword] = React.useState(false); // 비밀번호 표시 상태

  // 비밀번호 표시 토글
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 버튼 활성화 여부
  const isButtonDisabled = !email || !password;

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={1} isStore={isStore} />

      <main className="flex-1 overflow-auto px-6 pt-6 pb-24 flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">회원가입을 위한</h2>
          <p className="text-2xl font-bold mb-8">정보를 입력해주세요</p>
        </div>

        <div className="flex-1">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="이메일을 입력해주세요"
          />
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
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