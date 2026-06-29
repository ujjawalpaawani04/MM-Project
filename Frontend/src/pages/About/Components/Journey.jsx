import { motion } from "framer-motion";
import { Sprout, Sparkles, HeartHandshake } from "lucide-react";
import { Eyebrow, fadeUp, Glow } from "./kit";
import img from "/website/images/mohanMaya2.png";

// The journey, distilled into three movements — narrative copy preserved.
const chapters = [
  {
    Icon: Sprout,
    title: "A Simple Dream",
    text: "Mohan Maya was born from a simple dream—to preserve India's rich culture and spiritual heritage through miniature art.",
  },
  {
    Icon: HeartHandshake,
    title: "A Deeper Connection",
    text: "We wanted to create something people could not only admire but feel connected to—something that reminds families of the stories they grew up hearing, the festivals they celebrated together, and the values they wish to pass on.",
  },
  {
    Icon: Sparkles,
    title: "Brought to Life",
    text: "With patience, creativity, and dedication, that dream slowly transformed into every handcrafted piece you see today.",
  },
];

/** "Our Journey" — image left, milestone list right (alternates vs. Story). */
export default function Journey() {
  return (
    <section className="relative overflow-hidden border-y border-gray-100 bg-cream-100 py-16 dark:border-slate-800 dark:bg-slate-900 lg:py-24">
      <Glow className="-right-24 bottom-0 h-80 w-80" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* Image — first on desktop to alternate against the Story section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative order-first"
        >
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-rose-100 to-brand-100 dark:from-slate-800 dark:to-slate-700" />
          <img
            src={img}
            alt="Mohan Maya artisan miniature, finely hand-painted"
            loading="lazy"
            decoding="async"
            className="h-[100%] w-full rounded-[1.75rem] object-cover"
          />
        </motion.div>

        {/* Narrative */}
        <div>
          <motion.div {...fadeUp}>
            <Eyebrow>Our Journey</Eyebrow>
            <h2 className="mt-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              From a Dream to <span className="text-brand-500">Every Piece</span>
            </h2>
          </motion.div>

          <ol className="mt-9 space-y-6">
            {chapters.map(({ Icon, title, text }, i) => (
              <motion.li
                key={title}
                {...fadeUp}
                transition={{
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.12,
                }}
                className="group flex gap-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-6"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon size={22} />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-300">
                    {text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
