import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/common/Header"
import BottomNav from "@/components/common/BottomNavigate"

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // 전달받은 orderId (state로 넣은 값)
  const orderId = location.state?.orderId;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (orderId) {
        navigate(`/mall/store/pay-complete/${orderId}`);
      } else {
        alert("주문 ID가 존재하지 않습니다.");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, orderId]);
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header title="주문 요청" isStore={false} />
      
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* 심플하고 세련된 로딩 스피너 */}
          <div className="relative w-20 h-20 mb-8">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#4B5EED] border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          <p className="text-xl font-semibold text-gray-800 mb-2">결제 처리 중</p>
          <p className="text-gray-500 text-sm">잠시만 기다려 주세요...</p>
          
          {/* 향상된 프로그레스 바 */}
          <div className="mt-6 w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#4B5EED] rounded-full animate-progressForward"></div>
          </div>
        </div>
      </div>
      
      <BottomNav />
      
      {/* 일관된 방향으로 진행되는 프로그레스바 애니메이션 */}
      <style>{`
        @keyframes progressForward {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
        .animate-progressForward {
          animation: progressForward 1.5s ease-in-out infinite;
          width: 100%;
        }
      `}</style>
    </div>
  )
}