import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";
import { FaPaintBrush, FaGem, FaBookOpen, FaShippingFast, FaLock, FaHeart } from "react-icons/fa";

const features = [
  {
    Icon: FaPaintBrush,
    title: "100% Handcrafted",
    text: "Every miniature is sculpted and hand-painted by skilled artisans - no two are ever exactly alike.",
  },
  {
    Icon: FaGem,
    title: "Premium Materials",
    text: "Museum-grade polyresin and refined finishes, built to keep their beauty for generations.",
  },
  {
    Icon: FaBookOpen,
    title: "Soulful Stories",
    text: "Each figure carries a chapter of the Mohan-Maya spiritual journey into your space.",
  },
  {
    Icon: FaShippingFast,
    title: "Worldwide Shipping",
    text: "Carefully packed and delivered to collectors across 12+ countries, with care at every step.",
  },
  {
    Icon: FaLock,
    title: "Secure Checkout",
    text: "Shop with confidence - protected payments and a smooth, trusted ordering experience.",
  },
  {
    Icon: FaHeart,
    title: "Made with Devotion",
    text: "We treat every piece as an act of reverence, the same devotion the story itself celebrates.",
  },
];

/** "Why Choose Mohan Maya" - feature grid with image accent. */
export default function WhyChooseUs() {
  return (
    <section className="bg-cream dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Why Choose"
          highlight="Mohan Maya"
          subtitle="Craftsmanship, story and care come together in every piece we make."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image accent */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="relative order-1"
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-100 to-rose-100 dark:from-slate-800 dark:to-slate-700 -z-10" />
            <img
              src="/website/images/whyChooseUs.jpeg"
              alt="Artisan hand-painting a Mohan Maya miniature"
              loading="lazy"
              decoding="async"
              className="w-full h-[360px] lg:h-[480px] object-cover rounded-3xl shadow-2xl"
            />
          </motion.div>

          {/* Feature grid */}
          <div className="order-2 grid sm:grid-cols-2 gap-5">
            {features.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
                className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <span className="grid place-items-center h-12 w-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
