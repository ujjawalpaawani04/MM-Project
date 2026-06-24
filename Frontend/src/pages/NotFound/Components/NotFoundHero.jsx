import { motion } from "framer-motion";
import { FiHome, FiShoppingBag } from "react-icons/fi";
import Button from "../../../components/common/Button";

/** 404 hero - the page's main (and only) section. */
export default function NotFoundHero() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-brand-50 to-rose-50 dark:from-slate-900 dark:to-slate-800">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-7xl sm:text-9xl font-extrabold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent"
      >
        404
      </motion.h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        This page wandered off
      </h2>
      <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-md">
        The page you're looking for has gone on its own journey. Let's get you
        back to the collection - there's plenty here worth discovering.
      </p>
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <Button to="/" icon={FiHome}>
          Go Home
        </Button>
        <Button to="/shop" variant="outline" icon={FiShoppingBag}>
          Browse Shop
        </Button>
      </div>
    </section>
  );
}
