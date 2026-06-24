import SectionHeading from "../../../components/common/SectionHeading";
import ProductCard from "../../../components/website/ProductCard";
import { getNewArrivals } from "../../../data/products";

export default function NewArrivals() {
  const products = getNewArrivals().slice(0, 6);
  if (!products.length) return null;

  return (
    <section className="bg-cream dark:bg-ink-900 py-16">
      <div className="container mx-auto px-5">
        <SectionHeading
          title="Fresh Off the"
          highlight="Workbench"
          subtitle="Newly sculpted additions to the collection. Be among the first to bring them home."
          viewAllTo="/shop"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" tag="New" />
          ))}
        </div>
      </div>
    </section>
  );
}
