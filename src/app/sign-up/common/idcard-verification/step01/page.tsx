import { useNavigate } from "react-router-dom"


import Header from "@/components/common/Header";
import { VerificationOption } from "@/components/signup/VerificationOption";
import { KoreanEmblem } from "@/components/signup/KoreanEmblem";


export default function IDVerificationStep1() {
    const navigate = useNavigate();


  const handleOptionClick = () => {
    navigate("/id/verification/step2")
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="본인확인" />

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-[#0a2d6b] mb-2">STEP1 신분증 확인</h1>
        <p className="text-gray-600 mb-6">원하는 방법을 선택해주세요</p>

        <div className="border-t border-gray-200 pt-6">
          <VerificationOption icon={<KoreanEmblem/>} label="주민등록증" onClick={handleOptionClick} />

          <VerificationOption icon={<KoreanEmblem />} label="운전면허증" onClick={handleOptionClick} />
        </div>
      </div>

    </div>
  )
}
