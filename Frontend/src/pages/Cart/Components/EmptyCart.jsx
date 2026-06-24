import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";

import { getRecommended } from "../../../data/products";
import Button from "../../../components/common/Button";
import SectionHeading from "../../../components/common/SectionHeading";
import ProductCard from "../../../components/website/ProductCard";

export default function EmptyCart() {
  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-brand-100/60 dark:border-slate-800 bg-gradient-to-br from-brand-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-6 py-16 sm:py-20 text-center">
        <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto w-24 h-24 grid place-items-center rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl"
        >
          <FiShoppingBag className="text-brand-400" size={42} />
        </motion.div>
        <h3 className="relative mt-7 text-2xl font-bold text-gray-900 dark:text-white">
          Your cart is waiting to be filled
        </h3>
        <p className="relative mt-2 max-w-md mx-auto text-gray-600 dark:text-gray-300">
          Every collection starts with a single piece. Explore the
          hand-painted miniatures and find the one that's calling your name.
        </p>
        <div className="relative mt-7 flex justify-center">
          <Button to="/shop" size="lg" icon={FiShoppingBag}>
            Continue Shopping
          </Button>
        </div>
      </div>

      <section className="mt-20">
        <SectionHeading
          title="Start With a"
          highlight="Favourite"
          subtitle="Collector-approved pieces that make a perfect first addition."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {getRecommended([], 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
