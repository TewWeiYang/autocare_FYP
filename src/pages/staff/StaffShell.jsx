import { createContext, useContext } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../context/AuthContext.jsx';
import { useApi } from '../../hooks/useApi.js';
import { ErrorBox, Loading } from '../../components/PageState.jsx';
import '../../staff.css';

// The dashboard data is loaded once here and shared by every staff page.
const StaffDataContext = createContext(null);
export const useStaffData = () => useContext(StaffDataContext);

const NAV = [
  ['/staff', 'Dashboard'],
  ['/staff/appointments', 'Appointments'],
  ['/staff/customers', 'Customers'],
  ['/staff/vehicles', 'Vehicles'],
  ['/staff/services', 'Service Records'],
  ['/staff/maintenance', 'Maintenance'],
];

export default function StaffShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dash = useApi(() => api.getStaffDashboard());
  const title = NAV.find(([to]) => to === pathname)?.[1] ?? 'Staff Dashboard';

  function signOut() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <div className="staff">
      <aside className="staff__side">
        <h2>AutoCARe</h2>
        <p>Staff Portal</p>
        <nav aria-label="Staff">
          {NAV.map(([to, label]) => {
            const active = pathname === to;
            return (
              <NavLink key={to} to={to} className={`staff__link${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                {label}
              </NavLink>
            );
          })}
        </nav>
        <div className="staff__user">
          <b>{user.username}</b>
          <span>{user.role}</span>
        </div>
        <button type="button" className="staff__logout" onClick={signOut}>Logout</button>
      </aside>

      <main className="staff__main">
        <header className="staff__head">
          <div>
            <h1>{title}</h1>
            <p>Welcome to the staff management portal.</p>
          </div>
          <button type="button" className="staff__btn" onClick={dash.reload} disabled={dash.loading}>
            {dash.loading ? 'Loading...' : 'Refresh'}
          </button>
        </header>

        {dash.loading && !dash.data && <Loading />}
        <ErrorBox error={dash.error} onRetry={dash.reload} />
        {dash.data && (
          <StaffDataContext.Provider value={dash.data}>
            <Outlet />
          </StaffDataContext.Provider>
        )}
      </main>
    </div>
  );
}
