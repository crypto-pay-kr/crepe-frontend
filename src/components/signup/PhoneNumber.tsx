import { useState, useEffect } from "react";
import Header from "../common/Header";
import Button from "../common/Button";

interface PhoneNumberProps {
  onNext: () => void;
  isStore: boolean;
  onPhoneNumberChange: (phone: string) => void;
  phoneMessage: string; // 전화번호 검증 메시지
  isSending: boolean; // SMS 요청 중 여부
}

export default function PhoneNumber({
  onNext,
  isStore,
  onPhoneNumberChange,
  phoneMessage,
  isSending,
}: PhoneNumberProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formattedNumber, setFormattedNumber] = useState("");

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
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="회원가입" progress={2} isStore={isStore} />
      <div className="flex-1 flex flex-col p-5">
        <div className="mb-8">
          <h2 className="text-2xl text-gray-800 font-bold mb-2">휴대폰 번호를</h2>
          <p className="text-2xl text-gray-800 font-bold mb-8">입력해주세요</p>
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
      <div className="p-12 mt-10">
        <Button
          text={isSending ? "요청 중..." : "인증번호 요청"}
          onClick={onNext}
          color="primary"
          disabled={isSending} // 요청 중 버튼 비활성화
        />
      </div>
    </div>
  );
}