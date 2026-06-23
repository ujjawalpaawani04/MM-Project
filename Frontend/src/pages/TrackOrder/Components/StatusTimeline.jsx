import { motion } from "framer-motion";
import {
  FiCheck,
  FiShoppingBag,
  FiPackage,
  FiBox,
  FiTruck,
  FiMapPin,
  FiHome,
} from "react-icons/fi";
import { cn } from "../../../utils/cn";

// Icons keyed to the order-status steps from utils/orders.
const ICONS = {
  confirmed: FiShoppingBag,
  processing: FiPackage,
  packed: FiBox,
  shipped: FiTruck,
  "out-for-delivery": FiMapPin,
  delivered: FiHome,
};

/**
 * 6-stage delivery progress.
 * `status` comes from getOrderStatus(order): { steps, currentStep, isDelivered }.
 */
export default function StatusTimeline({ status }) {
  const { steps, currentStep, isDelivered } = status;
  // Inner track spans between the first and last node centres.
  const fill =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;
  const edge = 100 / steps.length / 2; // half a column

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Delivery Status
        </h3>
        <span
          className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full",
            isDelivered
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-pink-500 to-rose-400 text-white"
          )}
        >
          {isDelivered ? "Delivered" : "In Transit"}
        </span>
      </div>

      {/* Desktop - horizontal */}
      <div className="hidden md:block mt-12">
        <div className="relative">
          <div
            className="absolute top-6 h-1 rounded-full bg-gray-100 dark:bg-slate-700"
            style={{ left: `${edge}%`, right: `${edge}%` }}
          />
          <motion.div
            className="absolute top-6 h-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-400"
            style={{ left: `${edge}%`, maxWidth: `${100 - 2 * edge}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${fill * (1 - (2 * edge) / 100)}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <div
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
          >
            {steps.map((s) => {
              const Icon = ICONS[s.key] || FiPackage;
              return (
                <div key={s.key} className="flex flex-col items-center text-center px-1">
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "z-10 grid place-items-center h-12 w-12 rounded-full border-2 transition-colors",
                      s.reached
                        ? "bg-gradient-to-br from-pink-500 to-rose-400 border-transparent text-white"
                        : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-400",
                      s.active && "ring-4 ring-brand-100 dark:ring-brand-500/25"
                    )}
                  >
                    {s.done ? <FiCheck size={20} /> : <Icon size={18} />}
                  </motion.span>
                  <p
                    className={cn(
                      "mt-3 text-sm font-semibold leading-tight",
                      s.reached ? "text-gray-900 dark:text-white" : "text-gray-400"
                    )}
                  >
                    {s.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">{s.date}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile - vertical */}
      <ol className="md:hidden mt-8 space-y-1">
        {steps.map((s, i) => {
          const Icon = ICONS[s.key] || FiPackage;
          const last = i === steps.length - 1;
          return (
            <li key={s.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid place-items-center h-11 w-11 rounded-full border-2 transition-colors",
                    s.reached
                      ? "bg-gradient-to-br from-pink-500 to-rose-400 border-transparent text-white"
                      : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-400",
                    s.active && "ring-4 ring-brand-100 dark:ring-brand-500/25"
                  )}
                >
                  {s.done ? <FiCheck size={18} /> : <Icon size={16} />}
                </span>
                {!last && (
                  <span
                    className={cn(
                      "w-0.5 flex-1 min-h-8 my-1 rounded-full",
                      s.done ? "bg-brand-400" : "bg-gray-200 dark:bg-slate-700"
                    )}
                  />
                )}
              </div>
              <div className="pt-1.5 pb-3">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    s.reached ? "text-gray-900 dark:text-white" : "text-gray-400"
                  )}
                >
                  {s.label}
                </p>
                <p className="text-xs text-gray-400">{s.date}</p>
                {s.active && (
                  <p className="mt-0.5 text-xs text-brand-500">{s.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
