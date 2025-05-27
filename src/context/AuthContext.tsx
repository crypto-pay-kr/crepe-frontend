import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

// Vite 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userEmail?: string) => void; // 이메일 파라미터 추가
  logout: () => void;
  checkAuth: () => boolean;
  getUserEmail: () => string | null; // 이메일 가져오는 함수 추가
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // SSE 연결 설정
  const setupSSEConnection = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('🔐 토큰이 없어서 SSE 연결을 건너뜁니다.');
      return;
    }

    // 기존 연결이 있다면 해제
    if (eventSourceRef.current) {
      console.log('🔄 기존 SSE 연결을 해제합니다.');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 기존 재연결 타이머 취소
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log('🔗 User SSE 연결 시도 중...', `${API_BASE_URL}/api/auth/events`);
      console.log('🔑 토큰 (앞 50자):', accessToken.substring(0, 50) + '...');

      // 토큰을 쿼리 파라미터로 전달
      const sseUrl = `${API_BASE_URL}/api/auth/events?token=${encodeURIComponent(accessToken)}`;
      console.log('📏 SSE URL 길이:', sseUrl.length);

      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log('✅ User SSE 연결이 성공적으로 열렸습니다.');
        console.log('📊 EventSource readyState:', eventSource.readyState);
        reconnectAttempts.current = 0; // 성공 시 재연결 카운터 리셋
      };

      // 연결 확인 메시지
      eventSource.addEventListener('connected', (event) => {
        console.log('✅ User SSE 연결 확인:', event.data);
      });

      // Keep-alive 메시지 처리
      eventSource.addEventListener('keepalive', (event) => {
        console.log('💓 User Keep-alive:', event.data);
      });

      // 모든 메시지 수신 (디버깅용)
      eventSource.onmessage = (event) => {
        console.log('📨 User SSE 일반 메시지 수신:', event);
        console.log('   - data:', event.data);
        console.log('   - type:', event.type);
        console.log('   - lastEventId:', event.lastEventId);
      };

      // 중복 로그인 알림 처리
      eventSource.addEventListener('duplicate-login', (event) => {
        console.log('🚨 User 중복 로그인 감지:', event.data);

        // 사용자에게 알림 표시
        alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');

        // 자동 로그아웃 처리
        handleForceLogout();
      });

      eventSource.onerror = (error) => {
        console.error('❌ User SSE 연결 오류:', error);
        console.log('📊 EventSource readyState:', eventSource.readyState);
        console.log('🔗 EventSource url:', eventSource.url);

        switch(eventSource.readyState) {
          case EventSource.CONNECTING:
            console.log('🔄 User SSE 연결 시도 중...');
            break;
          case EventSource.OPEN:
            console.log('✅ User SSE 연결이 열려있음');
            break;
          case EventSource.CLOSED:
            console.log('❌ User SSE 연결이 닫혔습니다.');

            // 자동 재연결 시도 (최대 5회)
            if (reconnectAttempts.current < maxReconnectAttempts) {
              reconnectAttempts.current++;
              const delay = Math.min(1000 * reconnectAttempts.current, 10000); // 최대 10초

              console.log(`🔄 ${delay/1000}초 후 User SSE 재연결 시도 (${reconnectAttempts.current}/${maxReconnectAttempts})`);

              reconnectTimeoutRef.current = setTimeout(() => {
                setupSSEConnection();
              }, delay);
            } else {
              console.log('❌ User SSE 최대 재연결 시도 횟수 초과');
            }
            break;
          default:
            console.log('❓ User SSE 알 수 없는 상태:', eventSource.readyState);
        }

        eventSource.close();
      };

      eventSourceRef.current = eventSource;

    } catch (error) {
      console.error('❌ User SSE 연결 설정 실패:', error);
    }
  };

  // 강제 로그아웃 처리
  const handleForceLogout = () => {
    console.log('🔄 User 강제 로그아웃 처리 중...');

    // SSE 연결 해제
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 모든 토큰 및 사용자 정보 제거
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userEmail'); // 이메일 정보도 제거
    setIsAuthenticated(false);

    // 현재 페이지가 로그인 페이지가 아니라면 로그인 페이지로 리다이렉트
    if (window.location.pathname !== '/login') {
      console.log('🔄 로그인 페이지로 리다이렉트...');
      window.location.href = '/login';
    }
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const userEmail = sessionStorage.getItem('userEmail');
        console.log('🔍 초기 토큰 확인:', accessToken ? '토큰 있음' : '토큰 없음');
        console.log('📧 초기 이메일 확인:', userEmail ? userEmail : '이메일 없음');

        if (accessToken) {
          console.log('💾 저장된 User 토큰 발견, 인증 상태 설정 중...');
          setIsAuthenticated(true);

          // 약간의 지연 후 SSE 연결
          setTimeout(() => {
            console.log('🔄 SSE 연결 지연 시작...');
            setupSSEConnection();
          }, 100);
        } else {
          console.log('❌ 저장된 User 토큰이 없습니다.');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("User 초기 인증 확인 에러:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    // 컴포넌트 언마운트 시 SSE 연결 해제
    return () => {
      console.log('🧹 User AuthProvider 언마운트, SSE 연결 정리 중...');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  // 로그인 함수 (토큰 및 이메일 저장, SSE 연결)
  const login = (accessToken: string, refreshToken: string, userEmail?: string) => {
    console.log('🔐 User 로그인 처리 중...');
    console.log('📧 로그인 이메일:', userEmail);

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);

    // 이메일이 제공된 경우 저장
    if (userEmail) {
      sessionStorage.setItem('userEmail', userEmail);
      console.log('✅ 사용자 이메일 저장됨:', userEmail);
    }

    setIsAuthenticated(true);

    // 로그인 후 SSE 연결 설정 (약간의 지연)
    setTimeout(() => {
      console.log('🔄 로그인 후 SSE 연결 시작...');
      setupSSEConnection();
    }, 500);
  };

  // 로그아웃 함수
  const logout = () => {
    console.log('🚪 User 로그아웃 처리 중...');

    // SSE 연결 해제
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 모든 저장된 정보 제거
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userEmail'); // 이메일 정보도 제거
    setIsAuthenticated(false);

    console.log('✅ User 로그아웃 완료');
  };

  // 인증 상태 확인
  const checkAuth = (): boolean => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

  // 사용자 이메일 가져오기
  const getUserEmail = (): string | null => {
    return sessionStorage.getItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      checkAuth, 
      getUserEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};