import { useState } from "react";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { products, getRecommended } from "../../data/products";
import { getRecentlyViewed } from "../../utils/recentlyViewed";

import Pagination from "../../components/common/Pagination";
import WishlistHero from "./Components/WishlistHero";
import ProductRail from "./Components/ProductRail";
import EmptyWishlist from "./Components/EmptyWishlist";
import WishlistToolbar from "./Components/WishlistToolbar";
import WishlistGrid from "./Components/WishlistGrid";
import Seo from "../../components/common/Seo";

const PER_PAGE = 4;

export default function Wishlist() {
  const { items, clear } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();
  const [page, setPage] = useState(1);

  // Resolve to full catalog products (fallback to the stored snapshot).
  const fullProducts = items
    .map((w) => products.find((p) => p.id === w.id) || w)
    .filter(Boolean);

  const totalPages = Math.max(1, Math.ceil(fullProducts.length / PER_PAGE));
  // Clamp during render so removing items never strands us on an empty page
  // (avoids setState-in-effect; the stored page resets on the next click).
  const currentPage = Math.min(page, totalPages);
  const pageItems = fullProducts.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const wishlistIds = fullProducts.map((p) => p.id);
  const recentlyViewed = getRecentlyViewed({ limit: 4 }).filter(
    (p) => !wishlistIds.includes(p.id)
  );
  const recommended = getRecommended(wishlistIds, 4);

  const addAllToCart = () => {
    fullProducts.forEach((p) => addItem(p, 1));
    toast.success("All wishlist items added to cart");
  };

  return (
    <>
      <Seo title="Your Wishlist" noindex />
      <WishlistHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {fullProducts.length === 0 ? (
          <>
            <EmptyWishlist />
            <ProductRail
              title="Recommended"
              highlight="For You"
              subtitle="Handpicked best-sellers our collectors love."
              items={getRecommended([], 4)}
            />
          </>
        ) : (
          <>
            <WishlistToolbar
              count={fullProducts.length}
              onAddAll={addAllToCart}
              onClear={clear}
            />

            <WishlistGrid items={pageItems} currentPage={currentPage} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
              className="mt-10"
            />

            <ProductRail
              title="Recently"
              highlight="Viewed"
              subtitle="Pick up where you left off."
              items={recentlyViewed}
            />
            <ProductRail
              title="Recommended"
              highlight="For You"
              subtitle="You may also like these handcrafted pieces."
              items={recommended}
            />
          </>
        )}
      </div>
    </>
  );
}
