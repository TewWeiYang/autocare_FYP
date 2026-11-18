import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { CarIcon, HomeIcon, UserIcon, WrenchIcon } from './Icons.jsx';

const TABS = [
  { to: '/home', label: 'Home', Icon: HomeIcon },
  { to: '/service', label: 'Service', Icon: WrenchIcon, also: ['/book'] },
  { to: '/vehicle', label: 'Vehicle', Icon: CarIcon },
  { to: '/profile', label: 'Profile', Icon: UserIcon },
];

// Page frame with the bottom navigation used by every signed-in screen.
export default function AppShell() {
  const { pathname } = useLocation();
  return (
    <div className="screen">
      <main className="screen__body">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map(({ to, label, Icon, also = [] }) => {
          const active = pathname === to || also.some((p) => pathname.startsWith(p));
          return (
            <NavLink key={to} to={to} className={`tabbar__item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
