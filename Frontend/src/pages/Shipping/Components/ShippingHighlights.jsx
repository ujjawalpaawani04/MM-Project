import { motion } from "framer-motion";
import { FiTruck, FiClock, FiMapPin, FiRefreshCw } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import { fadeUp } from "../../../utils/motion";

const highlights = [
  {
    icon: <FiTruck />,
    title: "Free Shipping",
    text: "On all orders above ₹1999, anywhere in India.",
  },
  {
    icon: <FiClock />,
    title: "Dispatched in 2 Days",
    text: "In-stock pieces leave our studio within 2 business days.",
  },
  {
    icon: <FiMapPin />,
    title: "4-7 Day Delivery",
    text: "Reliable nationwide delivery to your doorstep.",
  },
  {
    icon: <FiRefreshCw />,
    title: "7-Day Easy Returns",
    text: "Hassle-free returns on unused items in original packaging.",
  },
];

/** Quick four-up grid of shipping highlights. */
export default function ShippingHighlights() {
  return (
    <section className="bg-cream dark:bg-ink-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <SectionIntro
          title="Delivered with care, across India"
          description="From our studio to your doorstep — here's everything you need to know about getting your Mohan Maya pieces."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              {...fadeUp}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Card className="h-full p-6">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 text-xl">
                  {h.icon}
                </span>
                <h3 className="mt-4 font-bold text-gray-900 dark:text-white">
                  {h.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {h.text}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
