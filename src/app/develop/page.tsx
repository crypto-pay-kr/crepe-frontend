import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Clock, Sparkles, Zap } from 'lucide-react';
import Button from "@/components/common/Button";

interface UnderDevelopmentProps {
  buttonClassName?: string;
}

export default function UnderDevelopment({ buttonClassName }: UnderDevelopmentProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-8 pb-10 bg-gradient-to-br">

      {/* 로고 */}
      <div className="relative z-10">
        <img
          src="/crepe-newlogo2.png"
          alt="Logo"
          className="object-contain w-[400px] aspect-[2.51] mx-auto  animate-pulse"
        />
      </div>

      {/* 개발중 메시지 */}
      <div className="mt-8 w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-2xl w-full text-center relative overflow-hidden">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100/30 via-pink-100/30 to-orange-100/30 rounded-3xl"></div>

          {/* 아이콘 */}
          <div className="flex justify-center mb-6 relative z-10">
            <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-5 rounded-full shadow-lg animate-bounce">
              <Settings size={36} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 relative z-10">
            🚀 개발 중입니다!
          </h2>

          {/* 설명 */}
          <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
            <span className="inline-block animate-bounce">✨</span> 더 멋진 서비스를 위해 <span className="inline-block animate-bounce delay-100">💻</span><br />
            열심히 코딩하고 있어요! <span className="inline-block animate-bounce delay-200">🔥</span>
          </p>

          {/* 예상 시기 */}
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-2xl mb-6 border border-blue-200/50 relative z-10">
            <div className="flex items-center justify-center text-blue-700 text-base font-medium">
              <div className="bg-blue-500 p-2 rounded-full mr-3 animate-pulse">
                <Clock size={18} className="text-white" />
              </div>
              <span className="animate-pulse">곧 만나요! 🎉</span>
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="mt-10">
          <Button
            text="이전 페이지로"
            onClick={handleGoBack}
            className={`w-full rounded-[9px] font-medium bg-[#0C2B5F] text-white ${buttonClassName}`}
          />

          <div className="flex justify-center mt-4 text-sm text-gray-500">
            <button
              onClick={handleGoHome}
              className="hover:underline"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}