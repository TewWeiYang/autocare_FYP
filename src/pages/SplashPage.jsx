import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CarIcon } from '../components/Icons.jsx';
import { isStaff } from '../lib/constants.js';

// "AppPage" in the wireframe: logo, picture area, Login and Create an Account.
export default function SplashPage() {
  const { isAuthed, user } = useAuth();
  if (isAuthed) return <Navigate to={isStaff(user?.role) ? '/staff' : '/home'} replace />;
  return (
    <div className="screen splash">
      <h1 className="splash__title">AutoCARe</h1>
      <div className="splash__art" aria-hidden="true"><CarIcon size={96} /></div>
      <p className="splash__tag">Service reminders, history and bookings for your car.</p>
      <div className="stack">
        <Link to="/login" className="btn btn--primary">Login</Link>
        <Link to="/register" className="btn btn--ghost">Create an Account</Link>
      </div>
    </div>
  );
}
