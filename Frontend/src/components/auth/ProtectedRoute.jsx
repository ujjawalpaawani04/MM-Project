import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

/**
 * Route guard for the authenticated account section. Unauthenticated visitors
 * are redirected to /login with the attempted path remembered in
 * location.state.from, so they land back where they wanted after signing in.
 *
 *   { path: "settings", element: <ProtectedRoute>{withSuspense(Settings)}</ProtectedRoute> }
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  // Session restore is synchronous, but guard against a not-ready flash anyway.
  if (!ready) return null;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
}
