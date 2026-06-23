import {
  FiCalendar,
  FiClock,
  FiTruck,
  FiHash,
  FiMapPin,
  FiActivity,
} from "react-icons/fi";
import { formatOrderDate } from "../../../utils/orders";

function Meta({ icon: Icon, label, value, className = "", accent = false }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <span className="grid place-items-center h-9 w-9 rounded-lg bg-brand-50 dark:bg-slate-700 text-brand-500 dark:text-brand-300 shrink-0">
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
        <p
          className={`font-semibold break-words ${
            accent ? "text-brand-500" : "text-gray-900 dark:text-white"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function OrderDetails({ order, status }) {
  const city = order.customer?.city;
  const name = order.customer?.fullName;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-700 pb-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Order Number
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {order.orderNumber}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
            status.isDelivered
              ? "bg-green-500 text-white"
              : "bg-brand-50 dark:bg-slate-700 text-brand-600 dark:text-brand-300"
          }`}
        >
          {status.statusLabel}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        <Meta icon={FiHash} label="Tracking Number" value={order.trackingNumber} accent />
        <Meta icon={FiActivity} label="Current Status" value={status.statusLabel} />
        <Meta icon={FiCalendar} label="Order Date" value={formatOrderDate(order.placedAt)} />
        <Meta
          icon={FiClock}
          label="Estimated Delivery"
          value={formatOrderDate(order.estimatedDeliveryAt)}
        />
        <Meta icon={FiTruck} label="Carrier" value={order.carrier} />
        {(name || city) && (
          <Meta
            icon={FiMapPin}
            label="Shipping To"
            value={[name, city].filter(Boolean).join(", ")}
          />
        )}
      </div>
    </div>
  );
}
