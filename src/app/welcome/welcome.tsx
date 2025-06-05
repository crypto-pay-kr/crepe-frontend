import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-between px-5 py-10 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
      {/* 커스텀 CSS 애니메이션 */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expand-width {
          from { width: 0; }
          to { width: 4rem; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-expand-width {
          animation: expand-width 1s ease-out forwards;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
      {/* 배경 장식 요소들 */}
      <div className="absolute top-20 right-8 w-40 h-40 bg-gradient-to-br from-[#4B5EED]/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/4 left-6 w-32 h-32 bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-2xl"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-bl from-purple-300/6 to-pink-300/6 rounded-full blur-xl animate-pulse" style={{animationDelay: '1.2s'}}></div>
      
      {/* 상단 문장 부분 - 애니메이션 추가 */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="text-center space-y-8 max-w-md">
          
          {/* 메인 메시지 카드 */}
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4B5EED]/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl scale-105 animate-pulse"></div>
            
            <div className="relative rounded-3xl p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="space-y-6">
                <p className="text-xl font-medium text-gray-700 tracking-wide leading-relaxed animate-slide-up" style={{animationDelay: '0.2s'}}>
                  지갑 없이도,
                </p>
                
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4B5EED] via-blue-600 to-purple-600 bg-clip-text text-transparent leading-relaxed tracking-tight animate-slide-up" style={{animationDelay: '0.4s'}}>
                  가상화폐를 포인트로 간편하게!
                </h1>
                
                {/* 애니메이션 장식 라인 */}
                <div className="flex justify-center items-center py-4 animate-slide-up" style={{animationDelay: '0.6s'}}>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#4B5EED]/40 to-transparent animate-expand-width"></div>
                  <div className="mx-3 w-2 h-2 rounded-full bg-[#4B5EED]/30 animate-pulse" style={{animationDelay: '0.8s'}}></div>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent animate-expand-width" style={{animationDelay: '0.2s'}}></div>
                </div>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed animate-slide-up" style={{animationDelay: '0.8s'}}>
                  새로운 디지털 결제의 시작<br/>
                  <span className="text-xs opacity-70">간편하고 안전한 포인트 시스템</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 및 텍스트 - 애니메이션 추가 */}
      <div className="w-full mt-15 mb-1 px-5 relative z-10">
        <div className="flex flex-col space-y-4 animate-fade-in-up" style={{animationDelay: '1s'}}>
          <div className="text-center text-base bg-white/60 backdrop-blur-sm rounded-xl p-1  hover:bg-white/80 hover:border-gray-200/70 transition-all duration-300">
            <span className="text-gray-600">이미 가입하셨나요? </span>
            <button className="text-[#4B5EED] font-semibold hover:text-blue-700 transition-all duration-300 hover:scale-105" onClick={() => navigate("/login")}>
              로그인 하기
            </button>
          </div>

          {/* 지금 시작하기 버튼 */}
          <div className="mt-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4B5EED]/20 to-purple-500/20 rounded-[12px] blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <Button
              text="지금 시작하기"
              onClick={() => navigate("/terms")}
              className="relative w-full rounded-[9px] font-medium bg-[#4B5EED] hover:bg-[#3d4ed8] text-white py-3 mx-auto px-4 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-subtle"
            />
          </div>

          {/* 가맹점 회원가입 */}
          <div className="text-center text-base bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl p-1 hover:from-blue-100/90 hover:to-indigo-100/90 hover:border-blue-200/50 transition-all duration-300">
            <span className="text-gray-600">사장님이신가요? </span>
            <button className="text-[#4B5EED] font-semibold hover:text-blue-700 transition-all duration-300 hover:scale-105" onClick={() => navigate("/store/terms")}>
              가맹점 회원가입하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}