import { motion } from "framer-motion";
import { Lock } from "lucide-react";

import { formatCurrency } from "../../../utils/formatCurrency";
import Button from "../../../components/common/Button";

function Row({ label, value, bold, valueClass = "" }) {
  return (
    <div
      className={`flex justify-between ${
        bold
          ? "text-base font-bold text-gray-900 dark:text-white"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

export default function CartSummary({
  subtotal,
  savings,
  shipping,
  total,
  totalItems,
  remaining,
  progress,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 shadow-sm lg:sticky lg:top-28">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h2>

      {/* Free-shipping progress */}
      <div className="mb-5 rounded-xl bg-brand-50 dark:bg-slate-900/60 p-3.5 text-sm">
        {remaining > 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            Add{" "}
            <span className="font-semibold text-brand-500">
              {formatCurrency(remaining)}
            </span>{" "}
            more for free shipping
          </p>
        ) : (
          <p className="text-green-600 font-medium">
            🎉 You've unlocked free shipping!
          </p>
        )}
        <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-rose-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <Row
          label={`Total items (${totalItems})`}
          value={formatCurrency(subtotal)}
        />
        {savings > 0 && (
          <Row
            label="You save"
            value={`- ${formatCurrency(savings)}`}
            valueClass="text-green-600"
          />
        )}
        <Row
          label="Shipping"
          value={shipping === 0 ? "Free" : formatCurrency(shipping)}
        />
        <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
          <Row label="Estimated Total" value={formatCurrency(total)} bold />
        </div>
      </div>

      <Button to="/checkout" fullWidth size="lg" className="mt-6">
        Proceed to Checkout
      </Button>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Lock size={13} /> Secure SSL encrypted checkout
      </div>
    </div>
  );
}
