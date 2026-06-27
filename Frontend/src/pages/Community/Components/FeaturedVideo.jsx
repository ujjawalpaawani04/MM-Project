import { motion } from "framer-motion";
import { FiPlay, FiClock, FiExternalLink } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { formatPublished, isRecent } from "./videoTime";

/**
 * "Featured Video" spotlight for the channel's latest upload — a large 16:9
 * player thumbnail paired with the title, meta and primary actions. It reuses
 * the exact same modal player as the grid (via `onPlay`) and leaves the
 * standard VideoCard used below it completely untouched.
 */
export default function FeaturedVideo({ video, onPlay }) {
  if (!video) return null;
  const { title, thumbnail, publishedAt, videoId } = video;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mb-14"
    >
      {/* Section label */}
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
          <FaYoutube size={13} /> Featured
        </span>
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
          Latest upload
        </h2>
      </div>

      <div className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_30px_80px_-40px_rgba(255,0,51,0.4)] transition-all duration-300 hover:border-red-200 lg:grid-cols-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500/40">
        {/* Thumbnail + play overlay */}
        <button
          type="button"
          onClick={() => onPlay(video)}
          aria-label={`Play "${title}"`}
          className="relative block aspect-video w-full overflow-hidden bg-gray-100 dark:bg-slate-900"
        >
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {isRecent(publishedAt) && (
            <span className="absolute left-4 top-4 rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-red-600 shadow">
              New
            </span>
          )}

          <span className="absolute inset-0 grid place-items-center">
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-red-600 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
              <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-red-600/40" />
              <FiPlay className="ml-1" size={26} />
            </span>
          </span>
        </button>

        {/* Content */}
        <div className="flex flex-col justify-center gap-5 p-6 sm:p-8 lg:p-10">
          <span className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <FiClock size={14} /> {formatPublished(publishedAt)}
          </span>

          <h3
            className="text-xl font-extrabold leading-snug text-gray-900 sm:text-2xl lg:text-3xl dark:text-white"
            title={title}
          >
            {title}
          </h3>

          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            Press play to watch our newest story unfold — handcrafted devotion,
            straight from the workshop to you.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => onPlay(video)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <FiPlay size={16} /> Watch now
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-red-300 hover:text-red-600 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-200 dark:hover:border-red-500/50 dark:hover:text-red-400"
            >
              YouTube <FiExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
