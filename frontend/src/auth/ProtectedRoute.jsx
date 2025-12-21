// src/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();



  if (isLoading) {
    return <div>Loading...</div>; // หรือใส่ Component Spinner ของคุณ
  }

  // ถ้าไม่มี User (ไม่ได้ Login หรือ Token หมดอายุ) ให้เด้งไปหน้า Signin
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;