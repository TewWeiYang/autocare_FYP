import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth.jsx';
import AppShell from './components/AppShell.jsx';
import SplashPage from './pages/SplashPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import CreateAccountPage from './pages/CreateAccountPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VehiclePage from './pages/VehiclePage.jsx';
import ServiceBookletPage from './pages/ServiceBookletPage.jsx';
import BookAppointmentPage from './pages/BookAppointmentPage.jsx';
import BookingConfirmedPage from './pages/BookingConfirmedPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StaffShell from './pages/staff/StaffShell.jsx';
import {
  StaffAppointments, StaffCustomers, StaffDashboard, StaffMaintenance, StaffServices, StaffVehicles,
} from './pages/staff/StaffPages.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<CreateAccountPage />} />

      <Route element={<RequireAuth area="staff" />}>
        <Route element={<StaffShell />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/customers" element={<StaffCustomers />} />
          <Route path="/staff/vehicles" element={<StaffVehicles />} />
          <Route path="/staff/services" element={<StaffServices />} />
          <Route path="/staff/maintenance" element={<StaffMaintenance />} />
        </Route>
      </Route>

      <Route element={<RequireAuth area="customer" />}>
        <Route element={<AppShell />}>
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/service" element={<ServiceBookletPage />} />
          <Route path="/book" element={<BookAppointmentPage />} />
          <Route path="/book/confirmed" element={<BookingConfirmedPage />} />
          <Route path="/vehicle" element={<VehiclePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
