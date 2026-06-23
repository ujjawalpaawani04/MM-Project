import { motion } from "framer-motion";
import { fadeUp } from "../../utils/motion";
import { cn } from "../../utils/cn";

/**
 * Centered section intro block: optional uppercase eyebrow, heading and a
 * supporting paragraph. Keeps the eyebrow/title/subtitle rhythm consistent
 * across content pages (Shipping, Terms, Privacy, …). Theme-aware.
 */
export default function SectionIntro({
  eyebrow,
  title,
  description,
  className = "",
}) {
  return (
    <motion.div
      {...fadeUp}
      className={cn("max-w-2xl mx-auto text-center mb-12", className)}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-500">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2
          className={cn(
            "text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white",
            eyebrow && "mt-2"
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-3 text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </motion.div>
  );
}
