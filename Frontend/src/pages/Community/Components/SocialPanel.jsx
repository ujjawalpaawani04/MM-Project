import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import Button from "../../../components/common/Button";

const toneMap = {
  instagram: "bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600",
  facebook: "bg-[#1877F2]",
};

/**
 * Elegant placeholder panel for the Instagram / Facebook tabs. Matches the
 * YouTube tab's premium feel so the page never looks half-finished — swap the
 * inner block for a real embed once the platform's Graph API token is wired up.
 */
export default function SocialPanel({
  icon: Icon,
  network,
  description,
  href,
  accent,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/60 px-6 py-16 text-center shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/50 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20"
      />

      <div className="relative">
        <span
          className={`inline-grid h-20 w-20 place-items-center rounded-2xl text-3xl text-white shadow-lg ${
            toneMap[accent] || "bg-brand-500"
          }`}
        >
          <Icon />
        </span>

        <h3 className="mt-7 text-2xl font-bold text-gray-900 dark:text-white">
          {network} feed coming soon
        </h3>
        <p className="mx-auto mt-3 max-w-md text-gray-600 dark:text-gray-300">
          {description}
        </p>

        <div className="mt-8 flex justify-center">
          <Button
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            icon={FiExternalLink}
            iconRight
          >
            Follow us on {network}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
