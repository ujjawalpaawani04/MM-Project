import { motion } from "framer-motion";
import {
  FiYoutube,
  FiAlertTriangle,
  FiRefreshCw,
  FiChevronDown,
} from "react-icons/fi";
import EmptyState from "../../../components/common/EmptyState";
import VideoCard from "./VideoCard";
import VideoCardSkeleton from "./VideoCardSkeleton";

const SKELETON_COUNT = 9;

function ErrorPanel({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 px-4 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-500 dark:bg-red-900/40">
        <FiAlertTriangle size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Couldn’t load videos
      </h3>
      <p className="mx-auto mt-2 max-w-md text-gray-600 dark:text-gray-300">
        {error}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
      >
        <FiRefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}

/**
 * The YouTube tab's content: a responsive grid of latest uploads with loading
 * skeletons, error + empty states, and a Load More control. Purely
 * presentational - the page owns the data so switching tabs never re-fetches.
 */
export default function YouTubeGrid({
  videos,
  status,
  error,
  isLoadingMore,
  hasMore,
  loadMore,
  retry,
  onPlay,
}) {
  if (status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <ErrorPanel error={error} onRetry={retry} />;
  }

  if (status === "success" && videos.length === 0) {
    return (
      <EmptyState
        icon={FiYoutube}
        title="No videos yet"
        description="New videos from our channel will appear here. Subscribe so you never miss one!"
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <VideoCard
            key={video.videoId}
            video={video}
            index={i}
            onPlay={onPlay}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <motion.button
            type="button"
            onClick={loadMore}
            disabled={isLoadingMore}
            whileTap={{ scale: 0.96 }}
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-brand-400/60 bg-white/70 px-7 py-3 text-sm font-semibold text-brand-500 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-800/70 dark:text-brand-300"
          >
            {isLoadingMore ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Loading…
              </>
            ) : (
              <>
                Load more videos
                <FiChevronDown
                  className="transition-transform group-hover:translate-y-0.5"
                  size={18}
                />
              </>
            )}
          </motion.button>
        </div>
      )}
    </>
  );
}
