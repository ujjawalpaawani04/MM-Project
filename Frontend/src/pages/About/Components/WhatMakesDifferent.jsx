import { motion } from "framer-motion";
import { HeartHandshake, Sparkles, Gem } from "lucide-react";
import { Eyebrow, fadeUp, dotPattern } from "./kit";

const points = [
  {
    Icon: HeartHandshake,
    title: "Handcrafted With Love",
    text: "Every miniature is carefully crafted by skilled artisans who pay attention to even the smallest details. No two pieces are exactly alike, making every creation unique.",
  },
  {
    Icon: Sparkles,
    title: "Inspired by Krishna's Divine World",
    text: "From Krishna's playful childhood to peaceful village life and timeless Indian traditions, our collections celebrate stories that continue to inspire millions.",
  },
  {
    Icon: Gem,
    title: "Designed to Last",
    text: "We believe beautiful art should become a part of your family's memories. That's why we focus on quality materials, fine craftsmanship, and timeless designs cherished for years.",
  },
];

/** "What Makes Mohan Maya Different" — three premium, lifted feature cards. */
export default function WhatMakesDifferent() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 dark:bg-ink-900 lg:py-24">
      {/* Subtle dotted texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-brand-300/40 dark:text-slate-700/50"
        style={dotPattern}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Eyebrow>What Sets Us Apart</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            What Makes Mohan Maya{" "}
            <span className="text-brand-500">Different</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            Three things shape every piece that leaves our atelier—care,
            inspiration, and a promise that it will last.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {points.map(({ Icon, title, text }, i) => (
            <motion.article
              key={title}
              {...fadeUp}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.12,
              }}
              className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200/70 hover:shadow-[0_24px_50px_-18px_rgba(196,31,107,0.28)] dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-brand-500/30"
            >
              {/* Gradient wash that blooms on hover */}
              <span
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-pink-500/15 to-rose-400/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
              />
              <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg shadow-brand-500/25 transition-transform duration-300 group-hover:scale-105">
                <Icon size={26} />
              </span>
              <h3 className="relative mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="relative mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                {text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
