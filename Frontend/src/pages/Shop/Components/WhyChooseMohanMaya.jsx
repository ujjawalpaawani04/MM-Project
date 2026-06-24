import { motion } from "framer-motion";
import { Hand, Gem, Globe2, ShieldCheck } from "lucide-react";
import SectionHeading from "../../../components/common/SectionHeading";

/**
 * "Why Choose MohanMaya" - four trust/feature cards with gradient icon chips.
 */
const FEATURES = [
  {
    icon: Hand,
    title: "Handcrafted by Artisans",
    description:
      "Every miniature is sculpted and hand-painted by master artisans - no two pieces are ever quite the same.",
  },
  {
    icon: Gem,
    title: "Museum-Grade Materials",
    description:
      "Premium polyresin, cold-cast bronze and gold-leaf accents built to be treasured for generations.",
  },
  {
    icon: Globe2,
    title: "Worldwide Shipping",
    description:
      "Carefully packaged and delivered to collectors across 12+ countries, with full tracking from our studio to your shelf.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Easy Returns",
    description:
      "Encrypted checkout and a hassle-free 14-day return promise, so you can collect with complete confidence.",
  },
];

export default function WhyChooseMohanMaya() {
  return (
    <section className="bg-cream-100 dark:bg-slate-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Why Choose"
          highlight="MohanMaya"
          subtitle="Heirloom craftsmanship, honest materials and care at every step."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 lg:p-7 text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <Icon size={26} strokeWidth={1.75} />
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
