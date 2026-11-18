import { useMemo, useState } from 'react';
import { api } from '../api';
import { useApi } from '../hooks/useApi.js';
import { ErrorBox, Loading } from '../components/PageState.jsx';
import { formatDate, kmText, money } from '../lib/format.js';

export default function ServiceBookletPage() {
  const records = useApi(() => api.listServiceRecords());
  const [filterBy, setFilterBy] = useState(''); // '', 'date' or 'parts'
  const [month, setMonth] = useState('');       // YYYY-MM
  const [part, setPart] = useState('');

  const all = useMemo(() => [...(records.data ?? [])].sort((a, b) => b.date.localeCompare(a.date)), [records.data]);
  const partNames = useMemo(() => [...new Set(all.flatMap((r) => r.parts))].sort(), [all]);

  const visible = all.filter((r) => {
    if (filterBy === 'date' && month) return r.date.startsWith(month);
    if (filterBy === 'parts' && part) return r.parts.includes(part);
    return true;
  });

  function changeFilter(e) {
    setFilterBy(e.target.value);
    setMonth('');
    setPart('');
  }

  return (
    <>
      <h1 className="h1">Service Booklet</h1>

      <div className="filters">
        <label htmlFor="filterBy" className="small">Filter by:</label>
        <select id="filterBy" className="input input--sm" value={filterBy} onChange={changeFilter}>
          <option value="">All records</option>
          <option value="date">Date</option>
          <option value="parts">Parts</option>
        </select>
        {filterBy === 'date' && (
          <input className="input input--sm" type="month" aria-label="Month" value={month} onChange={(e) => setMonth(e.target.value)} />
        )}
        {filterBy === 'parts' && (
          <select className="input input--sm" aria-label="Part" value={part} onChange={(e) => setPart(e.target.value)}>
            <option value="">Any part</option>
            {partNames.map((p) => <option key={p}>{p}</option>)}
          </select>
        )}
      </div>

      {records.loading && <Loading />}
      <ErrorBox error={records.error} onRetry={records.reload} />
      {!records.loading && !records.error && visible.length === 0 && (
        <p className="muted">{all.length === 0 ? 'No service records yet. They appear here after your first visit.' : 'No records match this filter.'}</p>
      )}

      <div className="stack">
        {visible.map((r) => (
          <article key={r.id} className="panel record">
            <h2 className="h3">{r.title}</h2>
            <p className="small muted">Date: {formatDate(r.date)} · {kmText(r.mileage)}</p>
            <hr />
            <h3 className="small strong">Parts Replaced</h3>
            <ul className="small partlist">
              {r.parts.length ? r.parts.map((p) => <li key={p}>{p}</li>) : <li>None</li>}
            </ul>
            <hr />
            <div className="row between small"><b>Total Cost:</b><b>{money(r.totalCost)}</b></div>
          </article>
        ))}
      </div>
    </>
  );
}
