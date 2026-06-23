import { motion } from "framer-motion";
import { FaLock, FaCertificate, FaUndo, FaGlobeAmericas, FaQuoteLeft, FaStar } from "react-icons/fa";

const badges = [
  { Icon: FaLock, title: "Secure Checkout", text: "Protected payments" },
  { Icon: FaCertificate, title: "Authentic & Handcrafted", text: "100% hand-painted" },
  { Icon: FaUndo, title: "7-Day Returns", text: "Hassle-free policy" },
  { Icon: FaGlobeAmericas, title: "12+ Countries", text: "Shipped worldwide" },
];

/** Customer trust badges + soft glassmorphism testimonial. */
export default function TrustSection() {
  return (
    <section className="relative isolate overflow-hidden bg-cream-100 dark:bg-slate-900 py-16 lg:py-24 border-y border-gray-100 dark:border-slate-800">
      <img
        src="/website/images/qualityBgImage.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-10 dark:opacity-[0.07]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Trust badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5"
            >
              <span className="shrink-0 grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
                <Icon size={20} />
              </span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial card */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative mt-10 mx-auto max-w-3xl rounded-3xl border border-white/40 dark:border-slate-700/60 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md shadow-xl p-8 sm:p-10 text-center"
        >
          <FaQuoteLeft className="mx-auto text-2xl text-brand-500/80" aria-hidden="true" />
          <div className="mt-4 flex items-center justify-center gap-1 text-brand-500" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={16} />
            ))}
          </div>
          <blockquote className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
            &ldquo;The detail is breathtaking. You can feel the devotion in every
            brushstroke - this isn&apos;t just a collectible, it&apos;s a piece of
            a story I get to keep.&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-sm font-semibold text-gray-900 dark:text-white">
            Ananya R.
            <span className="block font-normal text-gray-500 dark:text-gray-400">
              Verified Collector
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
