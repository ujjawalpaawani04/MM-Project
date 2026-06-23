/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import { createContext, useContext, useCallback, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);

/**
 * Lightweight, front-end-only auth. There is no backend in this project, so a
 * "session" is just a user object persisted to localStorage. Swap the bodies of
 * login/signup for real API calls when a backend exists - the surface (user,
 * isAuthenticated, login, signup, logout) stays the same.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("mm-user", null);

  const login = useCallback(
    ({ email, name }) =>
      setUser({ email, name: name || email.split("@")[0] }),
    [setUser]
  );

  const signup = useCallback(
    ({ name, email }) => setUser({ name, email }),
    [setUser]
  );

  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, signup, logout }),
    [user, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
