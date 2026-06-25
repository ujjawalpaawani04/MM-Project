import { useEffect, useState } from "react";
import {
  FiYoutube,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { cn } from "../../../utils/cn";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";

// Videos per page. Matches the hook's pageSize so each fetched page maps to
// exactly one display page, and divides evenly into the 1/2/3/4-column
// breakpoints so every full page fills complete rows — the grid structure is
// identical on every page, so paging only swaps data, never the layout.
const PER_PAGE = 12;

/* Shared grid classes — used for cards AND skeletons so the column count, gaps
 * and alignment are byte-for-byte identical regardless of contents. */
const GRID_CLASS =
  "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/* ----------------------------- Sub-panels ------------------------------ */

function ErrorPanel({ error, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.06] px-4 py-16 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-500/15 text-red-400">
        <FiAlertTriangle size={30} />
      </div>
      <h3 className="text-xl font-semibold text-white">Couldn&apos;t load videos</h3>
      <p className="mx-auto mt-2 max-w-md text-white/60">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
      >
        <FiRefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

function EmptyPanel() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-16 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-white/5 text-red-500">
        <FiYoutube size={30} />
      </div>
      <h3 className="text-xl font-semibold text-white">No videos yet</h3>
      <p className="mx-auto mt-2 max-w-md text-white/60">
        New uploads will appear here. Subscribe so you never miss a story.
      </p>
    </div>
  );
}

/** A full page of skeletons in the exact same grid as the cards, so swapping
 *  loading → loaded (or page → page) never reflows the structure. */
function SkeletonGrid() {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: PER_PAGE }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Dark / red numbered pagination matching the YouTube tab theme. */
function VideoPagination({ page, totalPages, partial, isLoadingMore, onPrev, onNext, onGo }) {
  if (totalPages <= 1 && !partial) return null;

  // Windowed page list with ellipses: 1 … 4 5 6 … 12
  const pages = [];
  const w = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - w && i <= page + w)) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }

  const arrow =
    "grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-all hover:border-red-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Video pagination" className="mt-12 flex items-center justify-center gap-2">
      <button type="button" onClick={onPrev} disabled={page === 1} aria-label="Previous page" className={arrow}>
        <FiChevronLeft size={18} />
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="grid h-10 w-10 select-none place-items-center text-white/40">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onGo(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-xl text-sm font-semibold transition-all",
                p === page
                  ? "scale-105 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-600/30"
                  : "border border-white/15 bg-white/5 text-white/70 hover:border-red-500/50 hover:text-white"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>

      <span className="inline-flex h-10 items-center rounded-xl border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/70 sm:hidden">
        Page <span className="mx-1 font-bold text-red-400">{page}</span> of{" "}
        {partial ? `${totalPages}+` : totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages && !partial}
        aria-label="Next page"
        className={arrow}
      >
        {isLoadingMore && page >= totalPages ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <FiChevronRight size={18} />
        )}
      </button>
    </nav>
  );
}

/* ------------------------------- Grid ---------------------------------- */

/**
 * The YouTube tab: a single uniform, paginated grid of recent uploads. Every
 * page renders the SAME structure — same columns, same gaps, same number of
 * equal-height cards — so paging only swaps the data, never the layout (no
 * shifting, no auto-scroll, nothing slides under the header). Navigating past
 * the last loaded page transparently fetches the next page via the token
 * cursor. Includes dark skeletons, error + empty states.
 */
export default function YouTubeGrid({
  videos,
  status,
  error,
  isLoadingMore,
  total,
  hasMore,
  loadMore,
  retry,
  onPlay,
}) {
  const [page, setPage] = useState(1);

  const loadedPages = Math.max(1, Math.ceil(videos.length / PER_PAGE));

  // Auto-fetch forward when the user navigates to a page that isn't loaded yet.
  // Runs one fetch per render until the requested page is available (or the
  // feed runs out). Only triggers a fetch — it never sets state directly.
  useEffect(() => {
    if (page > loadedPages && hasMore && !isLoadingMore) loadMore();
  }, [page, loadedPages, hasMore, isLoadingMore, loadMore]);

  if (status === "loading") return <SkeletonGrid />;
  if (status === "error") return <ErrorPanel error={error} onRetry={retry} />;
  if (status === "success" && videos.length === 0) return <EmptyPanel />;

  // Accurate, stable page count when the API reports a total; otherwise fall
  // back to what's loaded and flag (via `partial`) that more may exist.
  const knownTotal = total > 0;
  const totalPages = knownTotal
    ? Math.max(1, Math.ceil(total / PER_PAGE))
    : loadedPages;
  const partial = !knownTotal && hasMore;
  // Highest page the user may navigate to right now.
  const maxPage = knownTotal ? totalPages : hasMore ? loadedPages + 1 : loadedPages;

  const pageVideos = videos.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const showSkeletons =
    pageVideos.length === 0 && (isLoadingMore || page > loadedPages);

  // Data-only navigation: update the page, never the scroll position or layout.
  const goTo = (p) => setPage(Math.min(maxPage, Math.max(1, p)));

  return (
    <>
      <div className={GRID_CLASS}>
        {showSkeletons
          ? Array.from({ length: PER_PAGE }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : pageVideos.map((video, i) => (
              <VideoCard key={video.videoId} video={video} index={i} onPlay={onPlay} />
            ))}
      </div>

      <VideoPagination
        page={page}
        totalPages={totalPages}
        partial={partial}
        isLoadingMore={isLoadingMore}
        onPrev={() => goTo(page - 1)}
        onNext={() => goTo(page + 1)}
        onGo={goTo}
      />
    </>
  );
}
