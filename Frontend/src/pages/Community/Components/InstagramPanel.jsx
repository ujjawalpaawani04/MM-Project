import { FiAlertTriangle, FiRefreshCw, FiInstagram, FiExternalLink } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import InstagramHeader, { InstagramHeaderSkeleton } from "./InstagramHeader";
import InstagramCard from "./InstagramCard";

/* Identical grid for tiles AND skeletons so loading → loaded never reflows. */
const GRID_CLASS =
  "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

function TileSkeleton() {
  return (
    <div className="aspect-square animate-pulse rounded-2xl border border-white/60 bg-white/60 dark:border-slate-700 dark:bg-slate-800/60" />
  );
}

function SkeletonGrid({ count = 8 }) {
  return (
    <div className={GRID_CLASS}>
      {Array.from({ length: count }).map((_, i) => (
        <TileSkeleton key={i} />
      ))}
    </div>
  );
}

function ErrorPanel({ error, onRetry, href }) {
  return (
    <div className="rounded-3xl border border-pink-200 bg-white/70 px-4 py-16 text-center backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/70">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-pink-100 text-pink-500 dark:bg-pink-950/40 dark:text-pink-300">
        <FiAlertTriangle size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
        Couldn&apos;t load Instagram
      </h3>
      <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">{error}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <FiRefreshCw size={16} /> Try again
        </button>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-600 transition-all hover:-translate-y-0.5 active:scale-95 dark:border-slate-600 dark:bg-slate-700 dark:text-pink-300 dark:hover:bg-slate-600"
        >
          <FaInstagram size={16} /> Open Instagram <FiExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

function EmptyPanel({ href }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/60 px-4 py-16 text-center backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/60">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white">
        <FiInstagram size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No posts yet</h3>
      <p className="mx-auto mt-2 max-w-md text-gray-500 dark:text-gray-400">
        New reels and posts will appear here. Follow us so you never miss a drop.
      </p>
      <div className="mt-6 flex justify-center">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <FaInstagram size={16} /> Follow on Instagram
        </a>
      </div>
    </div>
  );
}

/**
 * The Community Instagram tab. Shows a glassmorphic profile header with live
 * stat cards above a responsive media grid. Handles loading (skeletons), error
 * (retry + follow fallback) and empty states gracefully — the header always
 * renders branded fallback content so the tab is never blank.
 */
export default function InstagramPanel({ profile, posts, status, error, retry, href }) {
  if (status === "loading") {
    return (
      <>
        <InstagramHeaderSkeleton />
        <SkeletonGrid />
      </>
    );
  }

  return (
    <>
      <InstagramHeader profile={profile} href={href} />

      {status === "error" ? (
        <ErrorPanel error={error} onRetry={retry} href={href} />
      ) : posts.length === 0 ? (
        <EmptyPanel href={href} />
      ) : (
        <div className={GRID_CLASS}>
          {posts.map((post, i) => (
            <InstagramCard key={post.id || i} post={post} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
