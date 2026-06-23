import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";

const milestones = [
  {
    year: "2021",
    title: "Where It All Began",
    text: "Mohan Maya was founded with a single hand-sculpted figure of Maya and a wish to hold a story in your hands.",
  },
  {
    year: "2022",
    title: "The First Collection",
    text: "We expanded the spiritual story into a curated set - Mohan, Radha Ji and Krishna joined the family of miniatures.",
  },
  {
    year: "2023",
    title: "Artisan Atelier",
    text: "A dedicated studio of master artisans came together, treating every cast and brushstroke as an act of reverence.",
  },
  {
    year: "2024",
    title: "Crossing Borders",
    text: "Our handcrafted collectibles began shipping worldwide, reaching homes and altars across 12+ countries.",
  },
  {
    year: "2025",
    title: "5K+ Collectors",
    text: "A growing community of collectors embraced our 50+ designs, each carrying a chapter of the Mohan-Maya journey.",
  },
  {
    year: "2026",
    title: "A Premium Future",
    text: "Today we continue to refine our craft - 100% hand-painted, soulful, and built to last generations.",
  },
];

/** Vertical brand journey timeline with alternating milestones. */
export default function Timeline() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900 py-16 lg:py-24 border-y border-gray-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Our"
          highlight="Journey"
          subtitle="From a single figure to a worldwide collection - the milestones that shaped Mohan Maya."
        />

        <div className="relative mt-14">
          {/* Connector line: left on mobile, centered on desktop */}
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-4 lg:left-1/2 lg:-translate-x-1/2 w-px bg-gradient-to-b from-pink-500/50 via-rose-400/40 to-transparent"
          />

          <ul className="space-y-10 lg:space-y-16">
            {milestones.map(({ year, title, text }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={year} className="relative">
                  <div
                    className={`flex flex-col lg:flex-row lg:items-center lg:gap-8 ${
                      isLeft ? "" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5 }}
                      className="lg:w-1/2 pl-12 lg:pl-0"
                    >
                      <div
                        className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 sm:p-7 ${
                          isLeft ? "lg:text-right" : "lg:text-left"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-xs font-semibold">
                          {year}
                        </span>
                        <h3 className="mt-3 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          {title}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                          {text}
                        </p>
                      </div>
                    </motion.div>

                    {/* Spacer for desktop symmetry */}
                    <div className="hidden lg:block lg:w-1/2" />
                  </div>

                  {/* Node dot */}
                  <span
                    aria-hidden="true"
                    className="absolute top-6 lg:top-1/2 left-4 lg:left-1/2 -translate-x-1/2 lg:-translate-y-1/2 grid place-items-center h-5 w-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-400 ring-4 ring-cream-100 dark:ring-slate-900 shadow-md"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
