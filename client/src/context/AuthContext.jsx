import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import { TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check a saved token

  // On first load: if a token exists, ask the server who it belongs to.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) { setLoading(false); return; }
    authService.getMe()
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem(TOKEN_KEY)) // expired/invalid token
      .finally(() => setLoading(false));
  }, []);

  const saveSession = ({ token, user }) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(user);
  };

  const login = async (email, password) => saveSession(await authService.login({ email, password }));
  const signup = async (form) => saveSession(await authService.signup(form));
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setUser(null); };
  const updateBudget = async (amount) => setUser((await authService.updateBudget(amount)).user);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateBudget }}>
      {children}
    </AuthContext.Provider>
  );
}
