import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
const KEY = 'autocare-session';

function readSession() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s?.token) {
      api.setToken(s.token);
      return s;
    }
  } catch { /* no saved session */ }
  return null;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const persist = useCallback((next) => {
    setSession(next);
    api.setToken(next?.token ?? null);
    try {
      if (next) localStorage.setItem(KEY, JSON.stringify(next));
      else localStorage.removeItem(KEY);
    } catch { /* ignore */ }
  }, []);

  const login = useCallback(async (credentials) => {
    const next = await api.login(credentials);
    persist(next);
    return next.user; // lets the login page send staff and customers to different places
  }, [persist]);
  const register = useCallback(async (data) => persist(await api.register(data)), [persist]);
  const logout = useCallback(() => persist(null), [persist]);
  const updateUser = useCallback(async (patch) => {
    const user = await api.updateMe(patch);
    persist({ ...session, user });
    return user;
  }, [persist, session]);

  const value = useMemo(
    () => ({ user: session?.user ?? null, isAuthed: Boolean(session), login, register, logout, updateUser }),
    [session, login, register, logout, updateUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
