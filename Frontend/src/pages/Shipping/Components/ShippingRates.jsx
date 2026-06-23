import { motion } from "framer-motion";
import { FiTruck, FiPackage, FiClock } from "react-icons/fi";
import Card from "../../../components/common/Card";
import SectionIntro from "../../../components/common/SectionIntro";
import SectionDivider from "../../../components/common/SectionDivider";
import { fadeUp } from "../../../utils/motion";

const rateCards = [
  {
    icon: <FiTruck />,
    title: "Free Shipping",
    price: "₹0",
    text: "Enjoy complimentary shipping on every order above ₹1999.",
    featured: true,
  },
  {
    icon: <FiPackage />,
    title: "Standard Shipping",
    price: "₹99",
    text: "A flat ₹99 fee applies to orders below ₹1999.",
  },
  {
    icon: <FiClock />,
    title: "Pre-Order Pieces",
    price: "On Release",
    text: "Pre-order items ship on their listed release date.",
  },
];

/** Transparent shipping rate cards (with a "Most popular" highlight). */
export default function ShippingRates() {
  return (
    <>
      <div className="bg-cream dark:bg-ink-900 pt-14 lg:pt-20">
        <SectionDivider />
      </div>

      <section className="bg-cream dark:bg-ink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
          <SectionIntro
            eyebrow="Shipping Rates"
            title="Simple, transparent pricing"
            description="In-stock items are dispatched within 2 business days and delivered in 4-7 business days across India."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {rateCards.map((r, i) => (
              <motion.div
                key={r.title}
                {...fadeUp}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Card
                  className={`relative h-full p-7 ${
                    r.featured
                      ? "ring-2 ring-brand-300 dark:ring-brand-400/40"
                      : ""
                  }`}
                >
                  {r.featured && (
                    <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
                      Most popular
                    </span>
                  )}
                  <span
                    className={`grid place-items-center h-12 w-12 rounded-xl text-xl ${
                      r.featured
                        ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white"
                        : "bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300"
                    }`}
                  >
                    {r.icon}
                  </span>
                  <h3 className="mt-5 font-bold text-gray-900 dark:text-white">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
                    {r.price}
                  </p>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {r.text}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
