import EmailPassword from "@/components/signup/EmailPassword";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function EmailPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStore = location.pathname.includes("/store/");
  const [email, setEmail] = useState(""); // 사용자 입력 이메일
  const [password, setPassword] = useState(""); // 사용자 입력 비밀번호
  const [errorMessage, setErrorMessage] = useState(""); // 비밀번호 검증 오류 메시지

  // 비밀번호 검증 로직
  const isPasswordValid = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{10,}$/;
    return passwordRegex.test(password);
  };

  const handleNext = () => {
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage("비밀번호는 10자 이상, 숫자/대문자/소문자/특수문자(@$!%?&)를 포함해야 합니다.");
      return;
    }

    // 입력값 저장
    const signUpData = {
      email: email.trim(),
      password: password.trim(),
    };
    sessionStorage.setItem("signUpData", JSON.stringify(signUpData));

    // 다음 페이지로 이동
    navigate(isStore ? "/store/phone" : "/phone");
  };

  return (
    <EmailPassword
      email={email}
      password={password}
      onEmailChange={setEmail} // 이메일 입력 핸들러
      onPasswordChange={(value: string) => {
        setPassword(value);
        if (errorMessage) {
          setErrorMessage(""); // 오류 메시지 초기화
        }
      }} // 비밀번호 입력 핸들러
      onNext={handleNext}
      isStore={isStore}
      errorMessage={errorMessage} // 오류 메시지 전달
    />
  );
}