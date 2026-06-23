import { Link } from "react-router";
import { formatCurrency } from "../../../utils/formatCurrency";

function Row({ label, value, bold }) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "text-base font-bold text-gray-900 dark:text-white"
          : "text-sm text-gray-600 dark:text-gray-300"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/** Ordered products + totals. Reads the flat order.items shape. */
export default function OrderSummary({ order }) {
  const items = order.items || [];
  const subtotal =
    order.subtotal ??
    items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = order.shipping ?? (subtotal > 1999 ? 0 : 99);
  const total = order.total ?? subtotal + shipping;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8 lg:sticky lg:top-28">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
        Ordered Products
        <span className="ml-2 text-sm font-medium text-gray-400">
          ({items.length})
        </span>
      </h3>

      <ul className="mt-5 divide-y divide-gray-100 dark:divide-slate-700">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <Link
              to={item.slug ? `/product/${item.slug}` : "#"}
              className="h-16 w-16 rounded-xl overflow-hidden bg-brand-50 dark:bg-slate-900 shrink-0"
            >
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {item.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Qty {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2.5 border-t border-gray-100 dark:border-slate-700 pt-4">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        <Row label="Shipping" value={shipping === 0 ? "Free" : formatCurrency(shipping)} />
        <div className="border-t border-gray-100 dark:border-slate-700 pt-2.5">
          <Row label="Total" value={formatCurrency(total)} bold />
        </div>
      </div>
    </div>
  );
}
