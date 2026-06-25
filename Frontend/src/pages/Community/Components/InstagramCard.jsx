import { useState } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiMessageCircle, FiPlay, FiInstagram } from "react-icons/fi";

/** 1234 -> "1.2K". */
const compact = (n) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

/**
 * A single Instagram post/reel tile: square media with a gradient hover overlay
 * revealing like + comment counts, a reel badge for videos, and a tasteful
 * fallback when a thumbnail fails to load (Instagram CDN URLs can expire).
 * The whole tile links out to the post on Instagram.
 */
export default function InstagramCard({ post, index = 0 }) {
  const { thumbnail, caption, likes, comments, views, isVideo, permalink } =
    post;
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.a
      href={permalink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.05 }}
      className="group relative block aspect-square overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br from-amber-100 via-pink-100 to-purple-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-20px_rgba(214,41,118,0.55)]"
    >
      {thumbnail && imgOk ? (
        <img
          src={thumbnail}
          alt={caption ? caption.slice(0, 80) : "Instagram post"}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgOk(false)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <span className="grid h-full w-full place-items-center text-5xl text-pink-500/70">
          <FiInstagram />
        </span>
      )}

      {/* Reel / video badge */}
      {isVideo && (
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
          <FiPlay size={14} className="ml-0.5" />
        </span>
      )}

      {/* Hover overlay with engagement stats */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex items-center gap-5 p-4 text-sm font-semibold text-white">
          <span className="inline-flex items-center gap-1.5">
            <FiHeart size={16} className="fill-current" />
            {compact(likes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FiMessageCircle size={16} />
            {compact(comments)}
          </span>
          {isVideo && views > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <FiPlay size={15} />
              {compact(views)}
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
}
