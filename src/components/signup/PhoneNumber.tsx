import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../common/Header";
import Button from "../common/Button";
import { sendSMS } from "@/api/user";

interface PhoneNumberProps {
  onNext: () => void;
  isStore: boolean;
  onPhoneNumberChange: (phone: string) => void;
}

export default function PhoneNumber({
  onNext,
  isStore,
  onPhoneNumberChange,
}: PhoneNumberProps) {
  const navigate = useNavigate(); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");
  const [phoneMessage, setPhoneMessage] = useState(""); // 전화번호 검증 메시지
  const [phoneMessageColor, setPhoneMessageColor] = useState(""); 
  const [isPhoneValid, setIsPhoneValid] = useState(false); // 전화번호 유효성 여부

  useEffect(() => {
    if (phoneNumber) {
      let formatted = phoneNumber.replace(/[^0-9]/g, "");

      if (formatted.length > 3 && formatted.length <= 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3)}`;
      } else if (formatted.length > 7) {
        formatted = `${formatted.slice(0, 3)}-${formatted.slice(3, 7)}-${formatted.slice(7, 11)}`;
      }

      setFormattedNumber(formatted);
    } else {
      setFormattedNumber("");
    }
  }, [phoneNumber]);

  // 전화번호 입력 처리
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9-]/g, ""); // 숫자와 '-'만 허용
    setPhoneNumber(value.replace(/-/g, "")); // '-' 제거 후 상태 업데이트
    onPhoneNumberChange(value.replace(/-/g, "")); // 부모 컴포넌트로 전달
    setPhoneMessage(""); // 메시지 초기화
    setIsPhoneValid(false); // 유효성 초기화
  };

// SMS 인증 요청
  const handleSendSMS = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setPhoneMessage("유효한 전화번호를 입력해주세요.");
      setPhoneMessageColor("text-red-500");
      return;
    }

    try {
      const response = await sendSMS(phoneNumber, "SIGN_UP");
      if (response.ok) {
        setPhoneMessage("인증번호가 전송되었습니다.");
        setPhoneMessageColor("text-green-500");
        setIsPhoneValid(true);

        // 성공 시 자동으로 다음 단계로 이동
        setTimeout(() => {
          onNext();
        }, 1000); // 1초 후 다음 단계로 이동
      } else {
        const errorData = await response.json();
        setPhoneMessage(errorData.message || "SMS 전송 중 오류가 발생했습니다.");
        setPhoneMessageColor("text-red-500");
        setIsPhoneValid(false);
      }
    } catch (error) {
      console.error("SMS 전송 중 오류 발생:", error);
      setPhoneMessage("SMS 전송 중 오류가 발생했습니다.");
      setPhoneMessageColor("text-red-500");
      setIsPhoneValid(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={2} isStore={isStore} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">휴대폰 번호를</h2>
          <p className="text-2xl font-bold mb-8">입력해주세요</p>
        </div>
        <div className="flex-1 px-4">
          <div className="border-b border-gray-300 py-2">
            <div className="text-sm text-gray-500 mb-1">Phone Number</div>
            <input
              type="tel"
              value={formattedNumber}
              onChange={handlePhoneNumberChange}
              placeholder="010-0000-0000"
              className="w-full focus:outline-none text-gray-800 text-lg"
            />
            {phoneMessage && (
              <p className="text-sm mt-2 text-red-500">{phoneMessage}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <Button
          text="인증번호 요청"
          onClick={handleSendSMS}
          color="primary"
        />
      </div>
    </div>
  );
}