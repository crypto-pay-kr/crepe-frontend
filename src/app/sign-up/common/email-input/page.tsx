import EmailPassword from "@/components/signup/EmailPassword";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { checkEmailDuplicate } from "@/api/user";

export default function EmailPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStore = location.pathname.includes("/store/");
  const [email, setEmail] = useState(""); // 사용자 입력 이메일
  const [password, setPassword] = useState(""); // 사용자 입력 비밀번호
  const [emailMessage, setEmailMessage] = useState(""); // 이메일 검증 메시지
  const [emailMessageColor, setEmailMessageColor] = useState(""); // 메시지 색상 (빨간색/초록색)
  const [isEmailValid, setIsEmailValid] = useState(false); // 이메일 유효성 여부
  const [passwordMessage, setPasswordMessage] = useState(""); // 비밀번호 검증 메시지
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호 유효성 여부

  // 비밀번호 검증 로직
  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{10,}$/;
    return passwordRegex.test(password);
  };

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    if (!email.trim()) {
      setEmailMessage("이메일을 입력해주세요.");
      setEmailMessageColor("text-red-500");
      setIsEmailValid(false);
      return;
    }

    try {
      const errorMessage = await checkEmailDuplicate(email.trim());
      if (errorMessage) {
        // 서버에서 반환된 메시지 출력 (빨간색)
        setEmailMessage(errorMessage);
        setEmailMessageColor("text-red-500");
        setIsEmailValid(false);
      } else {
        // 사용 가능한 이메일 (초록색)
        setEmailMessage("사용 가능한 이메일입니다.");
        setEmailMessageColor("text-green-500");
        setIsEmailValid(true);
      }
    } catch (error) {
      console.error("이메일 중복 확인 중 오류 발생:", error);
      setEmailMessage("이메일 중복 확인 중 오류가 발생했습니다.");
      setEmailMessageColor("text-red-500");
      setIsEmailValid(false);
    }
  };

  // 비밀번호 변경 시 검증
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    if (!validatePassword(value)) {
      setPasswordMessage("비밀번호는 10자 이상, 숫자/대문자/소문자/특수문자(@$!%?&)를 포함해야 합니다.");
      setIsPasswordValid(false);
    } else {
      setPasswordMessage("");
      setIsPasswordValid(true);
    }
  };

  const handleNext = () => {
    if (!email.trim() || !password.trim()) {
      setEmailMessage("이메일과 비밀번호를 모두 입력해주세요.");
      setEmailMessageColor("text-red-500");
      return;
    }

    if (!isPasswordValid) {
      setPasswordMessage("비밀번호를 올바르게 입력해주세요.");
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
      onEmailChange={(value: string) => {
        setEmail(value);
        setEmailMessage(""); // 이메일 메시지 초기화
        setIsEmailValid(false); // 이메일 유효성 초기화
      }}
      onPasswordChange={handlePasswordChange} // 비밀번호 변경 시 검증
      onEmailBlur={handleEmailCheck} // 이메일 입력 후 포커스 아웃 시 중복 확인
      onNext={handleNext}
      isStore={isStore}
      emailMessage={emailMessage}
      emailMessageColor={emailMessageColor}
      isEmailValid={isEmailValid}
      passwordMessage={passwordMessage} // 비밀번호 검증 메시지 전달
    />
  );
}