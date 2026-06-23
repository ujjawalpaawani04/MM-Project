import { motion } from "framer-motion";
import Button from "../../../components/common/Button";
import { FaArrowRight } from "react-icons/fa";
import img from "../../../assets/website/About/aboutStory.jpg";

/** "Our Story" - alternating image/text intro section. */
export default function Story() {
  return (
    <section className="bg-cream dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-5"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold">
            Our Story
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            A Story You Can <span className="text-brand-500">Hold</span>
          </h2>

          <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              Mohan Maya began with a simple wish: to hold a story in your hands.
              The tale of Maya - a village girl who meets life&apos;s trials with
              courage - and Mohan, her divine protector, has inspired
              generations.
            </p>
            <p>
              From Radha Ji&apos;s serene grace to Shiva&apos;s cosmic stillness,
              each figure is a meditation in resin and paint. We work with
              artisans who treat every piece as an act of reverence, not just
              production.
            </p>
          </div>

          <Button to="/shop" size="lg" icon={FaArrowRight} iconRight className="rounded-full mt-1">
            Discover the Collection
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-100 to-rose-100 dark:from-slate-800 dark:to-slate-700 -z-10" />
          <img
            src={img}
            alt="Handcrafted Mohan Maya miniatures"
            loading="lazy"
            decoding="async"
            className="w-full h-[420px] object-cover rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
