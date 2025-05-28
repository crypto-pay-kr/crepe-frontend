import PhoneNumber from "@/components/signup/PhoneNumber";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendSMS } from "@/api/user";

export default function PhoneNumberPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); // 사용자 입력 전화번호
  const [isSending, setIsSending] = useState(false); // SMS 요청 중 여부
  const [phoneMessage, setPhoneMessage] = useState(""); // 전화번호 검증 메시지
  const isStore = location.pathname.includes("/store/");

  const handleNext = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneMessage("유효한 전화번호를 입력해주세요.");
      return;
    }

    const eliminateDashPhoneNumber = phoneNumber.replace(/-/g, "");

    if (isSending) return; // 중복 요청 방지

    setIsSending(true); // 요청 시작
    try {
      const response = await sendSMS(eliminateDashPhoneNumber, "SIGN_UP");

      if (response.ok) {
        // 성공적으로 요청이 완료되면 전화번호를 세션 스토리지에 저장
        const storedData = sessionStorage.getItem("signUpData") || "{}";
        const signUpData = JSON.parse(storedData);
        signUpData.phoneNumber = eliminateDashPhoneNumber;
        sessionStorage.setItem("signUpData", JSON.stringify(signUpData));

        // 다음 단계로 이동
        navigate(isStore ? "/store/phone/verification" : "/phone/verification");
      } else {
        const errorData = await response.json();
        setPhoneMessage(errorData.message || "SMS 전송 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("SMS 전송 중 오류 발생:", error);
      setPhoneMessage("SMS 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSending(false); // 요청 종료
    }
  };

  return (
    <PhoneNumber
      onNext={handleNext}
      isStore={isStore}
      onPhoneNumberChange={setPhoneNumber} // 전화번호 입력 핸들러
      phoneMessage={phoneMessage} // 메시지 전달
      isSending={isSending} // 요청 상태 전달
    />
  );
}