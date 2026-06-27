import { motion } from "framer-motion";
import {
  FiUsers,
  FiUserPlus,
  FiGrid,
  FiExternalLink,
  FiCheckCircle,
} from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import CountUp from "./CountUp";

/** 1234567 -> "1.2M", 2790 -> "2.8K". */
const compact = (n) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(n || 0));

/* Glassmorphic Instagram analytics card: gradient icon chip, animated count,
 * hover lift with a warm gradient glow. */
function StatCard({ icon: Icon, label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-300/70 hover:shadow-[0_24px_60px_-25px_rgba(214,41,118,0.5)] dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-pink-500/40"
    >
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white shadow-lg">
          <Icon size={22} />
        </span>
        <div className="min-w-0">
          <div className="bg-gradient-to-r from-amber-500 via-pink-600 to-purple-700 bg-clip-text text-2xl font-extrabold tabular-nums text-transparent sm:text-3xl">
            <CountUp value={value} format={compact} />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {label}
          </div>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-pink-500/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.div>
  );
}

export function InstagramHeaderSkeleton() {
  return (
    <section className="mb-10 animate-pulse space-y-6">
      <div className="h-52 w-full rounded-3xl border border-white/60 bg-white/60 sm:h-44 dark:border-slate-700 dark:bg-slate-800/60" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-white/60 bg-white/60 dark:border-slate-700 dark:bg-slate-800/60"
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Instagram profile dashboard header: a glassmorphic banner (gradient-ringed
 * avatar + username + bio + Follow button) above a row of analytics stat cards.
 * Profile data is fetched once at the page level and passed in; missing fields
 * fall back to brand defaults (no fabricated numbers — stat cards only render
 * when real profile data is present).
 */
export default function InstagramHeader({ profile, href }) {
  const username = profile?.username || "mohanmaya";
  const name = profile?.fullName || "MohanMaya";
  const bio =
    profile?.biography ||
    "Close-up reels of every hand-painted detail, new drops and daily moments from our workshop.";
  const pic = profile?.profilePic;
  const followUrl = href || profile?.url || "#";

  return (
    <section className="mb-10 space-y-6">
      {/* Glassmorphic profile banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_24px_70px_-40px_rgba(214,41,118,0.5)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/70"
      >
        {/* Soft gradient wash + ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-100/50 via-pink-100/40 to-purple-100/50" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-pink-400/30 to-purple-500/20 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:gap-6 sm:p-8 sm:text-left">
          {/* Gradient-ringed avatar (Instagram signature) */}
          <span className="shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-[3px] shadow-lg">
            <span className="block rounded-full bg-white p-[3px]">
              {pic ? (
                <img
                  src={pic}
                  alt={name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
                />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-3xl text-white sm:h-24 sm:w-24">
                  <FaInstagram />
                </span>
              )}
            </span>
          </span>

          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-pink-600 ring-1 ring-inset ring-pink-200 dark:bg-slate-700/80 dark:text-pink-300 dark:ring-pink-900">
              <FaInstagram size={12} /> Instagram
            </span>
            <h2 className="mt-2 flex items-center justify-center gap-1.5 text-2xl font-extrabold text-gray-900 sm:justify-start sm:text-3xl dark:text-white">
              {name}
              {profile?.isVerified && (
                <FiCheckCircle
                  className="text-sky-500"
                  size={20}
                  aria-label="Verified"
                />
              )}
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-pink-600 dark:text-pink-300">
              @{username}
            </p>
            <p className="mx-auto mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mx-0 dark:text-gray-300">
              {bio}
            </p>
          </div>

          <a
            href={followUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-center rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 active:scale-95 sm:self-start"
          >
            <FaInstagram size={16} /> Follow
            <FiExternalLink size={14} />
          </a>
        </div>
      </motion.div>

      {/* Analytics cards — only when real profile data is present */}
      {profile && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={FiUsers} label="Followers" value={profile.followers} delay={0} />
          <StatCard icon={FiUserPlus} label="Following" value={profile.following} delay={0.08} />
          <StatCard icon={FiGrid} label="Posts & Reels" value={profile.posts} delay={0.16} />
        </div>
      )}
    </section>
  );
}
