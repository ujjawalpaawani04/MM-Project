import { motion } from "framer-motion";
import { FiPlay, FiClock } from "react-icons/fi";
import { formatPublished, isRecent } from "./videoTime";

/**
 * Premium YouTube video card (dark studio theme): 16:9 thumbnail with a
 * red play button, pulsing glow on hover, a "New" badge for recent uploads,
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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/40 hover:shadow-[0_24px_60px_-20px_rgba(255,0,51,0.55)]"
    >
      {/* Thumbnail + play overlay */}
      <button
        type="button"
        onClick={() => onPlay(video)}
        aria-label={`Play "${title}"`}
        className="relative block aspect-video w-full overflow-hidden"
      >
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {isRecent(publishedAt) && (
          <span className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
            New
          </span>
        )}

        <span className="absolute inset-0 grid place-items-center">
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-red-600/90 text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
            <span className="absolute inset-0 -z-10 rounded-full bg-red-600/60 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <FiPlay className="ml-0.5" size={22} />
          </span>
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 text-[15px] font-semibold leading-snug text-white"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/50">
            <FiClock size={13} />
            {formatPublished(publishedAt)}
          </span>
          <button
            type="button"
            onClick={() => onPlay(video)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/15 transition-all duration-200 hover:bg-red-600 hover:ring-red-600"
          >
            <FiPlay size={12} />
            Watch
          </button>
        </div>
      </div>
    </motion.article>
  );
}
