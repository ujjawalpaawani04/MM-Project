import { useState } from "react";
import { Link } from "react-router";
import { ShoppingCart, Heart } from "lucide-react";

import { getStockInfo } from "../../../data/products";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { useToast } from "../../../context/ToastContext";
import { useFlyToCart } from "../../../context/FlyToCartContext";
import { formatCurrency, discountPercent } from "../../../utils/formatCurrency";

import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Rating from "../../../components/common/Rating";
import QuantitySelector from "../../../components/common/QuantitySelector";
import ProductFeatures from "./ProductFeatures";

/** Right-hand product column: title, price, specs, actions and assurances. */
export default function ProductInfo({ product }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const toast = useToast();
  const { fly } = useFlyToCart();
  const [qty, setQty] = useState(1);

  const discount = discountPercent(product.originalPrice, product.price);
  const stock = getStockInfo(product);
  const soldOut = !stock.purchasable;
  const maxQty = Math.min(10, stock.count || 10);
  const wished = isInWishlist(product.id);

  const handleAdd = (e) => {
    addItem(product, qty);
    // Fly the product image (from the button origin) to the cart — the flight
    // is the success feedback (no toast).
    fly(e.currentTarget, product.image);
  };

  const handleWishlist = () => {
    const added = toggle(product);
    toast[added ? "success" : "info"](
      added ? "Added to wishlist" : "Removed from wishlist"
    );
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link
          to={`/shop?search=${encodeURIComponent(product.character)}`}
          className="text-sm font-medium text-brand-500 hover:underline"
        >
          {product.character}
        </Link>
        {product.badge && <Badge>{product.badge}</Badge>}
      </div>

      <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <Rating value={product.rating} count={product.reviewCount} showValue />
        <span className={`text-sm font-medium ${stock.className}`}>
          •{" "}
          {stock.status === "in-stock"
            ? `In Stock · ${stock.count} available`
            : stock.label}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-3xl font-bold text-brand-400">
          {formatCurrency(product.price)}
        </span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-lg text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
            <span className="text-green-600 font-semibold">Save {discount}%</span>
          </>
        )}
      </div>

      <p className="mt-5 text-gray-600 dark:text-gray-300 leading-relaxed">
        {product.description}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-3">
          <dt className="text-gray-400">Material</dt>
          <dd className="font-medium text-gray-900 dark:text-white">
            {product.material}
          </dd>
        </div>
        <div className="rounded-xl bg-gray-50 dark:bg-slate-800 p-3">
          <dt className="text-gray-400">Height</dt>
          <dd className="font-medium text-gray-900 dark:text-white">
            {product.height}
          </dd>
        </div>
      </dl>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {!soldOut && (
          <QuantitySelector
            value={qty}
            max={maxQty}
            onIncrement={() => setQty((q) => Math.min(maxQty, q + 1))}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
          />
        )}
        <Button
          onClick={handleAdd}
          disabled={soldOut}
          icon={ShoppingCart}
          size="lg"
          className="flex-1 min-w-[200px]"
        >
          {soldOut ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button variant="outline" size="lg" icon={Heart} onClick={handleWishlist}>
          {wished ? "Saved" : "Wishlist"}
        </Button>
      </div>

      <ProductFeatures />
    </div>
  );
}
