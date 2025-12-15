// ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from './isAuthenticated';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();

  if (!auth) {

    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
