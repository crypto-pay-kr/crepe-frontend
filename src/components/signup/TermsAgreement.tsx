import { useState } from "react";
import Header from "../common/Header";
import Button from "../common/Button";
import CheckCircle from "../common/CheckCircle";
import ChevronRight from "../common/ChevronRight";

interface TermsAgreementProps {
  onNext: () => void;
  isStore?: boolean;
}

export default function TermsAgreement({ onNext, isStore }: TermsAgreementProps) {
  const [agreements, setAgreements] = useState({
    all: false,
    terms: false,
    privacy: false,
  });

  const handleToggleAll = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
    });
  };

  const handleToggleItem = (key: "terms" | "privacy") => {
    const newAgreements = {
      ...agreements,
      [key]: !agreements[key],
    };

    // Update "all" checkbox based on individual items
    newAgreements.all = newAgreements.terms && newAgreements.privacy;

    setAgreements(newAgreements);
  };

  const isButtonActive = agreements.terms && agreements.privacy;

  return (
    <div className="h-full flex flex-col bg-white">
      <Header title="시작하기" isStore={isStore} />

      <main className="flex-1 overflow-auto px-5 pb-24 flex flex-col">
        <div className="flex-1 flex flex-col justify-center items-center mb-8">
          <div className="text-center -mt-16">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">서비스 이용을 위해</h2>
            <p className="text-2xl font-bold text-gray-900">이용약관 동의가 필요합니다</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-5 mb-6 shadow-sm">
          {/* All agreements checkbox */}
          <div 
            className="flex items-center py-4 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
            onClick={handleToggleAll}
          >
            <CheckCircle checked={agreements.all} />
            <span className="ml-3 text-base font-medium text-gray-800">모든 약관에 동의합니다.</span>
          </div>

          <div className="h-px bg-gray-200 my-2 mx-1"></div>

          {/* Terms of Service */}
          <div
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
            onClick={() => handleToggleItem("terms")}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.terms} />
              <span className="ml-3 text-base text-gray-800">
                이용약관 <span className="text-gray-500 font-medium">(필수)</span>
              </span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>

          {/* Privacy Policy */}
          <div
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-gray-100 rounded-lg px-3 transition-colors"
            onClick={() => handleToggleItem("privacy")}
          >
            <div className="flex items-center">
              <CheckCircle checked={agreements.privacy} />
              <span className="ml-3 text-base text-gray-800">
                개인정보 처리방침 <span className="text-gray-500 font-medium">(필수)</span>
              </span>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      </main>

      <div className="p-5 bg-white">
        <Button 
          text="다음" 
          onClick={onNext} 
          className={`w-full py-3.5 rounded-lg font-medium text-white ${
            isButtonActive 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isButtonActive}
        />
      </div>
    </div>
  );
}