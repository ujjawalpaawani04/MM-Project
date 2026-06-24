import { FiAlertCircle, FiSearch } from "react-icons/fi";

/** Graceful "order not found" state for an unrecognised tracking number. */
export default function NotFound({ query }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-8 sm:p-12 text-center">
      <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-500">
        <FiAlertCircle size={32} />
      </span>
      <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
        We couldn't find that order
      </h3>
      <p className="mt-2 max-w-md mx-auto text-gray-600 dark:text-gray-300">
        {query ? (
          <>
            No order matches{" "}
            <span className="font-semibold text-gray-900 dark:text-white break-words">
              {query}
            </span>
            . Double-check the tracking number from your confirmation email - it
            looks like <span className="font-medium">MM-2026-000123</span>.
          </>
        ) : (
          "Please enter a valid tracking number to continue."
        )}
      </p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400">
        <FiSearch size={14} /> Tip: orders placed at checkout on this device are
        searchable instantly.
      </div>
    </div>
  );
}
