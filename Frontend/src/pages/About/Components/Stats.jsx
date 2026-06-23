import { motion } from "framer-motion";
import { FiHeart, FiGlobe } from "react-icons/fi";
import { FaBoxOpen, FaPaintBrush } from "react-icons/fa";
import { cn } from "../../../utils/cn";

const stats = [
  { Icon: FiHeart, value: "5K+", label: "Happy Collectors" },
  { Icon: FaBoxOpen, value: "50+", label: "Collectible Designs" },
  { Icon: FiGlobe, value: "12+", label: "Countries Shipped" },
  { Icon: FaPaintBrush, value: "100%", label: "Hand-Painted" },
];

/** Stat band highlighting the brand at a glance. */
export default function Stats() {
  return (
    <section className="bg-cream-100 dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-xl overflow-hidden">
          {stats.map(({ Icon, value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "flex gap-4 p-7 lg:p-9 border-gray-100 dark:border-slate-700",
                "lg:border-r lg:[&:nth-child(4)]:border-r-0",
                "[&:nth-child(odd)]:border-r",
                i < 2 && "border-b lg:border-b-0"
              )}
            >
              <span className="shrink-0 grid place-items-center h-10 w-10 rounded-[12px] bg-gradient-to-br from-pink-500 to-rose-400 text-white shadow-lg">
                <Icon size={20} />
              </span>
              <div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
                <p className="text-gray-500 dark:text-gray-400">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
