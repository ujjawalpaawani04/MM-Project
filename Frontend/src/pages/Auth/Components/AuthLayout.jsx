import { Link } from "react-router";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../../../assets/website/mm-logo.png";
import Seo from "../../../components/common/Seo";

const perks = [
  "Handcrafted, hand-painted collectibles",
  "Interactive 3D previews before you buy",
  "Exclusive drops & member-only offers",
];

/**
 * Shared premium layout for the auth pages (Login / Signup / Forgot Password).
 * Split screen: a brand-gradient story panel (desktop) + the form card.
 * Mirrors the site's hero language (gradient, blurred blobs, dot grid, accent
 * pink) so the auth flow feels native to the rest of Mohan Maya.
 */
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <Seo title={title} noindex />
      {/* Decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 xl:pt-44 pb-16 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
        {/* Brand story panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <img
              src={logo}
              alt="Mohan Maya logo"
              className="w-12 h-12 object-contain rounded-full"
            />
            <span className="font-bold text-2xl text-gray-900 dark:text-white">
              Mohan<span className="text-brand-500">Maya</span>
            </span>
          </Link>
          <h2 className="mt-8 text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Where devotion meets{" "}
            <span className="text-[#e34786]">craftsmanship</span>.
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-md leading-relaxed">
            Join a community of collectors who treasure handcrafted miniatures
            inspired by timeless stories.
          </p>
          <ul className="mt-8 space-y-4">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
              >
                <span className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs shrink-0">
                  ✦
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] border border-gray-100 dark:border-slate-700 p-7 sm:p-9"
        >
          {/* Mobile logo */}
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2 mb-6"
          >
            <img
              src={logo}
              alt="Mohan Maya logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Mohan<span className="text-brand-500">Maya</span>
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}

          <div className="mt-7">{children}</div>

          {footer && (
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {footer}
            </div>
          )}

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-brand-500 transition-colors"
          >
            <FiArrowLeft size={14} /> Back to home
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
