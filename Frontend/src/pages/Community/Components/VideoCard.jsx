import { motion } from "framer-motion";
import { FiPlay, FiClock } from "react-icons/fi";
import Button from "../../../components/common/Button";
import { FiExternalLink } from "react-icons/fi";

/** Human-friendly "x days ago" with a sensible absolute fallback. */
function formatPublished(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const day = 86_400_000;
  const days = Math.floor(diff / day);

  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Premium YouTube video card: 16:9 thumbnail with a glassmorphic play overlay,
 * soft shadow, hover lift, and a brand-gradient Watch button. Clicking the
 * thumbnail or the button opens the in-page modal player.
 */
export default function VideoCard({ video, onPlay, index = 0 }) {
  const { title, thumbnail, publishedAt } = video;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/10 hover:ring-brand-200/70 dark:hover:ring-brand-500/30"
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
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Darkening gradient for legibility on hover */}
        <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
        {/* Glassmorphic play button */}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-white/40 bg-white/15 text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-500/90 group-hover:border-transparent">
            <FiPlay className="ml-1" size={26} />
          </span>
        </span>
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          className="line-clamp-2 text-[15px] font-semibold leading-snug text-gray-900 dark:text-white"
          title={title}
        >
          {title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            <FiClock size={13} />
            {formatPublished(publishedAt)}
          </span>
            <Button
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="sm"
              icon={FiExternalLink}
              iconRight
            >
              Watch on YouTube
            </Button>
        </div>
      </div>
    </motion.article>
  );
}
