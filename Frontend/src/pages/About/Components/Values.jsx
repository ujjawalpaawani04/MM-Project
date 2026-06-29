import { motion } from "framer-motion";
import { Hammer, BadgeCheck, Lightbulb, Users } from "lucide-react";
import { Eyebrow, fadeUp } from "./kit";

const values = [
  {
    Icon: Hammer,
    title: "Craftsmanship",
    text: "Every detail matters. Excellence is built one brushstroke at a time.",
  },
  {
    Icon: BadgeCheck,
    title: "Authenticity",
    text: "We stay true to the stories, traditions, and emotions that inspire our work.",
  },
  {
    Icon: Lightbulb,
    title: "Creativity",
    text: "Every miniature begins as an idea and becomes a masterpiece through imagination and dedication.",
  },
  {
    Icon: Users,
    title: "Community",
    text: "More than a brand—a family of artists, collectors, and storytellers preserving beauty for future generations.",
  },
];

/** "Our Values" — four principle cards with a numbered, gallery-like rhythm. */
export default function Values() {
  return (
    <section className="relative overflow-hidden bg-cream py-16 dark:bg-ink-900 lg:py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div {...fadeUp} className="text-center">
          <Eyebrow>What We Stand For</Eyebrow>
          <h2 className="mt-5 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Our <span className="text-brand-500">Values</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
            The principles that guide every sketch, every cast, and every
            conversation within the Mohan Maya family.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, title, text }, i) => (
            <motion.article
              key={title}
              {...fadeUp}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.1,
              }}
              className="group relative flex flex-col rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-200/70 hover:shadow-[0_24px_50px_-18px_rgba(196,31,107,0.25)] dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-500/30"
            >
              {/* Faint index number, gallery-style */}
              <span
                aria-hidden="true"
                className="absolute right-5 top-4 text-4xl font-black leading-none text-brand-100 transition-colors duration-300 group-hover:text-brand-200 dark:text-slate-700 dark:group-hover:text-slate-600"
              >
                0{i + 1}
              </span>
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500 ring-1 ring-brand-100 transition-colors duration-300 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-400 group-hover:text-white group-hover:ring-transparent dark:bg-slate-700/60 dark:text-brand-300 dark:ring-slate-600">
                <Icon size={24} />
              </span>
              <h3 className="mt-6 text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
