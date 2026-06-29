import { motion } from "framer-motion";
import {
  Hand,
  Sparkles,
  Gem,
  Wand2,
  PackageCheck,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Eyebrow, fadeUp, Glow } from "./kit";

const reasons = [
  { Icon: Hand, text: "Handcrafted by skilled artisans" },
  { Icon: Sparkles, text: "Inspired by Indian culture and Krishna's stories" },
  { Icon: Gem, text: "Premium-quality materials" },
  { Icon: Wand2, text: "Unique designs with exceptional detailing" },
  { Icon: PackageCheck, text: "Thoughtfully packed for safe delivery" },
  { Icon: InfinityIcon, text: "Created to become lifelong keepsakes" },
];

/** "Why People Choose Mohan Maya" — checklist reasons as compact glass cards. */
export default function WhyChoose() {
  return (
    <section className="relative overflow-hidden border-y border-gray-100 bg-cream-100 py-16 dark:border-slate-800 dark:bg-slate-900 lg:py-24">
      <Glow className="left-1/2 top-0 h-72 w-72 -translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Eyebrow>The Mohan Maya Promise</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Why People Choose{" "}
            <span className="text-brand-500">Mohan Maya</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            Six reasons collectors trust us with the stories they cherish most.
          </p>
        </motion.div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ Icon, text }, i) => (
            <motion.li
              key={text}
              {...fadeUp}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.08,
              }}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200/70 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-brand-500/30"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-md shadow-brand-500/20 transition-transform duration-300 group-hover:scale-105">
                <Icon size={20} />
              </span>
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {text}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
