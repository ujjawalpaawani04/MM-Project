import { memo, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";

import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useLoginGate } from "../../../context/LoginGateContext";
import { formatCurrency, discountPercent } from "../../../utils/formatCurrency";
import { getStockInfo } from "../../../data/products";
import Rating from "../../../components/common/Rating";

/**
 * Compact Shop product card. A Shop-page-only presentation (the Home grids keep
 * using the shared ProductCard) so visual changes here never affect other
 * pages. Inspired by the Home "Most Collected" card but tightened for dense
 * shop browsing: prominent square image, then only the essentials - name,
 * rating, price and a single Add-to-Cart action. All cart / wishlist /
 * quick-view / routing behaviour is unchanged.
 */
function ShopProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { requireAuth } = useLoginGate();
  const imgRef = useRef(null);

  const wished = isInWishlist(product.id);
  const discount = discountPercent(product.originalPrice, product.price);
  const stock = getStockInfo(product);
  const soldOut = !stock.purchasable;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (soldOut) return;
    // Require sign-in first; once authenticated the item is added silently and
    // the header count updates. Guests get the login modal and nothing is added.
    requireAuth(() => addItem(product, 1));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    // The heart icon's filled/outline state is the only success feedback - no toast.
    toggle(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-800 ring-1 ring-black/[0.06] dark:ring-white/[0.07] shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_38px_-18px_rgba(196,31,107,0.32)] hover:ring-brand-200/80 dark:hover:ring-brand-500/30 transition-[box-shadow,transform] duration-300 theme-surface"
    >
      {/* Media */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-gradient-to-br from-brand-50 via-white to-cream-100 dark:from-slate-900 dark:to-slate-800"
      >
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.07]"
        />

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-gradient-to-r from-pink-500 to-rose-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-gray-800/85 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {stock.shortLabel}
            </span>
          )}
        </div>

        {/* Quick view (desktop hover) */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="absolute bottom-2.5 left-1/2 hidden -translate-x-1/2 translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-gray-800 opacity-0 shadow-lg ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:flex dark:bg-slate-900/95 dark:text-white"
          >
            <Eye size={14} /> Quick View
          </button>
        )}
      </Link>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-md ring-1 ring-black/5 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:bg-slate-900/90"
      >
        <Heart
          size={15}
          className={
            wished ? "fill-red-500 text-red-500" : "text-gray-500 dark:text-gray-300"
          }
        />
      </button>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <Link to={`/product/${product.slug}`}>
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-gray-900 transition-colors hover:text-brand-500 dark:text-gray-50">
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <Rating value={product.rating} size={12} />
            <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price + CTA pinned to the bottom for equal-height cards */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-400 py-2 text-[13px] font-semibold text-white shadow-sm shadow-brand-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-500/30 active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-none disabled:bg-gray-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-sm dark:focus-visible:ring-offset-slate-800 dark:disabled:bg-slate-600"
          >
            <ShoppingCart size={15} />
            {soldOut ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Memoized: rendered in large grids and only needs to re-render when its own
// props change (matches the shared ProductCard behaviour).
export default memo(ShopProductCard);
