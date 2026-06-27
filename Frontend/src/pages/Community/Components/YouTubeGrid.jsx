import { useEffect, useState } from "react";
import { FiYoutube, FiAlertTriangle, FiRefreshCw, FiGrid } from "react-icons/fi";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import FeaturedVideo from "./FeaturedVideo";
import Pagination from "./Pagination";

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
    <div className="rounded-3xl border border-red-200 bg-red-50/60 px-4 py-16 text-center dark:border-red-900 dark:bg-red-950/30">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/50 dark:text-red-400">
        <FiAlertTriangle size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Couldn&apos;t load videos</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">{error}</p>
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
    <div className="rounded-3xl border border-gray-200 bg-white px-4 py-16 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400">
        <FiYoutube size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No videos yet</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
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

/** A small heading that sits above the paginated grid. */
function GridHeading() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gray-900 text-white dark:bg-red-600">
        <FiGrid size={16} />
      </span>
      <div>
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">More videos</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Browse every upload from the channel.</p>
      </div>
    </div>
  );
}

/* ------------------------------- Grid ---------------------------------- */

/**
 * The YouTube tab: the latest upload is lifted into a <FeaturedVideo> spotlight,
 * and the remaining uploads fill a single uniform, paginated grid. Every page
 * renders the SAME structure — same columns, same gaps, same number of
 * equal-height cards — so paging only swaps the data, never the layout (no
 * shifting, no auto-scroll). Navigating past the last loaded page transparently
 * fetches the next page via the token cursor. Includes skeletons, error + empty
 * states. The VideoCard design and API integration are unchanged.
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

  // The newest upload becomes the featured spotlight; everything else paginates.
  const featured = videos[0] || null;
  const rest = videos.slice(1);

  const loadedPages = Math.max(1, Math.ceil(rest.length / PER_PAGE));

  // Auto-fetch forward until the CURRENT page is completely filled (or the feed
  // runs out). Triggering on "page not full" rather than "page not started" is
  // what keeps every page — including the first — at a consistent card count:
  // the featured video is lifted from the same feed, so page 1 needs one extra
  // upload fetched before its grid can show a full PER_PAGE. Only triggers a
  // fetch — it never sets state directly.
  useEffect(() => {
    if (rest.length < page * PER_PAGE && hasMore && !isLoadingMore) loadMore();
  }, [page, rest.length, hasMore, isLoadingMore, loadMore]);

  if (status === "loading") return <SkeletonGrid />;
  if (status === "error") return <ErrorPanel error={error} onRetry={retry} />;
  if (status === "success" && videos.length === 0) return <EmptyPanel />;

  // Accurate, stable page count when the API reports a total; otherwise fall
  // back to what's loaded and flag (via `partial`) that more may exist. The
  // featured video is excluded from the grid, hence `total - 1`.
  const knownTotal = total > 0;
  const restTotal = knownTotal ? Math.max(0, total - 1) : rest.length;
  const totalPages = knownTotal
    ? Math.max(1, Math.ceil(restTotal / PER_PAGE))
    : loadedPages;
  const partial = !knownTotal && hasMore;
  // Highest page the user may navigate to right now.
  const maxPage = knownTotal ? totalPages : hasMore ? loadedPages + 1 : loadedPages;

  const pageStart = (page - 1) * PER_PAGE;
  const pageVideos = rest.slice(pageStart, pageStart + PER_PAGE);

  // How many cards this page holds once fully loaded. With a known total the
  // final page may legitimately be short; otherwise assume a full page while
  // more can still load. Any not-yet-loaded slots for the current page render
  // as skeletons, so the grid always shows its full complement of tiles rather
  // than briefly showing fewer (e.g. 11) and popping the last card in after.
  const expectedCount = knownTotal
    ? Math.max(0, Math.min(PER_PAGE, restTotal - pageStart))
    : hasMore
    ? PER_PAGE
    : pageVideos.length;
  const fillSkeletons = Math.max(0, expectedCount - pageVideos.length);
  const hasGrid = pageVideos.length > 0 || fillSkeletons > 0;

  // Data-only navigation: update the page, never the scroll position or layout.
  const goTo = (p) => setPage(Math.min(maxPage, Math.max(1, p)));

  return (
    <>
      <FeaturedVideo video={featured} onPlay={onPlay} />

      {hasGrid && (
        <>
          <GridHeading />

          <div className={GRID_CLASS}>
            {pageVideos.map((video, i) => (
              <VideoCard key={video.videoId} video={video} index={i} onPlay={onPlay} />
            ))}
            {Array.from({ length: fillSkeletons }).map((_, i) => (
              <VideoCardSkeleton key={`fill-${i}`} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            partial={partial}
            isLoadingMore={isLoadingMore}
            onPrev={() => goTo(page - 1)}
            onNext={() => goTo(page + 1)}
            onGo={goTo}
          />
        </>
      )}
    </>
  );
}
