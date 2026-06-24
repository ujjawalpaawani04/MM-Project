import { FaPaintBrush, FaGem, FaGift, FaHandsHelping, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router";
import { motion } from "framer-motion";

import img from "/website/images/whyChooseUs.jpeg";

// Single source of truth - drives both columns (kills the 4× duplicated markup).
const features = [
  {
    Icon: FaPaintBrush,
    title: "Hand-Painted, Never Mass-Made",
    text: "Each figure is sculpted and painted by hand. Small variations aren't flaws - they're the artisan's signature, and no two are identical.",
  },
  {
    Icon: FaGem,
    title: "Limited & Collectible",
    text: "Drawn from the Mohan-Maya story and released in small batches. Once a limited edition sells out, it's gone for good.",
  },
  {
    Icon: FaGift,
    title: "Made to Be Gifted",
    text: "Weighty, finished, and ready to give - a keepsake for Diwali, weddings, housewarmings, or anyone who treasures meaningful art.",
  },
  {
    Icon: FaHandsHelping,
    title: "Built to Last Generations",
    text: "Museum-grade resin and sealed finishes that hold their colour and detail for decades, not seasons.",
  },
];

function Feature({ Icon, title, text, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="text-center"
    >
      <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-slate-800 dark:to-slate-700 text-brand-500 text-2xl ring-1 ring-brand-200/60 dark:ring-slate-600 shadow-sm">
        <Icon />
      </div>
      <h3 className="mt-5 font-bold text-xl text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 leading-7 text-gray-600 dark:text-gray-300">{text}</p>
    </motion.div>
  );
}

const WhyChooseUs = () => {
  const [left, right] = [features.slice(0, 2), features.slice(2)];

  return (
    <section className="py-20 bg-cream dark:bg-ink-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white text-sm font-semibold shadow-sm shadow-brand-500/20">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-5 dark:text-white">
            The Difference Is in
            <span className="text-brand-500"> the Detail</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-gray-600 dark:text-gray-300">
            Every Mohan Maya piece is shaped, painted, and inspected by hand -
            so what reaches your shelf is genuinely one of a kind, not one of
            ten thousand.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-5 items-center">
          {/* Left column */}
          <div className="space-y-10">
            {left.map((f, i) => (
              <Feature key={f.title} {...f} index={i} />
            ))}
          </div>

          {/* Center image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center order-first lg:order-none"
          >
            <div className="relative">
              <div className="absolute w-full h-full bg-brand-200/70 dark:bg-brand-500/20 rounded-3xl top-5 left-5" />
              <img
                src={img}
                alt="Artisan hand-painting a MohanMaya miniature"
                loading="lazy"
                decoding="async"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-10">
            {right.map((f, i) => (
              <Feature key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>

        <Link
          to="/shop"
          className="group mt-16 mx-auto w-fit flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold shadow-lg shadow-brand-500/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-200"
        >
          Shop Collection
          <FaArrowRight className="group-hover:translate-x-1 duration-300" />
        </Link>
      </div>
    </section>
  );
};

export default WhyChooseUs;
