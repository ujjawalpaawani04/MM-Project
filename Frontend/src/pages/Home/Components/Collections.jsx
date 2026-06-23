import { Link } from "react-router";
import { motion } from "framer-motion";
import { CATEGORIES, products } from "../../../data/products";

// Pick a representative image for each collection from the catalog.
const collectionImage = (category) =>
  products.find((p) => p.category === category)?.image;

export default function Collections() {
  return (
    <section className="bg-cream-100 dark:bg-ink-900">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 py-14">
            <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Shop by <span className="text-brand-500">Collection</span>
        </h2>
        {/* <p className="mt-3  dark:text-gray-300">
          Curated sets for every occasion and devotion.
        </p> */}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((category, i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/shop?search=${encodeURIComponent(category.split(" ")[0])}`}
              className="group relative block aspect-square rounded-2xl overflow-hidden"
            >
              <img
                src={collectionImage(category)}
                alt={category}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <span className="absolute bottom-0 left-3 right-3 text-white font-semibold  backdrop-blur-[2px] p-3 text-center">
                {category}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
      </div>
  
    </section>
  );
}
