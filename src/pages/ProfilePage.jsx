import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserIcon } from '../components/Icons.jsx';
import Field from '../components/Field.jsx';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: user.username, email: user.email, phone: user.phone ?? '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function startEdit() {
    setForm({ username: user.username, email: user.email, phone: user.phone ?? '' });
    setError('');
    setSaved(false);
    setEditing(true);
  }

  async function save(e) {
    e.preventDefault();
    if (form.username.trim().length < 3) return setError('Username needs at least 3 characters.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (!/^\+?[0-9 ]{8,15}$/.test(form.phone)) return setError('Enter a phone number with 8 to 15 digits.');
    setBusy(true);
    setError('');
    try {
      await updateUser({ username: form.username.trim(), email: form.email.trim(), phone: form.phone.trim() });
      setEditing(false);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function signOut() {
    logout();
    navigate('/', { replace: true });
  }

  return (
    <>
      <h1 className="h1">Profile</h1>
      <div className="avatar" aria-hidden="true"><UserIcon size={48} /></div>

      <form className="stack" onSubmit={save} noValidate>
        <Field label="Username" readOnly={!editing} value={editing ? form.username : user.username} onChange={set('username')} />
        <Field label="Email" type="email" readOnly={!editing} value={editing ? form.email : user.email} onChange={set('email')} />
        <Field label="Phone Number" type="tel" readOnly={!editing} value={editing ? form.phone : user.phone ?? ''} onChange={set('phone')} />
        {error && <div className="alert alert--bad" role="alert">{error}</div>}
        {saved && !editing && <div className="alert alert--good" role="status">Profile saved.</div>}
        {editing ? (
          <div className="row">
            <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
            <button className="btn btn--ghost" type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn btn--ghost btn--narrow" type="button" onClick={startEdit}>Edit Profile</button>
        )}
      </form>

      <button type="button" className="linkbtn danger center" onClick={signOut}>Log out</button>
    </>
  );
}
