import { motion } from "framer-motion";
import { FiPlay, FiClock } from "react-icons/fi";
import { formatPublished, isRecent } from "./videoTime";

/**
 * Premium YouTube video card (light dashboard theme): 16:9 thumbnail with a
 * red play button, soft red glow on hover, a "New" badge for recent uploads,
 * and an in-page Watch action. Clicking the thumbnail or Watch opens the
 * privacy-friendly modal player.
 */
export default function VideoCard({ video, onPlay, index = 0 }) {
  const { title, thumbnail, publishedAt } = video;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_24px_60px_-20px_rgba(255,0,51,0.35)] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500/40"
    >
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
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {isRecent(publishedAt) && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            New
          </span>
        )}

        {/* <span className="absolute inset-0 grid place-items-center">
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-red-600 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
            <span className="absolute inset-0 -z-10 rounded-full bg-red-600/60 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <FiPlay className="ml-0.5" size={22} />
          </span>
        </span> */}
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 min-h-[2.625rem] text-[15px] font-semibold leading-snug text-gray-900 dark:text-white"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <FiClock size={13} />
            {formatPublished(publishedAt)}
          </span>
          <button
            type="button"
            onClick={() => onPlay(video)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-red-600 hover:text-white hover:ring-red-600 dark:bg-slate-700 dark:text-gray-200 dark:ring-slate-600 dark:hover:bg-red-600 dark:hover:text-white dark:hover:ring-red-600"
          >
            <FiPlay size={12} />
            Watch
          </button>
        </div>
      </div>
    </motion.article>
  );
}
