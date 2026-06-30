import { useMemo } from "react";
import { Link } from "react-router";
import { FiPackage, FiChevronRight } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import {
  getUserOrders,
  getOrderStatus,
  formatOrderDate,
} from "../../utils/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import EmptyState from "../../components/common/EmptyState";

const statusTone = {
  delivered: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  "out-for-delivery": "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  shipped: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  default: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
};

function OrderRow({ order }) {
  const { steps, currentStep, statusLabel } = getOrderStatus(order);
  const tone = statusTone[steps[currentStep].key] || statusTone.default;
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 dark:bg-slate-700/40 px-4 sm:px-5 py-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Order</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {order.orderNumber}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Placed</p>
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {formatOrderDate(order.placedAt)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Total</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex items-center gap-4 px-4 sm:px-5 py-4">
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => (
            <img
              key={item.id}
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="h-14 w-14 rounded-xl object-cover border-2 border-white dark:border-slate-800 bg-gray-100"
            />
          ))}
          {order.items.length > 3 && (
            <span className="grid place-items-center h-14 w-14 rounded-xl border-2 border-white dark:border-slate-800 bg-gray-100 dark:bg-slate-700 text-xs font-semibold text-gray-600 dark:text-gray-300">
              +{order.items.length - 3}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {order.items[0].name}
            {order.items.length > 1 && (
              <span className="text-gray-400 font-normal">
                {" "}& {order.items.length - 1} more
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          to={`/track-order?tracking=${encodeURIComponent(order.trackingNumber)}`}
          variant="outline"
          size="sm"
          icon={FiChevronRight}
          iconRight
        >
          Track
        </Button>
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const orders = useMemo(() => getUserOrders(user?.email), [user?.email]);

  return (
    <AccountLayout
      title="My Orders"
      description="Track current orders and revisit your past purchases."
      icon={FiPackage}
    >
      {orders.length === 0 ? (
        <AccountCard>
          <EmptyState
            icon={FiPackage}
            title="No orders yet"
            description="When you place an order it will appear here, with live tracking."
            actionLabel="Start Shopping"
            actionTo="/shop"
          />
        </AccountCard>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderRow key={order.trackingNumber} order={order} />
          ))}
          <p className="text-center text-xs text-gray-400 pt-2">
            Have a tracking number from elsewhere?{" "}
            <Link to="/track-order" className="text-brand-500 hover:underline">
              Track any order
            </Link>
          </p>
        </div>
      )}
    </AccountLayout>
  );
}
