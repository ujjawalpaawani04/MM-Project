import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FiPackage, FiEye, FiXCircle } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getUserOrders,
  getEffectiveStatus,
  getPaymentStatus,
  canCancelOrder,
  cancelOrder,
  formatOrderDate,
} from "../../utils/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import AccountLayout, { AccountCard, Button } from "./AccountLayout";
import EmptyState from "../../components/common/EmptyState";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import OrderDetailsModal from "./Components/OrderDetailsModal";

function OrderRow({ order, onView, onCancel }) {
  const { statusKey, statusLabel } = getEffectiveStatus(order);
  const payment = getPaymentStatus(order);
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
  const cancellable = canCancelOrder(order);

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
        <div className="flex items-center gap-2">
          <OrderStatusBadge tone={payment.tone} label={payment.label} />
          <OrderStatusBadge statusKey={statusKey} label={statusLabel} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-4 sm:px-5 py-4">
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
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" icon={FiEye} onClick={() => onView(order)}>
            Details
          </Button>
          <Button
            to={`/track-order?tracking=${encodeURIComponent(order.trackingNumber)}`}
            variant="ghost"
            size="sm"
          >
            Track
          </Button>
          {cancellable && (
            <Button
              variant="danger"
              size="sm"
              icon={FiXCircle}
              onClick={() => onCancel(order)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const toast = useToast();

  // Orders are held in state (not a bare useMemo) so cancelling one can
  // re-render the list instantly, without a page reload.
  const [orders, setOrders] = useState(() => getUserOrders(user?.email));
  const [active, setActive] = useState(null); // order shown in the details modal
  const [toCancel, setToCancel] = useState(null); // order awaiting cancel confirmation
  const [cancelling, setCancelling] = useState(false);

  // Re-sync when the signed-in account changes (login / logout / switch).
  useEffect(() => {
    setOrders(getUserOrders(user?.email));
  }, [user?.email]);

  const refresh = () => setOrders(getUserOrders(user?.email));

  const handleConfirmCancel = async () => {
    if (!toCancel) return;
    setCancelling(true);
    // Simulated processing latency so the loading state is visible (no backend).
    await new Promise((r) => setTimeout(r, 700));

    const updated = cancelOrder(toCancel.trackingNumber);
    setCancelling(false);
    setToCancel(null);

    if (!updated) {
      toast.error("This order can no longer be cancelled.");
      return;
    }
    refresh();
    // Keep the details modal in sync if it's open on the same order.
    setActive((curr) =>
      curr?.trackingNumber === updated.trackingNumber ? updated : curr
    );
    toast.success(`Order ${updated.orderNumber} has been cancelled.`);
  };

  return (
    <AccountLayout
      title="My Orders"
      description="Track current orders, revisit past purchases and cancel eligible orders."
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
            <OrderRow
              key={order.trackingNumber}
              order={order}
              onView={setActive}
              onCancel={setToCancel}
            />
          ))}
          <p className="text-center text-xs text-gray-400 pt-2">
            Have a tracking number from elsewhere?{" "}
            <Link to="/track-order" className="text-brand-500 hover:underline">
              Track any order
            </Link>
          </p>
        </div>
      )}

      <OrderDetailsModal
        order={active}
        isOpen={!!active}
        onClose={() => setActive(null)}
        onCancel={setToCancel}
      />

      <ConfirmDialog
        isOpen={!!toCancel}
        onClose={() => (cancelling ? null : setToCancel(null))}
        onConfirm={handleConfirmCancel}
        loading={cancelling}
        title="Cancel this order?"
        message={
          toCancel
            ? `Order ${toCancel.orderNumber} will be cancelled. This can't be undone.`
            : ""
        }
        confirmLabel="Yes, cancel order"
        cancelLabel="Keep order"
      />
    </AccountLayout>
  );
}
