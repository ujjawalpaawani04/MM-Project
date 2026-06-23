import {
  FiCheckCircle,
  FiShoppingBag,
  FiTruck,
  FiCalendar,
  FiHash,
} from "react-icons/fi";
import Button from "../../../components/common/Button";
import { formatCurrency } from "../../../utils/formatCurrency";
import { formatOrderDate } from "../../../utils/orders";

export default function OrderConfirmation({ placed }) {
  const { order } = placed;
  return (
    <div className="max-w-xl mx-auto px-4 lg:pt-40 lg:pb-28 pt-16 pb-16">
      <div className="text-center">
        <span className="mx-auto grid place-items-center h-20 w-20 rounded-full bg-green-50 dark:bg-green-500/10">
          <FiCheckCircle className="text-green-500" size={44} />
        </span>
        <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Thank you, {placed.fullName}. A confirmation has been sent to{" "}
          <span className="font-medium">{placed.email}</span>. Your miniatures
          are being lovingly packed.
        </p>
      </div>

      {/* Order + tracking details */}
      <div className="mt-8 rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-7 text-left">
        <div className="grid sm:grid-cols-2 gap-5">
          <Detail icon={FiShoppingBag} label="Order Number" value={order.orderNumber} />
          <Detail icon={FiHash} label="Tracking Number" value={order.trackingNumber} accent />
          <Detail icon={FiCalendar} label="Order Date" value={formatOrderDate(order.placedAt)} />
          <Detail
            icon={FiTruck}
            label="Estimated Delivery"
            value={formatOrderDate(order.estimatedDeliveryAt)}
          />
        </div>
        <div className="mt-6 flex justify-between items-center border-t border-gray-100 dark:border-slate-700 pt-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Order Total
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(order.total)}
          </span>
        </div>
      </div>

      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <Button
          to={`/track-order?tracking=${order.trackingNumber}`}
          size="lg"
          fullWidth
          icon={FiTruck}
        >
          Track Your Order
        </Button>
        <Button to="/shop" variant="outline" size="lg" fullWidth>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex items-start gap-3">
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
