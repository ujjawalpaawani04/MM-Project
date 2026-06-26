import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "../../../utils/cn";

/**
 * Builds a windowed page list with ellipses around the active page:
 *   1 … 4 5 6 … 20
 * `siblings` controls how many pages flank the current one. Auto-generated
 * from the total page count, so it scales cleanly from 2 to hundreds of pages.
 */
function buildPageList(page, totalPages, siblings = 1) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - siblings && i <= page + siblings)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
}

/**
 * Professional, dynamic pagination — labelled Previous / Next controls plus a
 * windowed list of auto-generated page numbers that adapts to the total count.
 * Fully responsive: numbered buttons on >= sm, a compact "Page X of Y" pill on
 * mobile. Purely presentational and reusable — every navigation action is
 * delegated through props, so it carries no data-fetching concerns of its own.
 */
export default function Pagination({
  page,
  totalPages,
  partial = false,
  isLoadingMore = false,
  onPrev,
  onNext,
  onGo,
  className,
}) {
  if (totalPages <= 1 && !partial) return null;

  const pages = buildPageList(page, totalPages);
  const isFirst = page === 1;
  const isLast = page >= totalPages && !partial;

  const edgeBtn =
    "inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-red-300 hover:text-red-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:shadow-sm";

  return (
    <nav
      aria-label="Video pagination"
      className={cn(
        "mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-between",
        className
      )}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        className={cn(edgeBtn, "w-full justify-center sm:w-auto")}
      >
        <FiChevronLeft size={18} />
        <span>Previous</span>
      </button>

      {/* Numbered window (>= sm) */}
      <div className="hidden items-center gap-1.5 sm:flex">
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              className="grid h-10 w-10 select-none place-items-center text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onGo(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                "grid h-10 min-w-[2.5rem] place-items-center rounded-xl px-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40",
                p === page
                  ? "scale-105 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-600/30"
                  : "border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-red-300 hover:text-red-600 hover:shadow-md"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      {/* Compact indicator (mobile) */}
      <span className="inline-flex h-10 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 shadow-sm sm:hidden">
        Page <span className="mx-1 font-bold text-red-600">{page}</span> of{" "}
        {partial ? `${totalPages}+` : totalPages}
      </span>

      {/* Next */}
      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        className={cn(edgeBtn, "w-full justify-center sm:w-auto")}
      >
        {isLoadingMore && page >= totalPages ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <span>Next</span>
        )}
        <FiChevronRight size={18} />
      </button>
    </nav>
  );
}
