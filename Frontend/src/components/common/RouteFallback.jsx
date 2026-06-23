import { Link, useRouteError } from "react-router";

/**
 * Dual-purpose: a lightweight loading spinner for Suspense fallbacks, and an
 * error screen when used as a router `errorElement` (pass `error`).
 */
export default function RouteFallback({ error = false }) {
  if (error) {
    return <RouteError />;
  }
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="h-10 w-10 rounded-full border-4 border-brand-200 border-t-brand-500 animate-spin"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

function RouteError() {
  const err = useRouteError();
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Something went wrong
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
        {err?.statusText || err?.message || "An unexpected error occurred."}
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
