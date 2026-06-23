import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

import Button from "../../../components/common/Button";

/** Animated empty state shown when the wishlist has no items. */
export default function EmptyWishlist() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-brand-100/60 dark:border-slate-800 bg-gradient-to-br from-brand-50 via-rose-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-6 py-16 sm:py-20 text-center">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-brand-300/30 blur-3xl dark:bg-brand-500/20" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-28 h-28"
      >
        <span className="absolute inset-0 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-xl" />
        <span className="absolute inset-0 grid place-items-center">
          <FiHeart className="text-brand-400" size={48} />
        </span>
        {/* floating mini hearts */}
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute -top-2 -right-1 text-rose-400"
        >
          <FiHeart size={18} />
        </motion.span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity }}
          className="absolute bottom-0 -left-2 text-brand-300"
        >
          <FiHeart size={14} />
        </motion.span>
      </motion.div>

      <h3 className="relative mt-8 text-2xl font-bold text-gray-900 dark:text-white">
        Your wishlist is empty
      </h3>
      <p className="relative mt-2 max-w-md mx-auto text-gray-600 dark:text-gray-300">
        Tap the heart on any product to save it here. Build your dream collection
        and come back to it anytime.
      </p>
      <div className="relative mt-7 flex justify-center">
        <Button to="/shop" size="lg" icon={FiShoppingBag}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
