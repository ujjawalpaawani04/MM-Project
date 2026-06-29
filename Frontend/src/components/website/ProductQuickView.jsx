import { useRef, useState } from "react";
import { ShoppingCart, Heart, X } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Rating from "../common/Rating";
import QuantitySelector from "../common/QuantitySelector";
import Product3DViewer from "./Product3DViewer";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useFlyToCart } from "../../context/FlyToCartContext";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import { getStockInfo } from "../../data/products";
import { IoMdArrowForward } from "react-icons/io";

export default function ProductQuickView({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const { fly } = useFlyToCart();
  const galleryRef = useRef(null);

  const [qty, setQty] = useState(1);

  // Reset local state each time a different product opens (prev-prop-in-state
  // pattern - adjust during render, no effect needed). The gallery/3D viewer
  // resets via its `key={product.id}` below.
  const [prevId, setPrevId] = useState(product?.id);
  if (product && product.id !== prevId) {
    setPrevId(product.id);
    setQty(1);
  }

  if (!product) return null;

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const discount = discountPercent(product.originalPrice, product.price);
  const stock = getStockInfo(product);
  const soldOut = !stock.purchasable;
  const maxQty = Math.min(10, stock.count || 10);
  const wished = isInWishlist(product.id);

  // Add to cart WITHOUT closing the modal - the user stays on the product so
  // they can keep adjusting qty, wishlist it, or open the full details. The
  // flight is the success feedback; the modal only closes on explicit dismiss.
  const handleAdd = (e) => {
    e?.stopPropagation();
    // Fly the *currently selected* gallery image (not the default product.image)
    // so the animation matches whichever thumbnail the user is viewing. The cart
    // update is deferred until the clone lands so the count tracks the animation.
    const anchor = galleryRef.current?.querySelector("[data-fly-anchor]");
    fly(anchor || galleryRef.current, anchor?.src || product.image, () =>
      addItem(product, qty)
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" hideClose>
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close dialog"
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white bg-red-500 dark:bg-slate-900/80 backdrop-blur hover:bg-red-600 dark:hover:bg-slate-800 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="grid md:grid-cols-2 gap-6 p-6">
        {/* Gallery - same Photo/3D viewer as the full details page */}
        <div ref={galleryRef}>
          <Product3DViewer
            key={product.id}
            images={gallery}
            modelUrl={product.model}
            name={product.name}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-brand-500">
            {product.character}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} showValue />
            <span
              className={`flex items-center gap-1.5 text-sm font-medium ${stock.className}`}
            >
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  stock.status === "in-stock"
                    ? "bg-green-500"
                    : stock.status === "out"
                    ? "bg-gray-400"
                    : "bg-amber-500"
                }`}
              />
              {stock.status === "in-stock"
                ? `In Stock · ${stock.count} available`
                : stock.label}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold text-brand-400">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="text-green-600 text-sm font-semibold">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <dl className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700 dark:text-gray-200">Material:</dt>
              <dd>{product.material}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-700 dark:text-gray-200">Height:</dt>
              <dd>{product.height}</dd>
            </div>
          </dl>

          {!soldOut && (
            <div className="flex items-center gap-4 mt-6">
              <QuantitySelector
                value={qty}
                max={maxQty}
                onIncrement={() => setQty((q) => Math.min(maxQty, q + 1))}
                onDecrement={() => setQty((q) => Math.max(1, q - 1))}
              />
              <span className="text-sm text-gray-500">Max {maxQty} per order</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              onClick={handleAdd}
              disabled={soldOut}
              icon={ShoppingCart}
              fullWidth
            >
              {soldOut ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={() => toggle(product)}
              icon={Heart}
            >
              {wished ? "Saved" : "Wishlist"}
            </Button>
          </div>

          <Button
            to={`/product/${product.slug}`}
            variant="ghost"
            onClick={onClose}
            className="mt-3"
          >
            View full details <IoMdArrowForward />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
