import PhoneVerification from "@/components/signup/PhoneVerification";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { verifySMS } from "@/api/user"; 

export default function PhoneVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStore = location.pathname.includes("/store/");
  const [verificationCode, setVerificationCode] = useState(""); // 인증 코드
  const [phoneNumber, setPhoneNumber] = useState(""); // 전화번호

  // 인증 요청 처리
  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("6자리 인증 코드를 입력해주세요.");
      return;
    }

    try {
      const storedData = sessionStorage.getItem("signUpData");
      if (!storedData) {
        alert("회원가입 정보를 찾을 수 없습니다.");
        return;
      }

      const { phoneNumber } = JSON.parse(storedData);

      const response = await verifySMS(verificationCode, phoneNumber, "SIGN_UP");

      if (response.ok) {
        // 성공 시 전화번호를 세션 스토리지에 저장
        const signUpData = JSON.parse(storedData);
        signUpData.phoneNumber = phoneNumber;
        sessionStorage.setItem("signUpData", JSON.stringify(signUpData));

        // 다음 페이지로 이동
        if (!isStore) {
          navigate("/additional/info");
        } else {
          navigate("/store/register");
        }
      } else {
        const errorData = await response.json();
        alert(`인증 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("인증 요청 중 오류 발생:", error);
      alert("인증 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <PhoneVerification
      onNext={handleVerify} // 인증 요청 처리
      buttonColor="blue"
      isStore={isStore}
      onToggleColor={() => {}}
      onCodeChange={setVerificationCode} // 인증 코드 입력 핸들러
    />
  );
}