import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { isMock } from '../api';
import { isStaff } from '../lib/constants.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await login({ username: form.username.trim(), password: form.password });
      navigate(isStaff(user.role) ? '/staff' : location.state?.from || '/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Login">
      <h2 className="h2">Welcome Back!</h2>
      <form className="stack" onSubmit={submit}>
        <Field label="Username" autoComplete="username" required value={form.username} onChange={set('username')} />
        <Field label="Password" type="password" autoComplete="current-password" required value={form.password} onChange={set('password')} />
        {error && <div className="alert alert--bad" role="alert">{error}</div>}
        <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</button>
      </form>
      <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
      {isMock && (
        <p className="demo">
          Sample data mode.<br />
          Customer: <b>demo</b> / <b>demo1234</b><br />
          Staff: <b>staff</b> / <b>staff1234</b>
        </p>
      )}
    </AuthLayout>
  );
}
