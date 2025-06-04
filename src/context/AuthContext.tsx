import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import axios from 'axios';

// Vite 환경변수 사용
const API_BASE_URL = import.meta.env.VITE_API_SERVER_URL || 'http://localhost:8080';

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  userRole: string | null;
  login: (accessToken: string, refreshToken: string, userEmail?: string, userRole?: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  reissueToken: () => Promise<boolean>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
  manualReconnectSSE: () => void;
  // 테스트용 함수들
  forceTokenExpiry: () => void;
  getTokenInfo: () => { accessToken: string | null; refreshToken: string | null };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef<number>(0);
  const maxReconnectAttempts = 5;
  const reissueInProgress = useRef<boolean>(false);
  const tokenExpiryCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // 토큰 정보 조회 (테스트용)
  const getTokenInfo = () => ({
    accessToken: sessionStorage.getItem('accessToken'),
    refreshToken: sessionStorage.getItem('refreshToken')
  });

  // 강제 토큰 만료 (테스트용)
  const forceTokenExpiry = () => {
    console.log('🧪 [테스트] 토큰 강제 만료 처리');
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid';
    sessionStorage.setItem('accessToken', expiredToken);
  };

  // JWT 토큰 만료 시간 확인
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.log('❌ 토큰 파싱 실패:', error);
      return true;
    }
  };

  // 토큰 만료까지 남은 시간 (초)
  const getTokenExpiryTime = (token: string): number => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch (error) {
      return 0;
    }
  };

  // 토큰 재발행 함수 (개선된 버전)
  const reissueToken = async (): Promise<boolean> => {
  if (reissueInProgress.current) {
    console.log('🔄 이미 토큰 재발행이 진행 중입니다.');
    return false;
  }

  reissueInProgress.current = true;

  try {
    const refreshToken = sessionStorage.getItem('refreshToken');
    const currentEmail = sessionStorage.getItem('userEmail') || userEmail;
    const currentRole = sessionStorage.getItem('userRole') || userRole;
    
    // ✅ 상세 디버깅 로그
    console.log('🔄 토큰 재발행 요청 상세:', {
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length,
      refreshTokenStart: refreshToken?.substring(0, 20),
      refreshTokenEnd: refreshToken?.substring(refreshToken?.length - 20),
      email: currentEmail,
      role: currentRole
    });

    if (!refreshToken) {
      console.log('❌ 리프레시 토큰이 없습니다.');
      logout();
      return false;
    }

    // 리프레시 토큰 만료 확인
    if (isTokenExpired(refreshToken)) {
      console.log('❌ 리프레시 토큰도 만료되었습니다. 로그아웃 처리');
      logout();
      return false;
    }

    const response = await axios.post(`${API_BASE_URL}/api/auth/reissue`, {
      refreshToken,
      userEmail: currentEmail,
      userRole: currentRole
    });

    console.log('📨 재발행 응답 상세:', {
      success: response.data.success,
      hasData: !!response.data.data,
      responseStructure: Object.keys(response.data.data || {}),
      newAccessTokenLength: response.data.data?.accessToken?.length,
      newRefreshTokenLength: response.data.data?.refreshToken?.length
    });

    if (response.data.success && response.data.data) {
      console.log('✅ 토큰 재발행 성공');
      
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
      
      // ✅ 이전 토큰 완전 삭제 후 새 토큰 저장
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      
      sessionStorage.setItem('accessToken', newAccessToken);
      sessionStorage.setItem('refreshToken', newRefreshToken);
      
      // ✅ 저장 확인
      const savedAccessToken = sessionStorage.getItem('accessToken');
      const savedRefreshToken = sessionStorage.getItem('refreshToken');
      
      console.log('💾 토큰 저장 확인:', {
        accessTokenMatches: savedAccessToken === newAccessToken,
        refreshTokenMatches: savedRefreshToken === newRefreshToken,
        savedAccessLength: savedAccessToken?.length,
        savedRefreshLength: savedRefreshToken?.length
      });
      
      // 사용자 정보 업데이트
      if (response.data.data.userEmail) {
        sessionStorage.setItem('userEmail', response.data.data.userEmail);
        setUserEmail(response.data.data.userEmail);
      }
      if (response.data.data.userRole) {
        sessionStorage.setItem('userRole', response.data.data.userRole);
        setUserRole(response.data.data.userRole);
      }
      
      // 새 토큰의 만료 시간 체크 설정
      scheduleTokenExpiryCheck(newAccessToken);
      
      return true;
    } else {
      throw new Error(response.data.message || '토큰 재발행 실패');
    }
  } catch (error) {
    console.error('❌ 토큰 재발행 오류:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('❌ 상세 오류 정보:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        message: error.response?.data?.message,
        responseData: error.response?.data
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔄 리프레시 토큰도 만료됨, 자동 로그아웃 처리');
        logout();
      }
    }
    
    return false;
  } finally {
    reissueInProgress.current = false;
  }
};

  // 토큰 만료 시간 체크 스케줄링
  const scheduleTokenExpiryCheck = (token: string) => {
    if (tokenExpiryCheckInterval.current) {
      clearInterval(tokenExpiryCheckInterval.current);
    }

    const expiryTime = getTokenExpiryTime(token);
    
    if (expiryTime <= 0) {
      console.log('⚠️ 토큰이 이미 만료됨');
      reissueToken();
      return;
    }

    console.log(`⏰ 토큰 만료까지 ${expiryTime}초 남음`);

    // 토큰 만료 30초 전에 재발행 시도
    const reissueTime = Math.max(0, (expiryTime - 30) * 1000);
    
    setTimeout(() => {
      console.log('⚠️ 토큰 만료 임박, 자동 재발행 시도');
      reissueToken();
    }, reissueTime);

    // 5초마다 토큰 상태 체크 (리프레시 토큰도 함께 체크)
    tokenExpiryCheckInterval.current = setInterval(() => {
      const currentToken = sessionStorage.getItem('accessToken');
      const currentRefreshToken = sessionStorage.getItem('refreshToken');
      
      // 리프레시 토큰 만료 체크
      if (currentRefreshToken && isTokenExpired(currentRefreshToken)) {
        console.log('❌ 리프레시 토큰 만료 감지, 자동 로그아웃');
        logout();
        return;
      }
      
      // 액세스 토큰 만료 체크
      if (currentToken && isTokenExpired(currentToken)) {
        console.log('⚠️ 액세스 토큰 만료 감지, 재발행 시도');
        reissueToken();
      }
    }, 5000);
  };

  // API 요청을 위한 fetch 래퍼 함수 (개선된 버전)
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const makeRequest = async (tokenToUse?: string) => {
      const accessToken = tokenToUse || sessionStorage.getItem('accessToken');
      
      // 토큰이 있으면 만료 확인
      if (accessToken && isTokenExpired(accessToken)) {
        console.log('🔄 요청 전 토큰 만료 감지, 재발행 시도');
        const reissueSuccess = await reissueToken();
        if (!reissueSuccess) {
          throw new Error('Token reissue failed');
        }
        // 새 토큰으로 재시도
        return makeRequest(sessionStorage.getItem('accessToken') ?? undefined);
      }
      
      const headers = {
        ...options.headers,
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      };

      return fetch(url, {
        ...options,
        headers,
      });
    };

    let response = await makeRequest();

    // 401 오류 시 토큰 재발행 시도
    if (response.status === 401) {
      console.log('🔄 401 오류 발생, 토큰 재발행 시도');
      console.log('📍 요청 URL:', url);
      
      const reissueSuccess = await reissueToken();
      
      if (reissueSuccess) {
        console.log('✅ 토큰 재발행 성공, 요청 재시도');
        const newAccessToken = sessionStorage.getItem('accessToken');
        response = await makeRequest(newAccessToken ?? undefined);
        
        if (response.ok) {
          console.log('✅ 재시도 요청 성공');
        } else {
          console.log('❌ 재시도 요청도 실패:', response.status);
        }
      } else {
        console.log('❌ 토큰 재발행 실패, 로그인 필요');
      }
    }

    return response;
  };

  // Axios 인터셉터 설정 (개선된 버전)
  useEffect(() => {
    // 요청 인터셉터 - 토큰 자동 첨부 및 만료 체크
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const accessToken = sessionStorage.getItem('accessToken');
        
        // 토큰이 있으면 만료 확인
        if (accessToken) {
          if (isTokenExpired(accessToken)) {
            console.log('🔄 요청 전 토큰 만료 감지, 재발행 시도');
            const reissueSuccess = await reissueToken();
            if (reissueSuccess) {
              const newToken = sessionStorage.getItem('accessToken');
              config.headers.Authorization = `Bearer ${newToken}`;
            } else {
              return Promise.reject(new Error('Token reissue failed'));
            }
          } else {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        
        console.log('📤 Axios 요청:', {
          url: config.url,
          method: config.method,
          hasToken: !!config.headers.Authorization
        });
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 - 401 시 자동 토큰 재발행
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        console.log('📥 Axios 응답 성공:', {
          url: response.config.url,
          status: response.status
        });
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        console.log('📥 Axios 응답 오류:', {
          url: originalRequest?.url,
          status: error.response?.status,
          hasRetryFlag: !!originalRequest?._retry
        });

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          console.log('🔄 Axios 401 오류, 토큰 재발행 시도');
          const reissueSuccess = await reissueToken();
          
          if (reissueSuccess) {
            const newAccessToken = sessionStorage.getItem('accessToken');
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            console.log('🔄 재발행 후 원본 요청 재시도');
            return axios(originalRequest);
          } else {
            console.log('❌ 재발행 실패, 로그아웃 처리');
            logout();
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // SSE 연결 설정 (개선된 버전)
  const setupSSEConnection = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      console.log('🔐 토큰이 없어서 SSE 연결을 건너뜁니다.');
      return;
    }

    // 토큰 만료 체크
    if (isTokenExpired(accessToken)) {
      console.log('🔄 SSE 연결 전 토큰 만료 감지, 재발행 시도');
      reissueToken().then(success => {
        if (success) {
          setupSSEConnection();
        }
      });
      return;
    }

    if (eventSourceRef.current) {
      console.log('🔄 기존 SSE 연결을 해제합니다.');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      console.log('🔗 SSE 연결 시도 중...', `${API_BASE_URL}/api/auth/events`);
      
      const sseUrl = `${API_BASE_URL}/api/auth/events?token=${encodeURIComponent(accessToken)}`;
      let connectionStartTime = Date.now();
      const eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        const connectionTime = Date.now() - connectionStartTime;
        console.log(`✅ SSE 연결 성공 (${connectionTime}ms)`);
        reconnectAttempts.current = 0;
      };

      eventSource.addEventListener('connected', (event) => {
        console.log('✅ SSE 연결 확인:', event.data);
      });

      eventSource.addEventListener('keepalive', (event) => {
        console.log('💓 Keep-alive:', event.data);
      });

      eventSource.addEventListener('duplicate-login', (event) => {
        console.log('🚨 중복 로그인 감지:', event.data);
        alert('다른 기기에서 로그인되어 현재 세션이 종료됩니다.');
        handleForceLogout();
      });

      // 토큰 만료 관련 이벤트
      eventSource.addEventListener('TOKEN_EXPIRING_SOON', (event) => {
        console.log('⚠️ 토큰 만료 임박:', event.data);
        reissueToken();
      });

      eventSource.addEventListener('TOKEN_EXPIRED', (event) => {
        console.log('🚨 토큰 만료:', event.data);
        reissueToken();
      });

      eventSource.addEventListener('TOKEN_REFRESHED', (event) => {
        console.log('✅ 토큰 갱신 완료:', event.data);
      });

      // 시스템 공지
      eventSource.addEventListener('SYSTEM_NOTICE', (event) => {
        console.log('📢 시스템 공지:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'maintenance') {
            alert(`시스템 공지: ${data.message}`);
          }
        } catch (e) {
          console.error('시스템 공지 파싱 오류:', e);
        }
      });

      eventSource.onerror = (error) => {
        const connectionTime = Date.now() - connectionStartTime;
        console.error('❌ SSE 연결 오류:', error);
        
        if (connectionTime < 100) {
          console.log('⚠️ 빠른 실패 - CORS 또는 네트워크 문제 가능성');
        }
        
        checkTokenAndReconnect();
        eventSource.close();
      };

      eventSourceRef.current = eventSource;

    } catch (error) {
      console.error('❌ SSE 연결 설정 실패:', error);
    }
  };

  const checkTokenAndReconnect = async () => {
    const accessToken = sessionStorage.getItem('accessToken');
    
    if (!accessToken) {
      console.log('❌ 재연결 시도 중 토큰이 없음');
      return;
    }

    console.log('🔍 SSE 연결 실패, 토큰 재발행 시도');
    const reissueSuccess = await reissueToken();
    
    if (!reissueSuccess) {
      attemptReconnection();
    }
  };

  const attemptReconnection = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current - 1), 30000);
      
      console.log(`🔄 ${delay/1000}초 후 SSE 재연결 시도 (${reconnectAttempts.current}/${maxReconnectAttempts})`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setupSSEConnection();
      }, delay);
    } else {
      console.log('❌ SSE 최대 재연결 시도 횟수 초과');
    }
  };

  const manualReconnectSSE = () => {
    console.log('🔧 수동 SSE 재연결 시도');
    reconnectAttempts.current = 0;
    setupSSEConnection();
  };

  const handleForceLogout = () => {
    console.log('🔄 강제 로그아웃 처리 중...');
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (tokenExpiryCheckInterval.current) {
      clearInterval(tokenExpiryCheckInterval.current);
      tokenExpiryCheckInterval.current = null;
    }
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole');
    }
    
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    
    window.location.href = '/login';
  };

  // 로그인 함수 (개선된 버전)
  const login = (accessToken: string, refreshToken: string, userEmail?: string, userRole?: string) => {
    console.log('🔐 로그인 처리 중...', { userEmail, userRole });

    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);

    if (userEmail) {
      sessionStorage.setItem('userEmail', userEmail);
      setUserEmail(userEmail);
    }
    
    if (userRole) {
      sessionStorage.setItem('userRole', userRole);
      setUserRole(userRole);
    }

    setIsAuthenticated(true);

    // 토큰 만료 시간 체크 설정
    scheduleTokenExpiryCheck(accessToken);

    // 로그인 후 SSE 연결 설정 (약간의 지연)
    setTimeout(() => {
      console.log('🔄 로그인 후 SSE 연결 시작...');
      setupSSEConnection();
    }, 500);
  };

  // 로그아웃 함수 (개선된 버전)
  const logout = () => {
    console.log('🚪 로그아웃 처리 중...');
    
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (tokenExpiryCheckInterval.current) {
      clearInterval(tokenExpiryCheckInterval.current);
      tokenExpiryCheckInterval.current = null;
    }

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userRole');
    }
    
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserRole(null);
    
    console.log('✅ 로그아웃 완료');
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');

      if (!accessToken) {
        setIsAuthenticated(false);
        return false;
      }

      // 토큰 만료 체크
      if (isTokenExpired(accessToken)) {
        console.log('🔄 토큰 만료 감지, 재발행 시도');
        const reissueSuccess = await reissueToken();
        return reissueSuccess;
      }

      // 실제 API 호출로 토큰 검증
      const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/validate-token`, {
        method: 'POST',
        body: JSON.stringify({ token: accessToken })
      });
      
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("인증 확인 에러:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // 초기화 로직
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const savedEmail = sessionStorage.getItem('userEmail');
        const savedRole = sessionStorage.getItem('userRole');

        if (accessToken) {
          console.log('💾 저장된 토큰 발견, 인증 상태 설정 중...', {
            email: savedEmail,
            role: savedRole,
            isExpired: isTokenExpired(accessToken),
            expiryTime: getTokenExpiryTime(accessToken)
          });
          
          setIsAuthenticated(true);
          setUserEmail(savedEmail);
          setUserRole(savedRole);
          
          // 토큰 만료 체크 및 스케줄링
          if (isTokenExpired(accessToken)) {
            console.log('⚠️ 저장된 토큰이 만료됨, 재발행 시도');
            const reissueSuccess = await reissueToken();
            if (!reissueSuccess) {
              logout();
              return;
            }
          } else {
            scheduleTokenExpiryCheck(accessToken);
          }
          
          setTimeout(() => {
            setupSSEConnection();
          }, 100);

          try {
            await checkAuth();
          } catch (error) {
            console.error('토큰 검증 실패:', error);
          }
        } else {
          console.log('❌ 저장된 토큰이 없습니다.');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("초기 인증 확인 에러:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();

    return () => {
      console.log('🧹 AuthProvider 언마운트, 정리 중...');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (tokenExpiryCheckInterval.current) {
        clearInterval(tokenExpiryCheckInterval.current);
      }
    };
  }, []);

  // 페이지 가시성 변경 시 SSE 연결 관리
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('🔄 페이지 숨김: SSE 연결 일시 중단');
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      } else {
        console.log('🔄 페이지 표시: SSE 연결 확인');
        if (isAuthenticated && !eventSourceRef.current) {
          setTimeout(() => {
            setupSSEConnection();
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

useEffect(() => {
  const logTokenState = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    const refreshToken = sessionStorage.getItem('refreshToken');
    
    console.log('🔍 토큰 상태 체크:', {
      timestamp: new Date().toISOString(),
      hasAccess: !!accessToken,
      hasRefresh: !!refreshToken,
      accessExpired: accessToken ? isTokenExpired(accessToken) : null,
      refreshExpired: refreshToken ? isTokenExpired(refreshToken) : null,
      accessFirst10: accessToken?.substring(0, 10),
      refreshFirst10: refreshToken?.substring(0, 10)
    });
  };

  // 10초마다 토큰 상태 로그
  const interval = setInterval(logTokenState, 10000);
  
  return () => clearInterval(interval);
}, []);
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      userEmail,
      userRole,
      login, 
      logout, 
      checkAuth,
      reissueToken,
      authenticatedFetch,
      manualReconnectSSE,
      forceTokenExpiry,  // 테스트용
      getTokenInfo       // 테스트용
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