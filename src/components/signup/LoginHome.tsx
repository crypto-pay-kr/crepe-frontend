import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import LoginForm from "./LoginForm";
import { loginUser } from "@/api/user";
import { RefreshCw } from 'lucide-react'
import { useAuthContext } from '@/context/AuthContext'; // AuthContext 추가

interface LoginHomeProps {
  onSignup: () => void;
  onStoreSignup: () => void;
  buttonClassName?: string;
}

export default function LoginHome({ onSignup, onStoreSignup, buttonClassName }: LoginHomeProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaImageUrl, setCaptchaImageUrl] = useState('');
  const [captchaKey, setCaptchaKey] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();
  
  // AuthContext 사용
  const { login: loginToContext, isAuthenticated } = useAuthContext();

  useEffect(() => {
    fetchCaptcha();
    
    // 이미 로그인된 상태라면 ㄴ리다이렉트
    if (isAuthenticated) {
      navigate("/my/coin");
    }
  }, [isAuthenticated, navigate]);

  const fetchCaptcha = async () => {
    try {
      // Vite 환경변수 사용
      const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';
      const res = await fetch(`${API_BASE_URL}/api/captcha`);
      const data = await res.json();
      setCaptchaKey(data.captchaKey);
      const imageUrl = `https://naveropenapi.apigw.ntruss.com/captcha-bin/v1/ncaptcha?key=${data.captchaKey}`;
      setCaptchaImageUrl(imageUrl);
      setCaptchaInput(''); // 입력 초기화
    } catch (error) {
      console.error('캡차 불러오기 실패:', error);
    }
  };

  // 로그인 요청 처리 함수
  const handleLogin = async () => {
    if (!userId || !password || !captchaInput) {
      alert("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      const res = await loginUser({
        email: userId,
        password,
        captchaKey,
        captchaValue: captchaInput,
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "로그인에 실패했습니다.");
        fetchCaptcha(); // 실패 시 새 캡차
        return;
      }

      const { accessToken, refreshToken,email,role } = await res.json();
      console.log('✅ 로그인 응답 데이터:', { 
            email, 
            role, 
            hasAccessToken: !!accessToken, 
            hasRefreshToken: !!refreshToken 
          });
      // AuthContext를 통해 로그인 처리 (이메일도 함께 저장)
     loginToContext(accessToken, refreshToken, email || userId, role);

      console.log('✅ 로그인 성공 - 이메일 저장됨:', userId);

      // 약간의 지연 후 리다이렉트 (SSE 연결 시간 제공)
      setTimeout(() => {
        navigate("/my/coin");
      }, 1000);

    } catch (err) {
      console.error("로그인 오류:", err);
      alert("로그인 중 오류가 발생했습니다.");
      fetchCaptcha(); // 에러 시에도 새 캡차
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pt-12 pb-10">
      {/* 로고 */}
      <img
        src="/crepe-newlogo2.png"
        alt="Logo"
        className="object-contain w-[500px] aspect-[2.51] mx-auto"
      />

      {/* Login Form */}
      <div className="mt-4 w-full">
        <LoginForm onSubmit={handleLogin}>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="아이디 (이메일)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </LoginForm>

        {/* CAPTCHA */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100 mt-12">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-700">보안 확인</span>
            <button
              type="button"
              onClick={fetchCaptcha}
              className="text-amber-500 hover:text-amber-600 flex items-center text-sm"
            >
              <RefreshCw size={14} className="mr-1" />
              새로운 보안문자 받기
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* CAPTCHA 이미지 */}
            <div className="bg-white rounded-md overflow-hidden border border-gray-200 sm:w-1/2">
              <img src={captchaImageUrl} alt="CAPTCHA" className="w-full h-25 object-cover" />
            </div>

            {/* CAPTCHA 입력 칸 */}
            <div className="sm:w-1/2 flex items-center">
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                placeholder="보이는 대로 입력해주세요"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            text="로그인"
            onClick={handleLogin}
            className={`w-full rounded-[9px] font-medium bg-[#4B5EED] text-white ${buttonClassName}`}
          />

          <div className="flex justify-center gap-4 mt-4 mb-4 text-sm text-gray-500">
            <button onClick={onSignup} className="hover:underline">
              유저 회원가입
            </button>
            <button onClick={onStoreSignup} className="hover:underline">
              가맹점 회원가입
            </button>
            <button onClick={() => navigate('/under-development')} className="hover:underline">아이디 비밀번호 찾기</button>
          </div>
        </div>
      </div>
    </div>
  );
}