import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";
import { FaPencilRuler, FaHandSparkles, FaFillDrip, FaPaintBrush, FaCheckCircle, FaBoxOpen } from "react-icons/fa";

const steps = [
  { Icon: FaPencilRuler, title: "Sketch", text: "Each character begins as a hand-drawn concept rooted in the story." },
  { Icon: FaHandSparkles, title: "Sculpt", text: "Artisans shape the figure by hand, refining every pose and feature." },
  { Icon: FaFillDrip, title: "Cast", text: "The master form is cast in premium polyresin for lasting detail." },
  { Icon: FaPaintBrush, title: "Hand-Paint", text: "Fine, hand-mixed pigments bring color, depth and soul to life." },
  { Icon: FaCheckCircle, title: "Quality Check", text: "Every piece is inspected to meet our museum-grade standard." },
  { Icon: FaBoxOpen, title: "Pack", text: "Lovingly wrapped and packed, ready to travel safely to your home." },
];

/** "Our Crafting Process" - horizontal stepper (desktop) / vertical (mobile). */
export default function Process() {
  return (
    <section className="bg-cream dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="The Crafting"
          highlight="Process"
          subtitle="From first sketch to your doorstep - six careful steps behind every miniature."
        />

        <div className="relative mt-14">
          {/* Connector: vertical on mobile, horizontal on desktop */}
          <span
            aria-hidden="true"
            className="absolute left-7 top-0 bottom-0 w-px lg:left-0 lg:right-0 lg:top-7 lg:bottom-auto lg:h-px lg:w-full bg-gradient-to-b lg:bg-gradient-to-r from-pink-500/40 via-rose-400/40 to-pink-500/40"
          />

          <ol className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4">
            {steps.map(({ Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-3 lg:text-center"
              >
                <span className="relative z-10 shrink-0 grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg ring-4 ring-cream dark:ring-ink-900">
                  <Icon size={22} />
                </span>
                <div className="lg:px-1">
                  <span className="text-xs font-semibold text-brand-500">
                    Step {i + 1}
                  </span>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
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
