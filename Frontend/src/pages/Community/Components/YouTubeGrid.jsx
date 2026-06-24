import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FiYoutube,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiClock,
} from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { cn } from "../../../utils/cn";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";
import { formatPublished } from "./videoTime";

const SKELETON_COUNT = 8;
// Videos shown per page. Matches the hook's pageSize so each fetched page maps
// cleanly to one display page (no leftover/partial pages from a size mismatch).
const PER_PAGE = 12;

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

/** Large hero card for the latest upload — the "YouTube Studio" focal point. */
function FeaturedVideo({ video, onPlay }) {
  if (!video) return null;
  const { title, thumbnail, publishedAt } = video;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative mb-6 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-red-500/40 lg:grid-cols-2"
    >
      <button
        type="button"
        onClick={() => onPlay(video)}
        aria-label={`Play "${title}"`}
        className="relative block aspect-video w-full overflow-hidden lg:aspect-auto lg:h-full"
      >
        <img
          src={thumbnail}
          alt={title}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r" />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-red-600/90 text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <FiPlay className="ml-1" size={32} />
          </span>
        </span>
      </button>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-300 ring-1 ring-inset ring-red-500/30">
          <FaYoutube size={14} /> Latest upload
        </span>
        <h3 className="line-clamp-3 text-xl font-bold leading-tight text-white sm:text-2xl">
          {title}
        </h3>
        <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
          <FiClock size={14} />
          {formatPublished(publishedAt)}
        </span>
        <div className="pt-1">
          <button
            type="button"
            onClick={() => onPlay(video)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
          >
            <FiPlay size={16} />
            Watch now
          </button>
        </div>
      </div>
    </motion.article>
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
 * The YouTube tab: a featured latest upload above a *paginated* grid of recent
 * videos. Pages are carved from the progressively-loaded feed; navigating past
 * the last loaded page transparently fetches the next page via the token
 * cursor. Includes dark loading skeletons, error + empty states.
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
  const gridRef = useRef(null);

  const loadedPages = Math.max(1, Math.ceil(videos.length / PER_PAGE));

  // Auto-fetch forward when the user navigates to a page that isn't loaded yet.
  // Runs one fetch per render until the requested page is available (or the
  // feed runs out). Only triggers a fetch — it never sets state directly.
  useEffect(() => {
    if (page > loadedPages && hasMore && !isLoadingMore) loadMore();
  }, [page, loadedPages, hasMore, isLoadingMore, loadMore]);

  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

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
  const isFirstPage = page === 1;
  // The latest upload headlines page 1 as a featured hero; the rest form the grid.
  const featured = isFirstPage ? pageVideos[0] : null;
  const gridItems = isFirstPage ? pageVideos.slice(1) : pageVideos;
  const showSkeletons =
    pageVideos.length === 0 && (isLoadingMore || page > loadedPages);

  const scrollToGrid = () =>
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const goTo = (p) => {
    const target = Math.min(maxPage, Math.max(1, p));
    if (target !== page) {
      setPage(target);
      scrollToGrid();
    }
  };

  return (
    <>
      {featured && <FeaturedVideo video={featured} onPlay={onPlay} />}

      <div
        ref={gridRef}
        className="grid scroll-mt-28 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {showSkeletons
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          : gridItems.map((video, i) => (
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
