import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import { useState, useEffect } from "react";

const AnimationStyles = () => (
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `}
  </style>
);

export default function SignupCompletePage() {
  const navigate = useNavigate();

  const [showGreeting, setShowGreeting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 200);
    const t2 = setTimeout(() => setShowLogo(true), 700);
    const t3 = setTimeout(() => setShowButton(true), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleNext = () => {
    navigate("/login");
  };

  return (
    <div className="h-full flex flex-col">
      <AnimationStyles />

      <div className="flex-1 flex flex-col items-center justify-center">
        <div
          className={`transition-all duration-700 ${
            showGreeting ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } flex flex-col items-center space-y-0.5`}
        >
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
        <div
          className={`relative w-50 h-52 transition-all duration-700 ${
            showLogo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={showLogo ? { animation: "float 3s ease-in-out infinite" } : {}}
        >
          <img src="/crepe-newlogo.png" alt="Crepe Logo" className="w-full h-full" />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-12 pt-0">
        <Button
          text="다음"
          onClick={handleNext}
          className="w-full py-3.5 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700"
        />
      </div>
    </div>
  );
}