import { useStaffData } from './StaffShell.jsx';
import { formatDate, money } from '../../lib/format.js';

// Values are rendered as text by React, so names or notes typed by users cannot inject HTML.
const date = (v) => (v ? formatDate(v) : '-');

const TONE = { pending: 'warn', approved: 'good', confirmed: 'good', completed: 'good', rescheduled: 'info', cancelled: 'bad', good: 'good', monitor: 'warn', 'replace soon': 'bad' };
function Status({ value }) {
  const key = String(value ?? '').toLowerCase();
  return <span className={`tone tone--${TONE[key] ?? 'info'}`}>{value || '-'}</span>;
}

function Table({ head, children, empty = 'Nothing to show yet.' }) {
  const rows = Array.isArray(children) ? children : [children];
  return (
    <div className="staff__table">
      <table>
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.filter(Boolean).length ? rows : <tr><td colSpan={head.length} className="muted">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const Card = ({ title, children }) => (
  <section className="staff__card">
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

export function StaffDashboard() {
  const { counts, appointments } = useStaffData();
  const stats = [
    ['Total Appointments', counts.totalAppointments],
    ['Pending Appointments', counts.pendingAppointments],
    ['Completed Services', counts.completedServices],
    ['Ongoing Services', counts.ongoingServices],
  ];
  return (
    <>
      <div className="staff__stats">
        {stats.map(([label, value]) => (
          <div key={label} className="staff__stat"><h3>{label}</h3><b>{value}</b></div>
        ))}
      </div>
      <Card title="Recent Appointments">
        <Table head={['Customer', 'Vehicle', 'Date', 'Service', 'Status']} empty="No appointments yet.">
          {appointments.slice(0, 5).map((a) => (
            <tr key={a.id}>
              <td>{a.customer}</td><td>{a.registration_no}</td><td>{date(a.appointment_date)}</td>
              <td>{a.service_type}</td><td><Status value={a.status} /></td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}

export function StaffAppointments() {
  const { appointments } = useStaffData();
  return (
    <Card title="Appointment Management">
      <Table head={['ID', 'Customer', 'Vehicle', 'Date', 'Service', 'Status']} empty="No appointments yet.">
        {appointments.map((a) => (
          <tr key={a.id}>
            <td>{a.id}</td><td>{a.customer}</td><td>{a.registration_no}</td><td>{date(a.appointment_date)}</td>
            <td>{a.service_type}</td><td><Status value={a.status} /></td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export function StaffCustomers() {
  const { customers } = useStaffData();
  return (
    <Card title="Customer Management">
      <Table head={['ID', 'Name', 'Email', 'Phone']} empty="No customers yet.">
        {customers.map((c) => (
          <tr key={c.id}><td>{c.id}</td><td>{c.name}</td><td>{c.email}</td><td>{c.phone || '-'}</td></tr>
        ))}
      </Table>
    </Card>
  );
}

export function StaffVehicles() {
  const { vehicles } = useStaffData();
  return (
    <Card title="Vehicle Management">
      <Table head={['Registration', 'Owner', 'Make', 'Model', 'Year']} empty="No vehicles yet.">
        {vehicles.map((v) => (
          <tr key={v.registration_no}><td>{v.registration_no}</td><td>{v.owner}</td><td>{v.make}</td><td>{v.model}</td><td>{v.year}</td></tr>
        ))}
      </Table>
    </Card>
  );
}

export function StaffServices() {
  const { services } = useStaffData();
  return (
    <Card title="Service Records">
      <Table head={['ID', 'Vehicle', 'Service', 'Date', 'Cost', 'Status']} empty="No service records yet.">
        {services.map((s) => (
          <tr key={s.id}>
            <td>{s.id}</td><td>{s.registration_no}</td><td>{s.service_type}</td><td>{date(s.service_date)}</td>
            <td>{money(s.cost)}</td><td><Status value={s.status} /></td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}

export function StaffMaintenance() {
  const { reminders } = useStaffData();
  return (
    <Card title="Maintenance Reminders">
      <Table head={['Vehicle', 'Reminder', 'Due Date', 'Status']} empty="No reminders yet.">
        {reminders.map((m, i) => (
          <tr key={`${m.registration_no}-${i}`}>
            <td>{m.registration_no}</td><td>{m.reminder}</td><td>{date(m.due_date)}</td><td><Status value={m.status} /></td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}
