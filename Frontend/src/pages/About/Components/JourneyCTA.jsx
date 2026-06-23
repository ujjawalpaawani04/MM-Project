import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";

/** Closing call-to-action banner. */
export default function JourneyCTA() {
  return (
    <section className="bg-cream-100 dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden rounded-3xl bg-ink-900 px-6 py-16 sm:px-12 lg:px-16"
        >
          <img
            src="/website/images/heroBg.webp"
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/40" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold">
              Start Collecting
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Begin Your Collection
            </h2>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Discover handcrafted miniatures made with care and devotion - bring
              a piece of the Mohan-Maya story home.
            </p>
            <Link
              to="/shop"
              className="mt-7 group px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold inline-flex items-center gap-3 shadow-xl shadow-pink-500/20 hover:opacity-95 duration-200"
            >
              Shop Now
              <FaArrowRight className="group-hover:translate-x-1 duration-300" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
