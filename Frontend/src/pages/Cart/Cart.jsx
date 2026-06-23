import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FiTrash2, FiArrowRight } from "react-icons/fi";

import { useCart } from "../../context/CartContext";
import { getRecommended } from "../../data/products";

import CartHero from "./Components/CartHero";
import CartItem from "./Components/CartItem";
import EmptyCart from "./Components/EmptyCart";
import CartSummary from "./Components/CartSummary";
import CartBenefits from "./Components/CartBenefits";
import WhyShop from "./Components/WhyShop";
import Button from "../../components/common/Button";
import SectionHeading from "../../components/common/SectionHeading";
import ProductCard from "../../components/website/ProductCard";
import Pagination from "../../components/common/Pagination";
import Seo from "../../components/common/Seo";

const PER_PAGE = 4;

export default function Cart() {
  const {
    items,
    increment,
    decrement,
    removeItem,
    clearCart,
    subtotal,
    shipping,
    savings,
    total,
    totalItems,
    shippingThreshold,
  } = useCart();

  const [page, setPage] = useState(1);

  const remaining = Math.max(0, shippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / shippingThreshold) * 100);

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  // Clamp during render so removing items never strands us on an empty page
  // (avoids setState-in-effect; the stored page resets on the next click).
  const currentPage = Math.min(page, totalPages);
  const pageItems = items.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const recommended = getRecommended(
    items.map((i) => i.id),
    4
  );

  return (
    <>
      <Seo title="Your Cart" noindex />
      <CartHero />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 lg:py-14">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Shopping Cart
                    <span className="ml-2 text-base font-medium text-gray-400">
                      ({totalItems} item{totalItems !== 1 ? "s" : ""})
                    </span>
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={FiTrash2}
                    onClick={clearCart}
                    className="hidden sm:inline-flex"
                  >
                    Clear cart
                  </Button>
                </div>

                <div className="space-y-4 min-h-[360px]">
                  <AnimatePresence mode="popLayout">
                    {pageItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        increment={increment}
                        decrement={decrement}
                        removeItem={removeItem}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  className="mt-8"
                />

                <div className="mt-6">
                  <Button variant="outline" to="/shop" icon={FiArrowRight} iconRight>
                    Continue shopping
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <CartSummary
                subtotal={subtotal}
                savings={savings}
                shipping={shipping}
                total={total}
                totalItems={totalItems}
                remaining={remaining}
                progress={progress}
              />
            </div>

            {/* Secure checkout benefits */}
            <CartBenefits />

            {/* Why shop with us */}
            <WhyShop />

            {/* Recommended products */}
            {recommended.length > 0 && (
              <section className="mt-16">
                <SectionHeading
                  title="You May Also"
                  highlight="Like"
                  subtitle="Complete your collection with these favourites."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {recommended.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
}
