import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

export default function SignupCompletePage() {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col">
      {/* 상단 인삿말 */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-0.5">
          <div className="flex items-center gap-0">
            <img
              src="/crepe-newlogosmall.png"
              alt="Crepe Logo"
              className="w-[120px] h-[100px] object-contain"
            />
            <span className="text-2xl font-bold text-slate-700 leading-none pb-[3px]">에</span>
          </div>
          <p className="text-2xl font-bold text-slate-700 leading-tight ml-4">
            오신 것을 환영합니다
          </p>
        </div>
      </div>

      {/* 중앙 이미지 */}
      <div className="flex-grow flex items-center justify-center">
        <div className="relative w-50 h-52">
          <img src="/crepe-newlogo.png" alt="Crepe Logo" className="w-full h-full" />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="pt-5 pb-10 px-5">
        <Button text="다음" onClick={handleNext} />
      </div>
    </div>
  );
}
