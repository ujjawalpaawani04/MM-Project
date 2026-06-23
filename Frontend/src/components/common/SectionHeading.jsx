import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

/**
 * Centered marketing section title used across the home page. Optionally renders
 * a "View all" pill aligned to the right edge while the title stays centered.
 */
export default function SectionHeading({
  title,
  highlight,
  subtitle,
  viewAllTo,
  viewAllLabel = "View all",
  className = "",
}) {
  return (
    <div className={`relative mb-10 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="inline-flex items-center justify-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2e2630] dark:text-white">
          <span>
            {title} {highlight && <span className="text-[#e34786]">{highlight}</span>}
          </span>
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-3xl mx-auto  dark:text-gray-400">
            {subtitle}
          </p>
        )}
      </motion.div>

      {viewAllTo && (
        <Link
          to={viewAllTo}
          className="group mt-4 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 mx-auto lg:mx-0 inline-flex items-center gap-2 rounded-full border border-[#e34786]/40 px-5 py-2 text-sm font-semibold text-[#e34786] hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-400 hover:text-white hover:border-transparent transition-colors duration-300 w-max"
        >
          {viewAllLabel}
          <FaArrowRight className="text-xs group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
}
