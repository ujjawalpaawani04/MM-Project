import { Link } from "react-router";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import SectionHeading from "../../../components/common/SectionHeading";
import { products, CATEGORIES } from "../../../data/products";

/**
 * "Shop by Category" - premium image cards (one per CATEGORIES entry).
 * Each card derives a representative image + live item count from the catalog
 * and links into the Shop with a pre-applied category filter.
 */
export default function ShopByCategory() {
  const categories = CATEGORIES.map((cat) => ({
    name: cat,
    image: products.find((p) => p.category === cat)?.image,
    count: products.filter((p) => p.category === cat).length,
  }));

  return (
    <section className="bg-cream-100 dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Shop by"
          highlight="Category"
          subtitle="Explore our curated collections, each crafted for a moment worth keeping."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-brand-50 dark:bg-slate-800" />
                )}

                {/* Dark gradient overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-medium text-white/90">
                    {cat.count} {cat.count === 1 ? "item" : "items"}
                  </span>
                  <h3 className="mt-2 text-sm sm:text-base font-semibold text-white leading-snug">
                    {cat.name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-white/80 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Shop now
                    <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
