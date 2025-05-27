import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, User, AlertTriangle } from "lucide-react";
import { Settings, BarChart2, CreditCard, HelpCircle, Shield, ShieldX } from "lucide-react";
import Header from "@/components/common/Header";
import ProfileHeader from "@/components/profile/ProfileHeader";
import MenuList, { MenuOption } from "@/components/profile/MenuList";
import BottomNav from "@/components/common/BottomNavigate";
import React, { useEffect, useState } from "react";
import { fetchMyUserInfo } from "@/api/user";
import { fetchMyStoreAllDetails } from "@/api/store";
import { useAuthContext } from "@/context/AuthContext";

interface OtpCredential {
  enabled: boolean;
  secretKey: string;
}

interface ApiResponse<T> {
  status: string; // "success" 또는 "fail"
  message: string;
  data?: T;
  timestamp?: string;
}

export default function MyPage(): React.ReactElement {
  const BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("...");
  const [userEmail, setUserEmail] = useState("");
  const [hasOtpEnabled, setHasOtpEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  
  // AuthContext 사용
  const { logout: logoutFromContext } = useAuthContext();

  // 경로를 기반으로 사용자 타입 결정
  const isSeller = location.pathname.includes('/store');

  const handleEditInfo = (): void => {
    // 유저 타입에 따라 다른 편집 페이지로 이동
    if (isSeller) {
      navigate("/store/my/edit");
    } else {
      navigate("/user/my/edit");
    }
  };

  // OTP 상태 조회 - 수정된 버전 (이메일 파라미터로 변경)
  const fetchOtpStatus = async (email: string) => {
    try {
      console.log('🔍 OTP 상태 조회 시작:', { email, BASE_URL });
      console.log('🔑 사용할 토큰:', token ? `${token.substring(0, 20)}...` : 'null');
      
      if (!token) {
        console.error('❌ 토큰이 없습니다. 로그인이 필요합니다.');
        setHasOtpEnabled(false);
        setShowSecurityNotice(true);
        return;
      }
      
      const response = await fetch(`${BASE_URL}/api/otp/status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
      });
      
      console.log('📨 OTP 상태 응답:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.status === 401) {
        console.error('❌ 인증 실패 (401): 토큰이 유효하지 않거나 만료되었습니다.');
        // 토큰 만료 시 로그아웃 처리
        logoutFromContext();
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OTP 상태 조회 HTTP 오류:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        return;
      }

      const result: ApiResponse<OtpCredential> = await response.json();
      console.log('✅ OTP 상태 응답 데이터:', result);

      // 백엔드 응답 구조에 맞게 처리
      if (result.status === "success") {
        // result.data가 null이면 OTP가 설정되지 않은 상태
        if (result.data && result.data.enabled) {
          setHasOtpEnabled(true);
          setShowSecurityNotice(false);
          console.log('🛡️ OTP 활성화됨');
        } else {
          setHasOtpEnabled(false);
          setShowSecurityNotice(true);
          console.log('🔓 OTP 비활성화 또는 미설정');
        }
      } else {
        console.warn('⚠️ OTP 상태 조회 실패:', result.message);
        setHasOtpEnabled(false);
        setShowSecurityNotice(true);
      }
    } catch (err) {
      console.error("❌ OTP 상태 조회 네트워크 오류:", err);
      setHasOtpEnabled(false); // 오류 시 기본값으로 설정
      setShowSecurityNotice(true);
    }
  };

  // OTP 해제 함수
  const disableOtp = async () => {
    if (!userEmail) {
      alert('이메일 정보가 없습니다.');
      return;
    }

    const isConfirmed = confirm(
      '⚠️ 2차 인증을 해제하시겠습니까?\n\n' +
      '해제하면 계정 보안이 약화됩니다.\n' +
      '정말로 해제하시겠습니까?'
    );

    if (!isConfirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/api/otp/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === "success") {
        alert('2차 인증이 성공적으로 해제되었습니다.');
        setHasOtpEnabled(false);
        setShowSecurityNotice(true);
      } else {
        alert(result.message || 'OTP 해제에 실패했습니다.');
      }
    } catch (err) {
      console.error('OTP 해제 오류:', err);
      alert('네트워크 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.warn('⚠️ 토큰이 없어서 사용자 데이터 조회를 건너뜁니다.');
          setShowSecurityNotice(true);
          return;
        }

        console.log('👤 사용자 데이터 조회 시작...', { isSeller });

        if (isSeller) {
          const storeData = await fetchMyStoreAllDetails();
          console.log('🏪 스토어 데이터:', storeData);
          setUsername(storeData.storeName);
          setUserEmail(storeData.email);
          
          // 판매자의 경우 스토어 이메일로 OTP 상태 조회
          if (storeData.email) {
            await fetchOtpStatus(storeData.email);
          } else {
            console.warn('⚠️ 스토어 이메일 정보가 없습니다.');
            setShowSecurityNotice(true);
          }
        } else {
          const userData = await fetchMyUserInfo();
          console.log('👤 사용자 데이터:', userData);
          setUsername(userData.nickname);
          setUserEmail(userData.email);
          
          // 일반 사용자의 경우 사용자 이메일로 OTP 상태 조회
          if (userData.email) {
            await fetchOtpStatus(userData.email);
          } else {
            console.warn('⚠️ 사용자 이메일 정보가 없습니다.');
            setShowSecurityNotice(true);
          }
        }
      } catch (err) {
        console.error("❌ 사용자 정보 조회 실패:", err);
        setShowSecurityNotice(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, isSeller, BASE_URL]);

  // AuthContext를 통한 로그아웃 처리
  const handleLogout = (): void => {
    console.log('🚪 로그아웃 버튼 클릭');
    
    // AuthContext의 logout 함수 호출 (SSE 연결 해제 포함)
    logoutFromContext();
    
    // 로그인 페이지로 즉시 리다이렉트 (replace 사용)
    navigate("/login", { replace: true });
  };

  // OTP 설정 페이지로 이동
  const handleOtpSetup = (): void => {
    navigate("/otp/setup");
  };

  // OTP 관리 메뉴 클릭 핸들러
  const handleOtpManagement = (): void => {
    const options = [];
    
    if (hasOtpEnabled) {
      options.push('해제하기');
    }
    options.push('재설정하기', '취소');

    // 간단한 선택 다이얼로그 구현
    let choice;
    if (hasOtpEnabled) {
      choice = confirm(
        '2차 인증 관리\n\n' +
        '• 확인: 2차 인증 해제\n' +
        '• 취소: 2차 인증 재설정\n\n' +
        '어떤 작업을 하시겠습니까?'
      );
      
      if (choice) {
        disableOtp();
      } else {
        handleOtpSetup();
      }
    } else {
      handleOtpSetup();
    }
  };

  // 보안 알림 닫기
  const dismissSecurityNotice = (): void => {
    setShowSecurityNotice(false);
  };

  // 메뉴 항목 정의
  const getMenuItems = (): MenuOption[] => {
    const baseMenuItems: MenuOption[] = [
      {
        label: "내 정보 수정",
        onClick: handleEditInfo,
        icon: <Settings size={18} color="#6366f1" />
      },
    ];

    // 2차 인증 메뉴 추가
    baseMenuItems.push({
      label: hasOtpEnabled ? "2차 인증 관리" : "2차 인증 설정",
      onClick: handleOtpManagement,
      icon: hasOtpEnabled ? 
        <Shield size={18} color="#10b981" /> : 
        <Shield size={18} color="#6b7280" />,
      badge: hasOtpEnabled ? "활성화됨" : "미설정"
    });

    if (isSeller) {
      baseMenuItems.push({
        label: "결산리포트",
        onClick: () => navigate("/settlement"),
        icon: <BarChart2 size={18} color="#10b981" />
      });
    } else {
      baseMenuItems.push({
        label: "내 주문 내역",
        onClick: () => navigate("/my/orders"),
        icon: <ShoppingBag size={18} color="#10b981" />
        },
        {
          label: "결제 내역",
          onClick: () => navigate("/my/payments"),
          icon: <CreditCard size={18} color="#f59e0b" />
        }

      );
    }

    baseMenuItems.push(
      {
        label: "고객 센터",
        onClick: () => navigate(isSeller ? "/store/my/customer-support" : "/home/my/customer-support"),
        icon: <HelpCircle size={18} color="#0ea5e9" />
      }
    );

    return baseMenuItems;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Header title={isSeller ? "판매자 페이지" : "마이페이지"} />
        <main className="flex-1 p-4 bg-gray-50 overflow-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header title={isSeller ? "판매자 페이지" : "마이페이지"} />
      
      {/* 스크롤 가능한 메인 컨테이너 */}
      <main className="flex-1 p-4 bg-gray-50 overflow-auto">
        {/* 보안 알림 배너 */}
        {showSecurityNotice && !hasOtpEnabled && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 mb-4 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-amber-800">
                  🔒 계정 보안 강화가 필요합니다
                </h3>
                <div className="mt-2 text-sm text-amber-700">
                  <p className="mb-2">
                    <strong>2차 인증(OTP)</strong>을 설정하여 계정을 더욱 안전하게 보호하세요!
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>해킹 시도로부터 계정 보호</li>
                    <li>무단 로그인 방지</li>
                    <li>개인정보 및 {isSeller ? '판매' : '결제'} 정보 보안 강화</li>
                  </ul>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleOtpSetup}
                    className="bg-amber-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-amber-700 transition-colors"
                  >
                    지금 설정하기
                  </button>
                  <button
                    onClick={dismissSecurityNotice}
                    className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                  >
                    나중에
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProfileHeader
          username={username}
          onLogout={handleLogout}
          hasOtpEnabled={hasOtpEnabled}
        />
        <MenuList menuItems={getMenuItems()} />
      </main>
      
      <BottomNav />
    </div>
  );
}