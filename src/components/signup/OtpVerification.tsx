// components/auth/OtpVerificationPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

export default function OtpVerificationPage() {
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginToContext, logout } = useAuthContext();
  
  // 로그인에서 전달받은 임시 데이터
  const { email, tempAccessToken, tempRefreshToken, role } = location.state || {};

  useEffect(() => {
    console.log('🔐 OTP 검증 페이지 로드:', {
      email,
      hasAccessToken: !!tempAccessToken,
      hasRefreshToken: !!tempRefreshToken,
      role
    });

    // 필수 데이터가 없으면 로그인 페이지로 리다이렉트
    if (!email || !tempAccessToken || !tempRefreshToken) {
      console.warn('❌ OTP 검증에 필요한 데이터가 없음, 로그인 페이지로 이동');
      navigate('/login');
    }
  }, [email, tempAccessToken, tempRefreshToken, navigate]);

  const handleOtpVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      alert('6자리 OTP 코드를 입력해주세요.');
      return;
    }

    console.log('🔍 OTP 검증 시작:', { email, otpCode });

    setIsLoading(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';
      
      // 백엔드 @RequestParam에 맞게 쿼리 파라미터로 전송
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp?email=${encodeURIComponent(email)}&otpCode=${otpCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 임시 토큰으로 인증
          'Authorization': `Bearer ${tempAccessToken}`
        }
        // body 제거 - @RequestParam은 쿼리 파라미터를 사용
      });

      console.log('📡 OTP 검증 응답 상세:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        // 응답 데이터 확인
        const result = await response.json();
        console.log('✅ OTP 검증 성공 - 전체 응답:', result);
        console.log('✅ OTP 검증 성공 - 응답 구조:', {
          hasSuccess: 'success' in result,
          hasStatus: 'status' in result,
          successValue: result.success,
          statusValue: result.status,
          message: result.message,
          data: result.data
        });
        
        // 백엔드 응답 구조에 맞게 성공 여부 확인
        if (result.success === true || result.status === "success") {
          console.log('🎉 OTP 검증 완료! 로그인 처리 시작');
          
          // OTP 검증 성공 - 실제 로그인 처리
          loginToContext(tempAccessToken, tempRefreshToken, email, role);
          
          console.log('🚀 메인 페이지로 이동 시작');
          navigate('/my/coin');
        } else {
          console.warn('⚠️ 200 응답이지만 success가 false:', result);
          alert(result.message || 'OTP 검증에 실패했습니다.');
        }
      } else {
        // 401 등 오류 응답 처리 개선
        let errorMessage = 'OTP 검증에 실패했습니다.';
        
        try {
          // 응답이 JSON인지 확인
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const error = await response.json();
            errorMessage = error.message || errorMessage;
            console.error('❌ OTP 검증 실패 (JSON):', error);
          } else {
            // JSON이 아닌 응답 (HTML 오류 페이지 등)
            const errorText = await response.text();
            console.error('❌ OTP 검증 실패 (non-JSON):', {
              status: response.status,
              statusText: response.statusText,
              responseText: errorText.substring(0, 200) // 처음 200자만 로그
            });
          }
        } catch (parseError) {
          console.error('❌ 오류 응답 파싱 실패:', parseError);
        }
        
        // 401 오류 특별 처리
        if (response.status === 401) {
          errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
          // 로그인 페이지로 리다이렉트
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('❌ OTP 검증 오류:', error);
      alert('OTP 검증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    console.log('🔙 로그인 페이지로 돌아가기');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* 헤더 섹션 */}
        <div className="text-center mb-10">
          <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-300 to-white rounded-2xl shadow-lg mb-6">
            <svg className="w-10 h-10 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">보안 인증</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Google Authenticator에서<br />
            <span className="font-semibold text-gray-700">6자리 인증 코드</span>를 입력해주세요
          </p>
        </div>

        {/* 카드 섹션 */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-6">
          {/* 이메일 정보 */}
          {email && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-8 border border-blue-100">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span className="text-blue-700 font-medium text-sm">{email}</span>
              </div>
            </div>
          )}

          {/* OTP 입력 필드 */}
          <div className="mb-8">
            <label className="block text-base font-semibold text-gray-700 mb-4 text-center">
              인증 코드 입력
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                placeholder="● ● ● ● ● ●"
                autoFocus
              />
              {otpCode.length > 0 && (
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <span className="text-sm text-gray-500">
                    {otpCode.length}/6
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 버튼 그룹 */}
          <div className="space-y-4 pt-4">
            <button
              onClick={handleOtpVerify}
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-4 bg-[#4B5EED] text-white rounded-2xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  인증 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  인증 완료
                </div>
              )}
            </button>

            <button
              onClick={handleBack}
              disabled={isLoading}
              className="w-full py-4 bg-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                로그인으로 돌아가기
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}