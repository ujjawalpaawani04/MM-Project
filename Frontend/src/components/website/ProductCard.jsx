import { memo, useRef } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useFlyToCart } from "../../context/FlyToCartContext";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import { getStockInfo } from "../../data/products";
import Rating from "../common/Rating";
import Badge from "../common/Badge";

function ProductCard({ product, onQuickView, variant = "default", tag }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { fly } = useFlyToCart();
  const imgRef = useRef(null);
  const compact = variant === "compact";

  const wished = isInWishlist(product.id);
  const discount = discountPercent(product.originalPrice, product.price);
  const stock = getStockInfo(product);
  const soldOut = !stock.purchasable;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (soldOut) return;
    // Defer the cart update until the flying clone lands, so the header count
    // updates exactly on arrival (never ahead of the animation). The flourish
    // is the success feedback (no toast).
    fly(imgRef.current, product.image, () => addItem(product, 1));
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/60 shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_40px_-12px_rgba(196,31,107,0.18)] hover:border-brand-200/70 dark:hover:border-brand-500/30 transition-[box-shadow,border-color] duration-300 theme-surface"
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative block overflow-hidden aspect-square bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-800"
      >
        <img
          ref={imgRef}
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.07]"
        />
        {/* Subtle gradient scrim so badges stay legible on light figures */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {tag ? (
            <Badge className="uppercase tracking-wide">{tag}</Badge>
          ) : (
            discount > 0 && <Badge>{discount}% OFF</Badge>
          )}
          {!compact && stock.status !== "in-stock" && (
            <Badge tone={stock.tone}>{stock.shortLabel}</Badge>
          )}
        </div>

        {/* Quick view (desktop hover) */}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            aria-label={`Quick view ${product.name}`}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 text-gray-800 dark:text-white text-sm font-medium px-4 py-2 rounded-full shadow opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye size={16} /> Quick View
          </button>
        )}
      </Link>

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <Heart
          size={18}
          className={
            wished
              ? "fill-red-500 text-red-500"
              : "text-gray-500 dark:text-gray-300"
          }
        />
      </button>

      {/* Content - compact (New Arrivals): name + price only */}
      {compact ? (
        <div className="p-4 text-center">
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-brand-500 transition-colors">
              {product.name}
            </h3>
          </Link>
          <span className="mt-1 block text-base font-bold text-brand-600 dark:text-brand-300">
            {formatCurrency(product.price)}
          </span>
        </div>
      ) : (
        <div className="p-4 flex flex-col flex-1">
          {/* <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">
            {product.character}
          </span> */}
          <Link to={`/product/${product.slug}`}>
            <h3 className="mt-1 text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-brand-500 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="mt-1.5">
            <Rating value={product.rating} count={product.reviewCount} showValue />
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-lg font-bold text-brand-600 dark:text-brand-300">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="ml-auto text-xs font-semibold text-green-600 dark:text-green-400">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock availability */}
          {/* <p
            className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${stock.className}`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                stock.status === "in-stock"
                  ? "bg-green-500"
                  : stock.status === "out"
                  ? "bg-gray-400"
                  : "bg-amber-500"
              }`}
            />
            {stock.status === "in-stock"
              ? `In Stock · ${stock.count} available`
              : stock.shortLabel}
          </p> */}

          <button
            onClick={handleAddToCart}
            disabled={soldOut}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white py-2.5 rounded-xl font-semibold shadow-sm shadow-brand-500/20 hover:shadow-md hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
          >
            <ShoppingCart size={18} />
            {soldOut ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

// Memoized: product cards are rendered in large grids/sliders and only need to
// re-render when their own props change, not when a parent (e.g. Home's
// quick-view state) updates.
export default memo(ProductCard);
