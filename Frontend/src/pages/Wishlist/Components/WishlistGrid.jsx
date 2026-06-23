import { AnimatePresence, motion } from "framer-motion";

import ProductCard from "../../../components/website/ProductCard";

/** Paginated, animated grid of wishlist product cards. */
export default function WishlistGrid({ items, currentPage }) {
  return (
    <div className="mt-8 min-h-[420px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
