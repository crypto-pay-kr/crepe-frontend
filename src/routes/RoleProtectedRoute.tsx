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
  const [userRole, setUserRole] = useState<'USER' | 'SELLER' | null>(null);
  const [isRoleResolved, setIsRoleResolved] = useState(false);
  const accessToken = sessionStorage.getItem('accessToken');
  
  // userRole 설정 및 해결
  useEffect(() => {
    const resolveUserRole = () => {
      let role = sessionStorage.getItem('userRole') as 'USER' | 'SELLER' | null;
      
      // userRole이 없다면 다른 방법으로 추론
      if (!role) {
        const isSeller = sessionStorage.getItem('isSeller');
        const storeInfo = sessionStorage.getItem('storeInfo');
        
        // 현재 접근하려는 경로를 기반으로 역할 추론
        const currentPath = window.location.pathname;
        
        if (isSeller === 'true' || storeInfo || currentPath.startsWith('/store')) {
          role = 'SELLER';
          sessionStorage.setItem('userRole', 'SELLER');
        } else if (isSeller === 'false' || currentPath.startsWith('/user') || currentPath.startsWith('/my')) {
          role = 'USER';
          sessionStorage.setItem('userRole', 'USER');
        } else {
          // 경로 기반으로도 알 수 없는 경우, API 호출로 확인 필요
          // 임시로 USER로 설정하되, 추후 API로 확인
          console.log('⚠️ 역할을 추론할 수 없습니다. 임시로 USER 설정');
          role = 'USER';
          sessionStorage.setItem('userRole', 'USER');
        }
      }
      
      setUserRole(role);
      setIsRoleResolved(true);
      
      console.log('🔍 Role resolved:', {
        role,
        isSeller: sessionStorage.getItem('isSeller'),
        storeInfo: sessionStorage.getItem('storeInfo'),
        currentPath: window.location.pathname
      });
    };

    if (isAuthenticated && accessToken) {
      resolveUserRole();
    } else {
      setIsRoleResolved(true);
    }
  }, [isAuthenticated, accessToken]);
  
  // 디버깅용 로그 (한 번만 출력)
  useEffect(() => {
    if (isRoleResolved) {
      console.log('🔍 RoleProtectedRoute Final State:', {
        isAuthenticated,
        isLoading,
        userRole,
        allowedRoles,
        hasAccessToken: !!accessToken,
        redirectTo,
        isRoleResolved
      });
    }
  }, [isRoleResolved, isAuthenticated, isLoading, userRole, allowedRoles, accessToken, redirectTo]);
  
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
  
  // userRole이 여전히 없는 경우 - 로그인 페이지로 리다이렉트
  if (!userRole) {
    console.log('⚠️ UserRole still null, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // 권한이 없는 경우 (잘못된 역할)
  if (!allowedRoles.includes(userRole)) {
    console.log('❌ Wrong role, redirecting to:', redirectTo);
    // SELLER가 USER 페이지에 접근하려 할 때
    if (userRole === 'SELLER' && redirectTo === '/mall') {
      return <Navigate to="/store/my" replace />;
    }
    // USER가 SELLER 페이지에 접근하려 할 때
    if (userRole === 'USER' && redirectTo !== '/mall') {
      return <Navigate to="/user/my" replace />;
    }
    return <Navigate to={redirectTo} replace />;
  }
  
  console.log('✅ Access granted');
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