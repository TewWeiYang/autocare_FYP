import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { BellIcon, BookIcon, CalendarIcon, SupportIcon } from '../components/Icons.jsx';
import { ErrorBox, Loading } from '../components/PageState.jsx';
import { SUPPORT_EMAIL, serviceLabel } from '../lib/constants.js';
import { formatDate, formatTime, healthLabel } from '../lib/format.js';

const ACTIVE = ['pending', 'approved', 'confirmed', 'rescheduled'];

export default function DashboardPage() {
  const { user } = useAuth();
  const health = useApi(() => api.getHealth());
  const appts = useApi(() => api.listAppointments());
  const notes = useApi(() => api.listNotifications());
  const [showAll, setShowAll] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  const upcoming = (appts.data ?? [])
    .filter((a) => ACTIVE.includes(a.status))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const shown = showAll ? upcoming : upcoming.slice(0, 2);
  const unread = (notes.data ?? []).filter((n) => !n.read).length;
  const score = health.data?.score;
  const label = score != null ? healthLabel(score) : null;

  async function read(id) {
    await api.markNotificationRead(id);
    notes.reload();
  }

  return (
    <>
      <header className="row between">
        <h1 className="h1">AutoCARe</h1>
        <button type="button" className="iconbtn" aria-label={`Notifications, ${unread} unread`} aria-expanded={bellOpen} onClick={() => setBellOpen((o) => !o)}>
          <BellIcon />
          {unread > 0 && <span className="badge">{unread}</span>}
        </button>
      </header>
      <p className="muted small">Hi, {user?.username}! How can we help you today?</p>

      {bellOpen && (
        <section className="card" aria-label="Notifications">
          {(notes.data ?? []).length === 0 && <p className="muted small">No notifications yet.</p>}
          {(notes.data ?? []).map((n) => (
            <button key={n.id} type="button" className={`note${n.read ? ' is-read' : ''}`} onClick={() => read(n.id)}>
              <b>{n.title}</b>
              <span className="muted small">{n.message}</span>
            </button>
          ))}
        </section>
      )}

      <section className="panel health" aria-label="Vehicle health score">
        {health.loading ? <Loading /> : score == null ? (
          <p className="small">Add your vehicle to see its health score. <Link to="/vehicle">Add vehicle</Link></p>
        ) : (
          <>
            <div className="score" aria-hidden="true"><b>{score}</b><span>/100</span></div>
            <div>
              <h2 className="h3">Vehicle Health Score</h2>
              <span className={`tone tone--${label.tone}`}>{label.word}</span>
            </div>
          </>
        )}
      </section>
      <ErrorBox error={health.error} onRetry={health.reload} />

      <section aria-labelledby="upcoming">
        <div className="row between">
          <h2 className="h3" id="upcoming">Upcoming Appointments</h2>
          {upcoming.length > 2 && (
            <button type="button" className="linkbtn" onClick={() => setShowAll((s) => !s)}>{showAll ? 'Show less' : 'View all →'}</button>
          )}
        </div>
        <div className="stack stack--tight">
          {appts.loading && <Loading />}
          <ErrorBox error={appts.error} onRetry={appts.reload} />
          {!appts.loading && upcoming.length === 0 && <p className="muted small">No appointments yet. Book one below.</p>}
          {shown.map((a) => (
            <div key={a.id} className="panel">
              <b>{formatDate(a.date)}, {formatTime(a.time)}</b>
              <div className="small">Description: {serviceLabel(a.serviceType)}{a.remarks ? ` (${a.remarks})` : ''}</div>
              <div className="small muted">Status: {a.status}</div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="quick">
        <h2 className="h3" id="quick">Quick Links</h2>
        <div className="quick">
          <Link to="/book" className="quick__item"><CalendarIcon size={28} /><span>Book Appointment</span></Link>
          <Link to="/service" className="quick__item"><BookIcon size={28} /><span>Service Booklet</span></Link>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="quick__item"><SupportIcon size={28} /><span>Contact Support</span></a>
        </div>
      </section>
    </>
  );
}
