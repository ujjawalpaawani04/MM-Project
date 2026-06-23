import { getRelatedProducts } from "../../../data/products";
import ProductCard from "../../../components/website/ProductCard";

/** "You May Also Like" — related products grid. */
export default function RelatedProducts({ product }) {
  const related = getRelatedProducts(product);
  if (!related.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        You May Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
