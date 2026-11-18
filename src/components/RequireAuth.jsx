import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { isStaff } from '../lib/constants.js';

// Guards a group of routes. area is 'customer' or 'staff'.
// Logged-out visitors go to login; users in the wrong area go to their own home.
export default function RequireAuth({ area = 'customer' }) {
  const { isAuthed, user } = useAuth();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  const staff = isStaff(user?.role);
  if (area === 'staff' && !staff) return <Navigate to="/home" replace />;
  if (area === 'customer' && staff) return <Navigate to="/staff" replace />;
  return <Outlet />;
}
