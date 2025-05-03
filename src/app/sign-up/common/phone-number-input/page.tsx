import PhoneNumber from "@/components/signup/PhoneNumber";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendSMS } from "@/api/user"; 


export default function PhoneNumberPage() {

  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(""); // 사용자 입력 전화번호
  const isStore = location.pathname.includes("/store/");

  const handleNext = async () => {
    if (!phoneNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    const eliminateDashPhoneNumber = phoneNumber.replace(/-/g, "");

    try {
      const response = await sendSMS(eliminateDashPhoneNumber, "SIGN_UP");

      if (response.ok) {

        // 성공적으로 요청이 완료되면 전화번호를 세션 스토리지에 저장
        const storedData = sessionStorage.getItem("signUpData") || "{}";
        const signUpData = JSON.parse(storedData);
        signUpData.phoneNumber = eliminateDashPhoneNumber;
        sessionStorage.setItem("signUpData", JSON.stringify(signUpData));


        navigate(isStore ? "/store/phone/verification" : "/phone/verification");
      } else {
        const errorData = await response.json();
        alert(`SMS 전송 실패: ${errorData.message}`);
      }
    } catch (error) {
      console.error("SMS 전송 중 오류 발생:", error);
      alert("SMS 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <PhoneNumber
      onNext={handleNext}
      isStore={isStore}
      onPhoneNumberChange={setPhoneNumber} // 전화번호 입력 핸들러
    />
  );
}