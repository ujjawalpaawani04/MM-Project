import { motion } from "framer-motion";
import { FiBell, FiExternalLink } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";

/**
 * Bold full-width subscribe call-to-action that closes out the YouTube tab.
 * Uses the darker half of the YouTube palette (black / gray with red glows) so
 * it stands out against the white page while staying on-brand.
 */
export default function SubscribeBanner({ href = "#" }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16"
    >
      {/* Ambient red glows */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-red-600/30 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-red-500/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40">
          <FiBell size={26} />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-white sm:text-4xl">
          Never miss a story
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
          Subscribe and hit the bell — new devotional shorts, workshop diaries
          and drops land on the channel every week.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-red-600/40 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          <FaYoutube size={18} /> Subscribe on YouTube <FiExternalLink size={14} />
        </a>
      </div>
    </motion.section>
  );
}
