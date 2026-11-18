import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useApi } from '../hooks/useApi.js';
import { BackIcon, CalendarIcon, ClockIcon, ICONS } from '../components/Icons.jsx';
import { ErrorBox } from '../components/PageState.jsx';
import { SERVICE_TYPES, TIME_SLOTS } from '../lib/constants.js';
import { formatTime, isoFromToday } from '../lib/format.js';

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const existing = useApi(() => api.listAppointments());
  const [serviceType, setServiceType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const taken = new Set((existing.data ?? []).filter((a) => a.date === date && a.status !== 'cancelled').map((a) => a.time));
  const ready = serviceType && date && time;
  const isSunday = date && new Date(date + 'T00:00:00').getDay() === 0;

  function pickDate(e) {
    setDate(e.target.value);
    setTime('');
    setError('');
  }

  async function submit(e) {
    e.preventDefault();
    if (!ready) return;
    if (isSunday) return setError('The workshop is closed on Sundays. Please choose another date.');
    setBusy(true);
    setError('');
    try {
      const appointment = await api.createAppointment({ serviceType, date, time, remarks: remarks.trim() });
      navigate('/book/confirmed', { state: { appointment }, replace: true });
    } catch (err) {
      setError(err.message);
      existing.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="backlink" aria-label="Back" onClick={() => navigate(-1)}><BackIcon /></button>
      <h1 className="h1">Book Appointment</h1>

      <form className="stack" onSubmit={submit}>
        <fieldset className="fieldset">
          <legend className="h3">Select Service Type</legend>
          <div className="options">
            {SERVICE_TYPES.map(({ id, label, icon }) => {
              const Icon = ICONS[icon];
              return (
                <label key={id} className={`option${serviceType === id ? ' is-selected' : ''}`}>
                  <Icon size={20} />
                  <span>{label}</span>
                  <input type="radio" name="serviceType" value={id} checked={serviceType === id} onChange={() => { setServiceType(id); setError(''); }} />
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="field">
          <label htmlFor="date" className="h3 iconlabel">Date <CalendarIcon size={18} /></label>
          <input id="date" className="input" type="date" min={isoFromToday(1)} value={date} onChange={pickDate} required />
        </div>

        <div className="field">
          <label htmlFor="time" className="h3 iconlabel">Time <ClockIcon size={18} /></label>
          <select id="time" className="input" value={time} onChange={(e) => { setTime(e.target.value); setError(''); }} disabled={!date} required>
            <option value="">{date ? 'Select a preferred time' : 'Pick a date first'}</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t} disabled={taken.has(t)}>{formatTime(t)}{taken.has(t) ? ' (booked)' : ''}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="remarks" className="h3">Special Remarks <span className="field__hint">(Optional)</span></label>
          <textarea id="remarks" className="input" rows={3} maxLength={500} placeholder="E.g. Check for faulty radio" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        {error && <div className="alert alert--bad" role="alert">{error}</div>}
        <ErrorBox error={existing.error} onRetry={existing.reload} />
        <button className="btn btn--primary" type="submit" disabled={!ready || busy}>{busy ? 'Booking...' : 'Confirm Booking'}</button>
      </form>
    </>
  );
}
