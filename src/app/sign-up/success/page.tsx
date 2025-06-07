import { useState, useEffect } from "react";

const AnimationStyles = () => (
  <style>
    {`
      @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-8px) rotate(1deg); }
        66% { transform: translateY(4px) rotate(-0.5deg); }
        100% { transform: translateY(0px) rotate(0deg); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
                      0 0 40px rgba(59, 130, 246, 0.1);
        }
        50% { 
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4),
                      0 0 60px rgba(59, 130, 246, 0.2);
        }
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1); }
      }
      
      .welcome-text {
        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: -0.01em;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8, #2563eb);
        background-size: 300% 300%;
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradient-shift 4s ease-in-out infinite;
      }
      
      .gradient-bg {
        background: linear-gradient(135deg, 
          #ffffff 0%, 
          #f8fafc 25%, 
          #f1f5f9 50%, 
          #f8fafc 75%, 
          #ffffff 100%);
        background-size: 400% 400%;
        animation: gradient-shift 8s ease-in-out infinite;
      }
      
      .sparkle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #3b82f6;
        border-radius: 50%;
        animation: sparkle 2s ease-in-out infinite;
      }
      
      .glow-button {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      
      .glow-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
      }
      
      .glow-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        transition: left 0.5s;
      }
      
      .glow-button:hover::before {
        left: 100%;
      }
    `}
  </style>
);

export default function SignupCompletePage() {
  const [showGreeting, setShowGreeting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showButton, setShowButton] = useState(false);
  type Sparkle = { id: number; left: number; top: number; delay: number };
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const t1 = setTimeout(() => setShowGreeting(true), 300);
    const t2 = setTimeout(() => setShowLogo(true), 800);
    const t3 = setTimeout(() => setShowButton(true), 1300);

    // 반짝이는 효과를 위한 랜덤 위치 생성
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 6; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 2,
        });
      }
      setSparkles(newSparkles);
    };

    const t4 = setTimeout(generateSparkles, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleNext = () => {
    // navigate("/login"); // 실제 구현에서는 이 라인을 사용
    console.log("로그인 페이지로 이동");
  };

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <AnimationStyles />
      
      {/* 배경 장식 요소들 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute top-1/3 -right-10 w-32 h-32 bg-pink-100 rounded-full opacity-25 blur-lg"></div>
        
        {/* 반짝이는 효과 */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 h-screen flex flex-col">
        {/* 상단 환영 메시지 - 위치 조정 */}
        <div className="pt-16 flex flex-col items-center">
          <div
            className={`transition-all duration-1000 ease-out ${
              showGreeting 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-8 scale-95"
            } flex flex-col items-center space-y-4`}
          >
            <div className="flex items-center gap-2">
              <img
                src="/crepe-newlogosmall2.png"
                alt="Crepe Logo"
                className="w-[140px] h-[100px] object-contain drop-shadow-lg"
              />
            </div>
            <div className="text-center">
              <p className="welcome-text text-3xl font-bold leading-tight">
                오신 것을 환영합니다
              </p>
              <p className="text-slate-600 text-lg mt-3 font-medium">
                새로운 여정이 시작됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 중앙 메인 로고 */}
        <div className="flex-1 flex items-center justify-center relative">
          <div
            className={`relative transition-all duration-1000 ease-out ${
              showLogo 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-12 scale-90"
            }`}
            style={showLogo ? { animation: "float 4s ease-in-out infinite" } : {}}
          >
            <div className="relative">
              {/* 글로우 효과 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              
              {/* 메인 로고 */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <img 
                  src="/crepe-newlogo.png" 
                  alt="Crepe Logo" 
                  className="w-56 h-56 object-contain drop-shadow-2xl" 
                />
              </div>
              
              {/* 회전하는 테두리 */}
              <div className="absolute inset-0 border-2 border-blue-300 rounded-full opacity-50" 
                   style={{ animation: "float 6s ease-in-out infinite reverse" }}></div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-8 pb-12">
          <div
            className={`transition-all duration-1000 ease-out ${
              showButton 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={handleNext}
              className="glow-button w-full py-4 px-8 rounded-2xl font-bold text-lg text-white relative overflow-hidden"
            >
              <span className="relative z-10">시작하기</span>
            </button>
            
            <p className="text-center text-slate-500 text-sm mt-4">
              준비가 완료되었습니다!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}