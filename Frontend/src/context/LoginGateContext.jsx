/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import LoginModal from "../components/website/LoginModal";

/**
 * Gates an action behind authentication. Components call
 * `requireAuth(() => addItem(product))`:
 *  - if the user is already signed in, the action runs immediately;
 *  - otherwise the professional login modal opens and the action is held until
 *    the user successfully logs in / registers, then runs automatically.
 *
 * Dismissing the modal (X, backdrop, Escape, or "Continue as Guest") cancels
 * the pending action - guests never have anything added to their cart. There is
 * no toast or notification at any point in this flow.
 */
const LoginGateContext = createContext(null);

export function LoginGateProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const pendingAction = useRef(null);

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action?.();
        return;
      }
      pendingAction.current = action || null;
      setOpen(true);
    },
    [isAuthenticated]
  );

  // Dismissed without authenticating -> drop the pending action.
  const handleClose = useCallback(() => {
    pendingAction.current = null;
    setOpen(false);
  }, []);

  // Login/register succeeded -> close and run whatever was pending.
  const handleAuthenticated = useCallback(() => {
    setOpen(false);
    const action = pendingAction.current;
    pendingAction.current = null;
    action?.();
  }, []);

  const value = useMemo(() => ({ requireAuth }), [requireAuth]);

  return (
    <LoginGateContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={open}
        onClose={handleClose}
        onAuthenticated={handleAuthenticated}
      />
    </LoginGateContext.Provider>
  );
}

export function useLoginGate() {
  const ctx = useContext(LoginGateContext);
  if (!ctx)
    throw new Error("useLoginGate must be used within a LoginGateProvider");
  return ctx;
}
