import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../utils/cn";

/**
 * Premium, responsive pagination control matching the brand pink theme.
 * Renders numbered pages with smart truncation (1 … 4 5 6 … 12) on wider
 * screens and a compact "Page X of Y" pill on small screens.
 *
 * Props:
 *   currentPage   number   1-based active page
 *   totalPages    number   total number of pages
 *   onPageChange  (n)=>void
 *   className     string
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  if (totalPages <= 1) return null;

  const go = (n) => {
    const next = Math.min(totalPages, Math.max(1, n));
    if (next !== currentPage) onPageChange(next);
  };

  // Build a windowed list of page numbers with ellipsis markers.
  const pages = [];
  const window = 1; // neighbours on each side of the current page
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - window && i <= currentPage + window)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const arrowBtn =
    "grid place-items-center h-10 w-10 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800 transition-all hover:border-brand-300 hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600";

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <button
        type="button"
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={arrowBtn}
      >
        <FiChevronLeft size={18} />
      </button>

      {/* Numbered pages - desktop / tablet */}
      <div className="hidden sm:flex items-center gap-2">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="grid place-items-center h-10 w-10 text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={cn(
                "grid place-items-center h-10 w-10 rounded-xl text-sm font-semibold transition-all",
                p === currentPage
                  ? "bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-md shadow-pink-500/25 scale-105"
                  : "border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-brand-300 hover:text-brand-500"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Compact pill - mobile */}
      <span className="sm:hidden px-4 h-10 inline-flex items-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-600 dark:text-gray-300">
        Page <span className="text-brand-500 font-bold mx-1">{currentPage}</span>{" "}
        of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={arrowBtn}
      >
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}
