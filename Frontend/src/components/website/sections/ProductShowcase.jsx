import { Link } from "react-router";
import ProductCard from "../ProductCard";
import { FaArrowRight } from "react-icons/fa";
/** Reusable home section: a titled grid of products with a "view all" link. */
export default function ProductShowcase({
   title,
  subtitle,
  products,
  viewAllTo = "/shop",
  onQuickView,
}) {
  if (!products?.length) return null;
  return (
    <section className="bg-ink-50 dark:bg-ink-900">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 py-14">
             <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-5xl font-bold text-[#4a3747] dark:text-white">
           {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-black dark:text-gray-300 text-center">{subtitle}</p>
          )}
        </div>
        <Link
          to={viewAllTo}
          className="shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full   bg-gradient-to-r from-pink-500 to-rose-400 backdrop-blur-md text-[#ffffff] text-sm font-semibold group"
        >
    View All    <FaArrowRight className="group-hover:translate-x-1 duration-300" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} onQuickView={onQuickView} />
        ))}
      </div>
      </div>
 
    </section>
  );
}
