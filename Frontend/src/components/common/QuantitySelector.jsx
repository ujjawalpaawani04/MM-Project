import { FiMinus, FiPlus } from "react-icons/fi";

/** Accessible quantity stepper. */
export default function QuantitySelector({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 10,
  size = "md",
}) {
  const btn =
    size === "sm"
      ? "w-8 h-8 text-sm"
      : "w-10 h-10";
  const box =
    size === "sm" ? "w-8 text-sm" : "w-12";

  return (
    <div className="inline-flex items-center rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${btn} flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <FiMinus />
      </button>
      <span
        className={`${box} text-center font-semibold text-gray-900 dark:text-white select-none`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={`${btn} flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors`}
      >
        <FiPlus />
      </button>
    </div>
  );
}
