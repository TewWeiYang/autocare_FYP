import { useEffect, useState } from 'react';
import { api } from '../api';
import { useApi } from '../hooks/useApi.js';
import { CarIcon } from '../components/Icons.jsx';
import Field from '../components/Field.jsx';
import { ErrorBox, Loading } from '../components/PageState.jsx';
import { OWNERSHIP_OPTIONS } from '../lib/constants.js';
import { healthLabel, kmText } from '../lib/format.js';

const EMPTY = { plateNumber: '', model: '', year: '', mileage: '', ownership: OWNERSHIP_OPTIONS[0] };

export default function VehiclePage() {
  const vehicle = useApi(() => api.getVehicle());
  const health = useApi(() => api.getHealth());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const v = vehicle.data;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // A new account has no vehicle yet, so open the form straight away.
  useEffect(() => {
    if (!vehicle.loading && !vehicle.error && !v) {
      setForm(EMPTY);
      setEditing(true);
    }
  }, [vehicle.loading, vehicle.error, v]);

  function startEdit() {
    setForm({ plateNumber: v.plateNumber, model: v.model, year: String(v.year), mileage: String(v.mileage), ownership: v.ownership });
    setError('');
    setEditing(true);
  }

  async function save(e) {
    e.preventDefault();
    const year = Number(form.year);
    const mileage = Number(form.mileage);
    if (!form.plateNumber.trim() || !form.model.trim()) return setError('Enter the plate number, brand and model.');
    if (!Number.isInteger(year) || year < 1990 || year > new Date().getFullYear() + 1) return setError('Enter a valid year.');
    if (!Number.isInteger(mileage) || mileage < 0) return setError('Mileage must be a whole number of km.');
    if (v && mileage < v.mileage) return setError(`Mileage cannot be lower than the current ${kmText(v.mileage)}.`);
    setBusy(true);
    setError('');
    try {
      await api.saveVehicle({ plateNumber: form.plateNumber.trim().toUpperCase(), model: form.model.trim(), year, mileage, ownership: form.ownership });
      setEditing(false);
      vehicle.reload();
      health.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (vehicle.loading) return <Loading />;
  const score = health.data?.score;
  const label = score != null ? healthLabel(score) : null;

  return (
    <>
      <h1 className="h1 center">My Vehicle</h1>
      <ErrorBox error={vehicle.error} onRetry={vehicle.reload} />
      <div className="hero" aria-hidden="true"><CarIcon size={72} /></div>

      {editing ? (
        <form className="stack" onSubmit={save} noValidate>
          <Field label="Plate No." value={form.plateNumber} onChange={set('plateNumber')} />
          <Field label="Brand and model (e.g. Toyota Corolla)" value={form.model} onChange={set('model')} />
          <div className="grid2">
            <Field label="Year" type="number" inputMode="numeric" value={form.year} onChange={set('year')} />
            <Field label="Mileage (km)" type="number" inputMode="numeric" value={form.mileage} onChange={set('mileage')} />
          </div>
          <div className="field">
            <label htmlFor="ownership">Ownership</label>
            <select id="ownership" className="input" value={form.ownership} onChange={set('ownership')}>
              {OWNERSHIP_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          {error && <div className="alert alert--bad" role="alert">{error}</div>}
          <div className="row">
            <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
            {v && <button className="btn btn--ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>}
          </div>
        </form>
      ) : v && (
        <>
          <h2 className="h2 center plate">{v.plateNumber}</h2>
          <dl className="facts">
            <dt>Model:</dt><dd>{v.model}</dd>
            <dt>Year:</dt><dd>{v.year}</dd>
            <dt>Mileage:</dt><dd>{kmText(v.mileage)}</dd>
            <dt>Ownership:</dt><dd>{v.ownership}</dd>
          </dl>
          <button type="button" className="btn btn--ghost btn--narrow" onClick={startEdit}>Edit Details</button>

          {score != null && (
            <section aria-label="Vehicle health">
              <div className="row between"><h2 className="h3">Vehicle Health:</h2><b>{score}/100</b></div>
              <div className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
                <i className={`bar--${label.tone}`} style={{ width: `${score}%` }} />
              </div>
              <p className={`pillnote tone--${label.tone}`}>{label.message}</p>
            </section>
          )}
        </>
      )}
    </>
  );
}
