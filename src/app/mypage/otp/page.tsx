import React, { useState, useEffect } from 'react';
import { QrCode, Shield, Copy, Check, ArrowLeft } from 'lucide-react';
import Header from "@/components/common/Header";
import { useNavigate } from 'react-router-dom';

interface OtpSetupResponse {
  secretKey: string;
  qrCodeUrl: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export default function OtpSetup(): React.ReactElement {
  const navigate = useNavigate();
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [otpData, setOtpData] = useState<OtpSetupResponse | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const email = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('userRole'); // 사용자 역할 가져오기
  const BASE_URL = import.meta.env.VITE_API_SERVER_URL;
  
  // OTP 초기 설정
  const setupOtp = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/api/otp/setup?email=${encodeURIComponent(email || '')}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // 백엔드 응답 구조에 맞게 수정
      if (result.status==='success' && result.data) {
        setOtpData(result.data);
        setStep('verify');
      } else {
        setError(result.message || 'OTP 설정에 실패했습니다');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다');
      console.error('OTP setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // OTP 코드 검증 및 활성화
  const verifyOtp = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/otp/verify?email=${encodeURIComponent(email || '')}&otpCode=${verificationCode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // API 응답 전체 구조 확인
      console.log('🔍 OTP 인증 응답 전체:', result);
      console.log('📊 응답 status:', result.status);
      console.log('✅ 응답 success:', result.success);
      console.log('👤 현재 userRole:', userRole);
      
      // 기존 설정과 마찬가지로 status로 체크 (setup에서와 동일)
      if (result.status === 'success' || result.success === true) {
        // 성공 메시지 표시
        alert('OTP가 성공적으로 활성화되었습니다');
        
        // 사용자 역할에 따라 다른 페이지로 리다이렉트
        console.log('🚀 리다이렉트 시작...');
        if (userRole === 'SELLER') {
          console.log('🏪 가맹점 사용자 - /store/my로 이동');
          navigate('/store/my', { replace: true });
        } else {
          console.log('👨‍💼 일반 사용자 - /user/my로 이동');
          navigate('/user/my', { replace: true });
        }
      } else {
        console.log('❌ 인증 실패:', result.message);
        setError(result.message || '인증에 실패했습니다');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다');
      console.error('OTP verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 비밀키 복사
  const copySecretKey = async () => {
    if (otpData?.secretKey) {
      try {
        await navigator.clipboard.writeText(otpData.secretKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('복사 실패:', err);
      }
    }
  };

  // 인증 코드 입력 처리
  const handleCodeChange = (value: string) => {
    // 숫자만 입력 허용, 최대 6자리
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(numericValue);
    setError(''); // 입력 시 에러 메시지 제거
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="2차 인증 설정"
        onBackClick={() => navigate(-1) }
      />
      
      {/* 스크롤 가능한 메인 컨테이너 */}
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-4 pb-8">
          <div className="max-w-md mx-auto">
            {step === 'setup' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    2차 인증 설정
                  </h2>
                  <p className="text-gray-600 text-sm">
                    계정 보안을 강화하기 위해 2차 인증을 설정하세요
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">인증 앱 준비</p>
                      <p className="text-xs text-gray-600">Google Authenticator 또는 Authy 앱을 설치하세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">QR 코드 스캔</p>
                      <p className="text-xs text-gray-600">앱에서 QR 코드를 스캔하여 계정을 추가하세요</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm font-medium">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">인증 코드 입력</p>
                      <p className="text-xs text-gray-600">앱에서 생성된 6자리 코드를 입력하세요</p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={setupOtp}
                  disabled={loading}
                  className="w-full bg-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '설정 중...' : '2차 인증 설정 시작'}
                </button>
              </div>
            )}

            {step === 'verify' && otpData && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    QR 코드 스캔
                  </h2>
                  <p className="text-gray-600 text-sm">
                    인증 앱으로 아래 QR 코드를 스캔하세요
                  </p>
                </div>

                {/* QR 코드 */}
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 mb-6">
                  <div className="text-center">
                    <img 
                      src={otpData.qrCodeUrl} 
                      alt="QR Code" 
                      className="mx-auto mb-4 max-w-[180px] max-h-[180px] w-auto h-auto"
                    />
                    <p className="text-xs text-gray-500">QR 코드를 스캔할 수 없나요?</p>
                  </div>
                </div>

                {/* 수동 입력용 비밀키 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">수동 입력 키</p>
                    <button
                      onClick={copySecretKey}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          <span className="text-xs">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span className="text-xs">복사</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border">
                    {otpData.secretKey}
                  </p>
                </div>

                {/* 인증 코드 입력 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인증 코드 (6자리)
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={verifyOtp}
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '인증 중...' : '인증하고 활성화'}
                  </button>
                  
                  <button
                    onClick={() => setStep('setup')}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    다시 설정
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}