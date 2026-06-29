import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Eyebrow, fadeUp, dotPattern } from "./kit";

/** "A Message From Our Heart" — an intimate, letter-style closing note. */
export default function BrandMessage() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 dark:bg-ink-900 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-brand-300/30 dark:text-slate-700/40"
        style={dotPattern}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Eyebrow>From Our Heart</Eyebrow>
        </motion.div>

        <motion.figure
          {...fadeUp}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 p-8 text-center shadow-xl shadow-brand-500/5 backdrop-blur-md dark:border-white/10 dark:bg-slate-800/70 sm:p-12 lg:p-16"
        >
          {/* Decorative quote mark */}
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
            <Quote size={24} />
          </span>

          <blockquote className="mt-7 space-y-5 text-lg leading-relaxed text-gray-700 dark:text-gray-200 sm:text-xl">
            <p>
              Thank you for becoming part of the{" "}
              <span className="font-semibold text-brand-500">
                Mohan Maya family
              </span>
              . Every order supports handcrafted artistry, celebrates
              India&apos;s cultural heritage, and encourages us to keep creating
              stories that inspire.
            </p>
            <p>
              Whether you&apos;re gifting a loved one or adding a meaningful
              piece to your own home, we hope every miniature brings peace,
              happiness, and a little bit of magic into your life.
            </p>
          </blockquote>

          {/* Signature line — the emotional payoff */}
          <figcaption className="mt-9 border-t border-gray-200/70 pt-7 dark:border-slate-700">
            <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
              We don&apos;t just create miniatures.
            </p>
            <p className="mt-1 bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              We create stories that live forever.
            </p>
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
              — The Mohan Maya Family
            </p>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
