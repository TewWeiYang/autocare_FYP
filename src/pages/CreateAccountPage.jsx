import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function validate(f) {
  if (!/^\S+@\S+\.\S+$/.test(f.email)) return 'Enter a valid email address.';
  if (f.username.trim().length < 3) return 'Username needs at least 3 characters.';
  if (f.password.length < 8) return 'Password needs at least 8 characters.';
  if (!/^\+?[0-9 ]{8,15}$/.test(f.phone)) return 'Enter a phone number with 8 to 15 digits.';
  return '';
}

export default function CreateAccountPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const problem = validate(form);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      await register({ ...form, username: form.username.trim(), email: form.email.trim(), phone: form.phone.trim() });
      navigate('/home', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthLayout title="Create an Account">
      <form className="stack" onSubmit={submit} noValidate>
        <Field label="Email Address" type="email" autoComplete="email" value={form.email} onChange={set('email')} />
        <Field label="Username" autoComplete="username" value={form.username} onChange={set('username')} />
        <Field label="Password" type="password" autoComplete="new-password" hint="(8+ characters)" value={form.password} onChange={set('password')} />
        <Field label="Phone Number" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} />
        {error && <div className="alert alert--bad" role="alert">{error}</div>}
        <button className="btn btn--primary" type="submit" disabled={busy}>{busy ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p className="muted center">Already registered? <Link to="/login">Login</Link></p>
    </AuthLayout>
  );
}
