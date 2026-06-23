import { Link } from "react-router";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";

import { formatCurrency } from "../../../utils/formatCurrency";
import QuantitySelector from "../../../components/common/QuantitySelector";

export default function CartItem({ item, increment, decrement, removeItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="group flex gap-4 sm:gap-5 bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
    >
      <Link
        to={`/product/${item.slug}`}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-brand-50 dark:bg-slate-900 shrink-0"
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-medium text-[#e34786]">
              {item.character}
            </span>
            <Link
              to={`/product/${item.slug}`}
              className="block font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-brand-500 transition-colors"
            >
              {item.name}
            </Link>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-bold text-brand-500">
                {formatCurrency(item.price)}
              </span>
              {item.originalPrice > item.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(item.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name}`}
            className="self-start grid place-items-center h-9 w-9 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <FiTrash2 size={17} />
          </button>
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between flex-wrap gap-3">
          <QuantitySelector
            value={item.quantity}
            onIncrement={() => increment(item.id)}
            onDecrement={() => decrement(item.id)}
          />
          <div className="text-right">
            <p className="text-xs text-gray-400">Subtotal</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
