import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

const items = [
  {
    Icon: Target,
    title: "Our Mission",
    text: "To craft soulful, hand-painted miniatures that let anyone hold a piece of the Mohan-Maya story - made with devotion and built to last generations.",
  },
  {
    Icon: Eye,
    title: "Our Vision",
    text: "To become the most loved home for spiritual collectible art, celebrating culture, craftsmanship, and the timeless tales that inspire us.",
  },
];

/** "Our Purpose" - mission & vision cards. */
export default function MissionVision() {
  return (
    <section className="bg-cream dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold">
            Our Purpose
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
            Our Mission &amp; Vision
          </h2>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {items.map(({ Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-5">
                <span className="shrink-0 grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
                  <Icon size={24} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed">
                    {text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
