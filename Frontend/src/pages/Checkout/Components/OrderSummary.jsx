import { useState } from "react";
import { FiTag, FiX } from "react-icons/fi";
import Button from "../../../components/common/Button";
import { formatCurrency } from "../../../utils/formatCurrency";

/**
 * Sticky order summary: line items, the money breakdown (subtotal, discount,
 * shipping, total) and the submit button. Coupon state is owned by the parent
 * Checkout page; this component just renders the input and reports apply/remove.
 */
export default function OrderSummary({
  items,
  subtotal,
  shipping,
  discount = 0,
  total,
  isSubmitting,
  buttonLabel = "Place Order",
  coupon = null,
  couponError = "",
  onApplyCoupon,
  onRemoveCoupon,
}) {
  const [code, setCode] = useState("");

  const applyCoupon = () => {
    const trimmed = code.trim();
    if (trimmed) onApplyCoupon?.(trimmed);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm lg:sticky lg:top-32">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Your Order
      </h2>
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-50 dark:bg-slate-900 shrink-0">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                {item.name}
              </p>
              <p className="text-xs text-gray-400">Qty {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold dark:text-white">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon / discount */}
      <div className="mt-4 border-t border-gray-100 dark:border-slate-700 pt-4">
        {coupon ? (
          <div className="flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-500/10 px-3 py-2.5">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-300">
              <FiTag size={14} /> {coupon.code} applied
            </span>
            <button
              type="button"
              onClick={onRemoveCoupon}
              aria-label="Remove coupon"
              className="text-green-700/70 hover:text-green-700 dark:text-green-300/70"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              Have a coupon?
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
                placeholder="e.g. MOHAN10"
                className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-400"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={applyCoupon}
              >
                Apply
              </Button>
            </div>
            {couponError && (
              <p role="alert" className="mt-1.5 text-xs text-red-500">
                {couponError}
              </p>
            )}
          </>
        )}
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700 mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount</span>
            <span>−{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-700">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isSubmitting}
        className="mt-6"
      >
        {isSubmitting ? "Processing…" : buttonLabel}
      </Button>
    </div>
  );
}
