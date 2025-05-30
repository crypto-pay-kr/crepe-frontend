// RoleProtectedRoute.tsx
import { useAuthContext } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface RoleProtectedRouteProps {
  allowedRoles: ('USER' | 'SELLER')[];
  redirectTo?: string;
}

export function RoleProtectedRoute({ 
  allowedRoles, 
  redirectTo = '/login' 
}: RoleProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const [isRoleResolved, setIsRoleResolved] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');
  
  // sessionStorage에서 직접 userRole을 가져오는 함수
  const getCurrentUserRole = (): 'USER' | 'SELLER' | null => {
    let role = sessionStorage.getItem('userRole') as 'USER' | 'SELLER' | null;
    
    // userRole이 없다면 다른 방법으로 추론
    if (!role) {
      const isSeller = sessionStorage.getItem('isSeller');
      const storeInfo = sessionStorage.getItem('storeInfo');
      const currentPath = window.location.pathname;
      
      console.log('🔍 역할 추론 데이터:', {
        isSeller,
        storeInfo,
        currentPath
      });
      
      if (isSeller === 'true' || storeInfo || currentPath.startsWith('/store')) {
        role = 'SELLER';
        sessionStorage.setItem('userRole', 'SELLER');
        console.log('✅ SELLER로 설정됨');
      } else if (isSeller === 'false' || currentPath.startsWith('/user')) {
        role = 'USER';
        sessionStorage.setItem('userRole', 'USER');
        console.log('✅ USER로 설정됨');
      } else {
        console.log('⚠️ 역할을 추론할 수 없습니다. 임시로 USER 설정');
        role = 'USER';
        sessionStorage.setItem('userRole', 'USER');
      }
    }
    
    return role;
  };
  
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      // 역할 해결
      getCurrentUserRole();
    }
    setIsRoleResolved(true);
  }, [isAuthenticated, accessToken]);
  
  // 로딩 중일 때는 로딩 표시
  if (isLoading || !isRoleResolved) {
    console.log('⏳ Loading or role not resolved...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // 로그인하지 않은 경우
  if (!isAuthenticated || !accessToken) {
    console.log('❌ Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  // 현재 사용자 역할 가져오기 (sessionStorage에서 직접)
  const currentUserRole = getCurrentUserRole();
  
  // userRole이 여전히 없는 경우 - 로그인 페이지로 리다이렉트
  if (!currentUserRole) {
    console.log('⚠️ UserRole still null, redirecting to login');
    console.log('📊 현재 상태:', {
      currentUserRole,
      isRoleResolved,
      sessionStorageRole: sessionStorage.getItem('userRole'),
      isAuthenticated,
      accessToken: !!accessToken
    });
    return <Navigate to="/login" replace />;
  }
  
  // 권한이 없는 경우 (잘못된 역할)
  if (!allowedRoles.includes(currentUserRole)) {
    console.log('❌ Wrong role, redirecting to:', redirectTo);
    console.log('📊 권한 체크:', {
      currentUserRole,
      allowedRoles,
      redirectTo
    });
    
    // SELLER가 USER 페이지에 접근하려 할 때
    if (currentUserRole === 'SELLER' && redirectTo === '/mall') {
      return <Navigate to="/store/my" replace />;
    }
    // USER가 SELLER 페이지에 접근하려 할 때
    if (currentUserRole === 'USER' && redirectTo !== '/mall') {
      return <Navigate to="/store/my" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }
  
  console.log('✅ Access granted for role:', currentUserRole);
  return <Outlet />;
}

// SellerOnlyRoute.tsx - SELLER 전용 라우트
export function SellerOnlyRoute() {
  return <RoleProtectedRoute allowedRoles={['SELLER']} redirectTo="/user/my" />;
}

// UserOnlyRoute.tsx - USER 전용 라우트  
export function UserOnlyRoute() {
  return <RoleProtectedRoute allowedRoles={['USER']} redirectTo="/store/my" />;
}