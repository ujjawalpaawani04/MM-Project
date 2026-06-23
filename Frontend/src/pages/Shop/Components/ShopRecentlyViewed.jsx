import SectionHeading from "../../../components/common/SectionHeading";
import ProductCard from "../../../components/website/ProductCard";
import { getRecentlyViewed } from "../../../utils/recentlyViewed";

/**
 * "Recently Viewed" rail. Renders nothing when the visitor has no history,
 * otherwise a responsive grid of the last 4 viewed products.
 */
export default function ShopRecentlyViewed() {
  const items = getRecentlyViewed({ limit: 4 });
  if (!items.length) return null;

  return (
    <section className="bg-cream dark:bg-ink-900 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHeading
          title="Recently"
          highlight="Viewed"
          subtitle="Pick up right where you left off."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
