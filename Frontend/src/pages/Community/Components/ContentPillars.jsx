import { motion } from "framer-motion";
import { FiFilm, FiTool, FiGift, FiStar } from "react-icons/fi";

/* What the channel offers - static content pillars, easy to extend. */
const PILLARS = [
  {
    Icon: FiFilm,
    title: "Devotional Shorts",
    text: "Bite-sized stories and aartis that bring everyday devotion to life.",
  },
  {
    Icon: FiTool,
    title: "Workshop Diaries",
    text: "Go behind the brush and watch each miniature take shape by hand.",
  },
  {
    Icon: FiGift,
    title: "New-Drop Reveals",
    text: "Be first to see fresh collections before they reach the store.",
  },
  {
    Icon: FiStar,
    title: "Festival Specials",
    text: "Seasonal celebrations and limited editions crafted for the occasion.",
  },
];

/**
 * "What you'll find" - a clean four-up grid of content pillars that gives the
 * Community page editorial context beyond the raw video feed. Light surface,
 * red gradient icon chips and a soft hover lift to match the YouTube theme.
 */
export default function ContentPillars() {
  return (
    <section className="mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-red-600 ring-1 ring-inset ring-red-100 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900">
          On the channel
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
          What you&apos;ll find
        </h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          A closer look at the stories we share every week.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map(({ Icon, title, text }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.08 }}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_24px_60px_-25px_rgba(255,0,51,0.35)] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500/40"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-red-500 text-white shadow-md shadow-red-500/30 transition-transform duration-300 group-hover:scale-110">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
