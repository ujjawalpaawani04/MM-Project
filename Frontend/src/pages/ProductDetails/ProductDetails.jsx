import { useEffect } from "react";
import { useParams } from "react-router";

import { getProductBySlug } from "../../data/products";
import { recordRecentlyViewed } from "../../utils/recentlyViewed";

import EmptyState from "../../components/common/EmptyState";
import Seo from "../../components/common/Seo";
import ProductHero from "./Components/ProductHero";
import ProductGallery from "./Components/ProductGallery";
import ProductInfo from "./Components/ProductInfo";
import ProductReviews from "./Components/ProductReviews";
import RelatedProducts from "./Components/RelatedProducts";

export default function ProductDetails() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  // Record this product as recently viewed (powers Wishlist / cross-sell rails).
  useEffect(() => {
    if (product) recordRecentlyViewed(product.id);
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <Seo title="Product not found" noindex />
        <EmptyState
          title="Product not found"
          description="The miniature you're looking for doesn't exist or has been moved."
          actionLabel="Back to Shop"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.description}
        image={product.image}
        url={`https://mohanmaya.com/product/${product.slug}`}
      />
      <ProductHero product={product.name} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        <section className="mt-16 pt-12 border-t border-gray-100 dark:border-slate-800">
          <ProductReviews product={product} />
        </section>

        <RelatedProducts product={product} />
      </div>
    </>
  );
}
