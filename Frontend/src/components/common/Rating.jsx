import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/** Star rating display. `value` 0-5, optional review `count`. */
export default function Rating({ value = 0, count, size = 14, showValue = false }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1;
    if (value >= pos) return "full";
    if (value >= pos - 0.5) return "half";
    return "empty";
  });

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex items-center text-amber-400" style={{ fontSize: size }}>
        {stars.map((s, i) =>
          s === "full" ? (
            <FaStar key={i} />
          ) : s === "half" ? (
            <FaStarHalfAlt key={i} />
          ) : (
            <FaRegStar key={i} className="text-gray-300 dark:text-slate-600" />
          )
        )}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {value.toFixed(1)}
        </span>
      )}
      {count != null && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </div>
  );
}
