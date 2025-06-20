import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/common/Header";
import { VerificationOption } from "@/components/signup/VerificationOption";
import { KoreanEmblem } from "@/components/signup/KoreanEmblem";


export default function IDVerificationStep1() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const signupState = location.state?.signupState || {};

  const handleOptionClick = () => {
    // step01 → step02로 이동 (상품 데이터 포함)
    navigate("/id/verification/step2", {
      state: {
        from: location.pathname,
        signupState: {
          ...signupState,
          // ...
        },
      },
    });
  };
  return (
    <div className="flex flex-col h-full">
      <Header title="본인확인" />

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-bold text-[#4B5EED] mb-2">STEP1 신분증 확인</h1>
        <p className="text-gray-600 mb-6">원하는 방법을 선택해주세요</p>

        <div className="flex justify-center my-8">
          <div className="border w-80 h-40 rounded flex items-center justify-center">
            <img
              src="/idcard-emoticon.png"
              alt="ID Card Emoticon"
              className="object-contain w-full h-full"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <VerificationOption icon={<KoreanEmblem />} label="주민등록증" onClick={handleOptionClick} />

          <VerificationOption icon={<KoreanEmblem />} label="운전면허증" onClick={handleOptionClick} />
        </div>
      </div>

    </div>
  )
}
