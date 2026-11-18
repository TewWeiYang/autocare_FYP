import { Link } from 'react-router-dom';
import { BackIcon } from './Icons.jsx';

// Shared frame for the Login and Create Account screens.
export default function AuthLayout({ title, children }) {
  return (
    <div className="screen">
      <header className="authhead">
        <h1>{title}</h1>
      </header>
      <main className="screen__body">
        <Link to="/" className="backlink" aria-label="Back"><BackIcon /></Link>
        {children}
      </main>
    </div>
  );
}
