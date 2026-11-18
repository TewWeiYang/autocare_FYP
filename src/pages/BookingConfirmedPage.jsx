import { Link, Navigate, useLocation } from 'react-router-dom';
import { CalendarIcon, CheckIcon, WrenchIcon } from '../components/Icons.jsx';
import { serviceLabel } from '../lib/constants.js';
import { formatDate, formatTime } from '../lib/format.js';

export default function BookingConfirmedPage() {
  const appointment = useLocation().state?.appointment;
  if (!appointment) return <Navigate to="/home" replace />;

  return (
    <div className="confirm">
      <div className="confirm__tick" aria-hidden="true"><CheckIcon size={32} /></div>
      <h1 className="h2">Appointment Confirmed!</h1>
      <p className="muted">Your appointment has been successfully booked. The workshop will confirm it within one working day.</p>
      <div className="panel summary">
        <div className="row"><CalendarIcon size={20} /><b>{formatDate(appointment.date)} - {formatTime(appointment.time)}</b></div>
        <div className="row"><WrenchIcon size={20} /><span>{serviceLabel(appointment.serviceType)}</span></div>
      </div>
      <Link to="/home" className="btn btn--primary">Back to Home</Link>
    </div>
  );
}
