import Button from "../../../components/common/Button";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function OrderSummary({ items, subtotal, shipping, total, isSubmitting }) {
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
      <div className="border-t border-gray-100 dark:border-slate-700 mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
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
        Place Order
      </Button>
    </div>
  );
}
