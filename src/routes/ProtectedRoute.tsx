import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  const token = sessionStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;