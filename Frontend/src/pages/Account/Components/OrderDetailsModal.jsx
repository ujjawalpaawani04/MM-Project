import {
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiCalendar,
  FiHash,
} from "react-icons/fi";

import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  getOrderStatus,
  getPaymentStatus,
  formatOrderDate,
} from "../../../utils/orders";

const statusTone = {
  delivered: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  "out-for-delivery": "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
  shipped: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300",
  default: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300",
};

const payTone = {
  success: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
};

function Meta({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-gray-50 dark:bg-slate-700/70 text-gray-500 dark:text-gray-300">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Full order detail dialog: ID, date, fulfilment + payment status, line items
 * (image / name / qty / price), the cost breakdown and the shipping address.
 */
export default function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!order) return null;

  const { steps, currentStep, statusLabel } = getOrderStatus(order);
  const tone = statusTone[steps[currentStep].key] || statusTone.default;
  const payment = getPaymentStatus(order);
  const c = order.customer || {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={`Order ${order.orderNumber}`}>
      <div className="p-5 sm:p-6 space-y-6">
        {/* Status row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
            {statusLabel}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${payTone[payment.tone]}`}
          >
            Payment: {payment.label}
          </span>
        </div>

        {/* Meta grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Meta icon={FiHash} label="Order ID">
            {order.orderNumber}
            <span className="block text-xs font-normal text-gray-400">
              {order.trackingNumber}
            </span>
          </Meta>
          <Meta icon={FiCalendar} label="Order Date">
            {formatOrderDate(order.placedAt)}
          </Meta>
          <Meta icon={FiCreditCard} label="Payment Method">
            {payment.method}
          </Meta>
          <Meta icon={FiTruck} label="Estimated Delivery">
            {formatOrderDate(order.estimatedDeliveryAt)} · {order.carrier}
          </Meta>
        </div>

        {/* Items */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
            Items ({order.items.length})
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-slate-700 rounded-2xl border border-gray-100 dark:border-slate-700">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-16 w-16 rounded-xl object-cover bg-gray-100 dark:bg-slate-700 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  {item.character && (
                    <p className="text-xs text-gray-400">{item.character}</p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Qty {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals + address */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Payment Summary
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <dt>Shipping</dt>
                <dd>{order.shipping ? formatCurrency(order.shipping) : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-slate-700 pt-2 font-bold text-gray-900 dark:text-white">
                <dt>Total</dt>
                <dd>{formatCurrency(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
            <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-900 dark:text-white mb-3">
              <FiMapPin size={15} /> Shipping Address
            </h3>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              <span className="font-semibold text-gray-900 dark:text-white block">
                {c.fullName}
              </span>
              {c.address}
              <br />
              {c.city}
              {c.state ? `, ${c.state}` : ""} {c.pincode || c.pin || ""}
              <br />
              {c.phone && <span className="block">{c.phone}</span>}
              {c.email && <span className="block text-gray-400">{c.email}</span>}
            </address>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            to={`/track-order?tracking=${encodeURIComponent(order.trackingNumber)}`}
            icon={FiTruck}
          >
            Track Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
