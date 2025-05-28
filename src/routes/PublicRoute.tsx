import { Navigate, Outlet } from 'react-router-dom'

/**
 * PublicRoute - 로그인하지 않은 사용자만 접근할 수 있는 라우트
 * 로그인한 사용자가 회원가입/로그인 페이지에 접근하려 할 때 리다이렉트
 */
const PublicRoute = () => {
  const accessToken = sessionStorage.getItem('accessToken')
  let userRole = sessionStorage.getItem('userRole') // 'USER' 또는 'SELLER'
  
  // userRole이 없다면 isSeller 정보로 판단
  if (!userRole) {
    const isSeller = sessionStorage.getItem('isSeller')
    if (isSeller === 'true') {
      userRole = 'SELLER'
      sessionStorage.setItem('userRole', 'SELLER')
    } else if (isSeller === 'false') {
      userRole = 'USER'
      sessionStorage.setItem('userRole', 'USER')
    }
  }
  
  // 로그인한 사용자라면 적절한 메인 페이지로 리다이렉트
  if (accessToken) {
    <Navigate to="/my/coin" replace />
  }

  // 로그인하지 않은 사용자는 페이지 접근 허용
  return <Outlet />
}

export default PublicRoute