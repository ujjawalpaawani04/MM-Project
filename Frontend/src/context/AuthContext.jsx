/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as authStore from "../utils/auth";

const AuthContext = createContext(null);

/**
 * Front-end-only auth backed by a real multi-user registry in localStorage
 * (see utils/auth.js). A "session" is a signed-in user restored from storage on
 * load, with expiry + "remember me" honoured. The public surface stays stable
 * so a backend can replace utils/auth.js later without touching the UI:
 *
 *   { user, isAuthenticated, ready,
 *     login, signup, logout,
 *     updateAccount, changePassword, deleteAccount, logoutEverywhere,
 *     requestPasswordReset, verifyResetCode, resetPassword }
 *
 * Mutating actions return `{ ok, error }` so callers can show precise messages.
 */
export function AuthProvider({ children }) {
  // Restore synchronously on first render (honouring expiry/deletion) so there
  // is never a logged-out flash for a user with a valid session.
  const [user, setUser] = useState(() => authStore.restoreSession());
  const ready = true; // restore is synchronous; exposed for API stability.

  // Keep multiple tabs in sync: signing in/out (or deleting an account) in one
  // tab reflects in the others.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "mm-session" || e.key === "mm-users" || e.key === null) {
        setUser(authStore.restoreSession());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(({ email, password, remember = false }) => {
    const result = authStore.verifyCredentials(email, password);
    if (!result.ok) return result;
    authStore.createSession(result.user.email, remember);
    setUser(result.user);
    return { ok: true, user: result.user };
  }, []);

  const signup = useCallback(({ name, email, password, remember = true }) => {
    const result = authStore.registerUser({ name, email, password });
    if (!result.ok) return result;
    authStore.createSession(result.user.email, remember);
    setUser(result.user);
    return { ok: true, user: result.user };
  }, []);

  const logout = useCallback(() => {
    authStore.clearSession();
    setUser(null);
  }, []);

  const updateAccount = useCallback(
    (patch) => {
      if (!user) return { ok: false, error: "You're not signed in." };
      const result = authStore.updateUser(user.email, patch);
      if (result.ok) setUser(result.user);
      return result;
    },
    [user]
  );

  const changePassword = useCallback(
    (currentPassword, newPassword) => {
      if (!user) return { ok: false, error: "You're not signed in." };
      return authStore.changePassword(user.email, currentPassword, newPassword);
    },
    [user]
  );

  const deleteAccount = useCallback(
    (password) => {
      if (!user) return { ok: false, error: "You're not signed in." };
      // Require the correct password before destroying the account.
      const check = authStore.verifyCredentials(user.email, password);
      if (!check.ok) return { ok: false, error: "Incorrect password." };
      const result = authStore.deleteUser(user.email);
      if (result.ok) setUser(null);
      return result;
    },
    [user]
  );

  const logoutEverywhere = useCallback(() => {
    if (!user) return { ok: false, error: "You're not signed in." };
    const result = authStore.logoutEverywhere(user.email);
    if (result.ok) setUser(null);
    return result;
  }, [user]);

  // Forgot-password flow (OTP simulated). Returns the code so the UI can show it.
  const requestPasswordReset = useCallback(
    (email) => authStore.createResetCode(email),
    []
  );
  const verifyResetCode = useCallback(
    (email, code) => authStore.verifyResetCode(email, code),
    []
  );
  const resetPassword = useCallback(
    (email, code, newPassword) =>
      authStore.resetPasswordWithCode(email, code, newPassword),
    []
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      ready,
      login,
      signup,
      logout,
      updateAccount,
      changePassword,
      deleteAccount,
      logoutEverywhere,
      requestPasswordReset,
      verifyResetCode,
      resetPassword,
      emailExists: authStore.emailExists,
    }),
    [
      user,
      ready,
      login,
      signup,
      logout,
      updateAccount,
      changePassword,
      deleteAccount,
      logoutEverywhere,
      requestPasswordReset,
      verifyResetCode,
      resetPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
