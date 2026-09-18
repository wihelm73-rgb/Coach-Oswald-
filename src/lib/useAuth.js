// Authentification — BOUCHON, 100 % local (pas de backend).
//
// `login()` n'appelle aucun serveur : il accepte n'importe quel email/mot de passe non vides et
// simule une session, persistée dans localStorage pour survivre à un rechargement de page.
import { useEffect, useState } from 'react';

const LS_AUTH = 'oswald_auth';

const loadUser = () => {
  try {
    const raw = localStorage.getItem(LS_AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState(loadUser);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(LS_AUTH, JSON.stringify(user));
      else localStorage.removeItem(LS_AUTH);
    } catch {
      /* ignore */
    }
  }, [user]);

  const login = (email, password) => {
    if (!email?.trim() || !password?.trim()) {
      return { ok: false, error: 'Email et mot de passe requis.' };
    }
    // BOUCHON : aucune vérification réelle des identifiants.
    setUser({ email: email.trim() });
    return { ok: true };
  };

  const logout = () => setUser(null);

  return { user, isLoggedIn: Boolean(user), login, logout };
}
