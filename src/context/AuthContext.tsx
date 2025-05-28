import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

// Vite 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userEmail?: string) => void;
  logout: () => void;
  checkAuth: () => boolean;
  getUserEmail: () => string | null;
  reissueToken: () => Promise<boolean>; // 추가
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>; // 추가
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;

  // 토큰 재발행 함수
  const reissueToken = async (): Promise<boolean> => {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (!refreshToken || !userEmail) {
        console.log('❌ 리프레시 토큰 또는 이메일이 없습니다.');
        logout();
        return false;
      }

      console.log('🔄 토큰 재발행 요청 중...', userEmail);

      const response = await fetch(`${API_BASE_URL}/api/auth/reissue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          userEmail,
        }),
      });

      if (!response.ok) {
        throw new Error(`토큰 재발행 실패: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('✅ 토큰 재발행 성공');
        
        // 새 토큰들 저장
        sessionStorage.setItem('accessToken', result.data.accessToken);
        sessionStorage.setItem('refreshToken', result.data.refreshToken);
        
        // SSE 연결도 새 토큰으로 재설정
        setupSSEConnection();
        
        return true;
      } else {
        throw new Error(result.message || '토큰 재발행 실패');
      }
    } catch (error) {
      console.error('❌ 토큰 재발행 오류:', error);
      logout(); // 재발행 실패 시 로그아웃
      return false;
    }
  };

  // API 요청을 위한 fetch 래퍼 함수
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const accessToken = sessionStorage.getItem('accessToken');
    
    // 헤더에 토큰 추가
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // 401 오류 시 토큰 재발행 시도
    if (response.status === 401) {
      console.log('🔄 401 오류 발생, 토큰 재발행 시도');
      
      const reissueSuccess = await reissueToken();
      
      if (reissueSuccess) {
        // 재발행 성공 시 원래 요청 재시도
        const newAccessToken = sessionStorage.getItem('accessToken');
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
          'Content-Type': 'application/json',
        };
        
        response = await fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    return response;
  };

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
      // 토큰을 쿼리 파라미터로 전달
      const sseUrl = `${API_BASE_URL}/api/auth/events?token=${encodeURIComponent(accessToken)}`;

      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        console.log('📊 EventSource readyState:', eventSource.readyState);
        reconnectAttempts.current = 0; // 성공 시 재연결 카운터 리셋
      };

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
    }
  };

  // 강제 로그아웃 처리
  const handleForceLogout = () => {

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
      window.location.href = '/login';
    }
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const userEmail = sessionStorage.getItem('userEmail');
        

        if (accessToken) {
          setIsAuthenticated(true);

          // 약간의 지연 후 SSE 연결
          setTimeout(() => {
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

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);

    // 이메일이 제공된 경우 저장
    if (userEmail) {
      sessionStorage.setItem('userEmail', userEmail);
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

  // 여기가 핵심! value에 새로운 함수들 추가
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      checkAuth, 
      getUserEmail,
      reissueToken,        // 추가
      authenticatedFetch   // 추가
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