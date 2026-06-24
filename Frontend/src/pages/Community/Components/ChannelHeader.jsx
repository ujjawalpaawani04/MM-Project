import { motion } from "framer-motion";
import { FiUsers, FiEye, FiVideo, FiExternalLink } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import CountUp from "./CountUp";

/** 1234567 -> "1.2M", 2790 -> "2.8K". */
const compact = (n) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

/* Glassmorphic analytics card with hover lift + red glow. */
function StatCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_24px_60px_-25px_rgba(255,0,51,0.6)]"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg">
          <Icon size={22} />
        </span>
        <div>
          <div className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
            <CountUp value={value} format={compact} />
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/50">
            {label}
          </div>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-red-600/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );
}

function HeaderSkeleton() {
  return (
    <section className="mb-10 animate-pulse space-y-6">
      <div className="h-44 w-full rounded-3xl border border-white/10 bg-white/[0.04] sm:h-40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-white/10 bg-white/[0.04]"
          />
        ))}
      </div>
    </section>
  );
}

/**
 * YouTube dashboard header: a channel banner (avatar + name + description +
 * subscribe) above a row of analytics stat cards. Channel data is fetched once
 * at the page level and passed in; gracefully falls back to brand defaults if
 * the API is unavailable (no fabricated numbers).
 */
export default function ChannelHeader({ channel, loading, href }) {
  if (loading) return <HeaderSkeleton />;

  const name = channel?.title || "MohanMaya";
  const description =
    channel?.description ||
    "Handcrafted devotional miniatures — devotional shorts, stories and behind-the-scenes moments from our workshop.";
  const thumb = channel?.thumbnail;
  const subscribeUrl = href || channel?.url || "#";

  return (
    <section className="mb-10 space-y-6">
      {/* Channel banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10"
      >
        <img
          src="/website/images/heroBg.webp"
          alt=""
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />

        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          {thumb ? (
            <img
              src={thumb}
              alt={name}
              loading="lazy"
              className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-red-600/60 sm:h-24 sm:w-24"
            />
          ) : (
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-red-600 to-red-500 text-3xl text-white ring-4 ring-red-600/40 sm:h-24 sm:w-24">
              <FaYoutube />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-red-300 ring-1 ring-inset ring-red-500/30">
              <FaYoutube size={12} /> YouTube Channel
            </span>
            <h2 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
              {name}
            </h2>
            <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/60">
              {description}
            </p>
          </div>

          <a
            href={subscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <FaYoutube size={16} /> Subscribe
            <FiExternalLink size={14} />
          </a>
        </div>
      </motion.div>

      {/* Analytics cards */}
      {channel && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FiUsers} label="Subscribers" value={channel.subscriberCount} delay={0} />
          <StatCard icon={FiEye} label="Total Views" value={channel.viewCount} delay={0.08} />
          <StatCard icon={FiVideo} label="Total Videos" value={channel.videoCount} delay={0.16} />
        </div>
      )}
    </section>
  );
}
