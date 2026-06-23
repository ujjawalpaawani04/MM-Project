import ProductCard from "../../../components/website/ProductCard";
import SectionHeading from "../../../components/common/SectionHeading";

/** Reusable cross-sell rail (title + responsive product grid). */
export default function ProductRail({ title, highlight, subtitle, items }) {
  if (!items.length) return null;
  return (
    <section className="mt-20">
      <SectionHeading title={title} highlight={highlight} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
