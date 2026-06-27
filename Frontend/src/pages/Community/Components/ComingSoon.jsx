import { motion } from "framer-motion";
import { FiExternalLink, FiClock } from "react-icons/fi";
import { cn } from "../../../utils/cn";

/**
 * Honest, platform-themed "Coming Soon" state for tabs whose API isn't wired up
 * yet (Instagram, Facebook). No fabricated content - just the platform's visual
 * identity, a clear status message, and a link out to the real profile.
 */
export default function ComingSoon({ theme, href }) {
  const Icon = theme.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={cn(
        "relative overflow-hidden rounded-3xl px-6 py-20 text-center sm:py-24",
        theme.surface,
        theme.glow
      )}
    >
      {/* Soft platform-tinted glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: `${theme.accent}33` }}
      />

      <div className="relative">
        <motion.span
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            "mx-auto inline-grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br text-4xl text-white shadow-lg",
            theme.gradient
          )}
        >
          <Icon />
        </motion.span>

        <span
          className={cn(
            "mt-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
            theme.chip
          )}
        >
          <FiClock size={12} /> Under development
        </span>

        <h3 className={cn("mt-4 text-2xl font-bold sm:text-3xl", theme.heading)}>
          {theme.name} integration is coming soon
        </h3>
        <p className={cn("mx-auto mt-3 max-w-md leading-relaxed", theme.textMuted)}>
          {theme.name} integration is currently under development. Content will be
          available here soon - in the meantime, follow us to stay in the loop.
        </p>

        <div className="mt-8 flex justify-center">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95",
              theme.gradient,
              theme.gradientHover
            )}
          >
            <Icon size={16} />
            Follow on {theme.name}
            <FiExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
