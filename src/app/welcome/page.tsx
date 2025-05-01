import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-between px-5 py-10">
      {/* 상단 문장 부분 */}
      <div className="mt-8 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <img
            src="/crepe-newlogo2.png"
            alt="Crepe 로고"
            className="w-[370px] h-[210px] object-contain mb-[-20px]"
          />
        </div>
        <p className="text-xl font-semibold text-center leading-snug text-slate-700">
          지갑 없이도, <br />
          가상화폐를 포인트로 간편하게!
        </p>
      </div>

      {/* 하단 버튼 및 텍스트 */}
      <div className="w-full mt-20 mb-10 px-5">
        <div className="flex flex-col space-y-3">
          <div className="text-center text-sm">
            <span>이미 가입하셨나요? </span>
            <button className="text-[#0a5ca8] font-medium" onClick={() => navigate("/login")}>
              로그인 하기
            </button>
          </div>

          {/* 지금 시작하기 버튼 */}
          <Button
            text="지금 시작하기"
            onClick={() => navigate("/terms")}
            className="w-full rounded-[9px] font-medium bg-[#0C2B5F] text-white py-3 mx-auto px-4"
          />

          {/* 가맹점 회원가입 */}
          <div className="text-center text-sm">
            <span>사장님이신가요? </span>
            <button className="text-[#0a5ca8] font-medium" onClick={() => navigate("/terms?store=true")}>
              가맹점 회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
