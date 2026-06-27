import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Compact popover filter used in the Shop top bar (Category / Character /
 * Price). Renders a labelled trigger with a live count badge and a checkbox
 * list. Closes on outside-click or Escape. Multi-select state lives in the
 * parent (useProductFilters) - this is a presentational control only.
 */
export default function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  getKey = (o) => o,
  getLabel = (o) => o,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const count = selected.length;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium shadow-sm transition-colors ${
          count > 0
            ? "border-brand-300 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/40"
            : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-brand-300"
        }`}
      >
        {label}
        {count > 0 && (
          <span className="grid place-items-center min-w-5 h-5 px-1 rounded-full bg-brand-500 text-white text-[11px] font-bold">
            {count}
          </span>
        )}
        <FiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.25)] p-2 animate-fade-in">
          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            {options.map((opt) => {
              const key = getKey(opt);
              const checked = selected.includes(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(key)}
                    className="h-4 w-4 accent-brand-500"
                  />
                  <span
                    className={`text-sm ${
                      checked
                        ? "font-semibold text-brand-600 dark:text-brand-300"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {getLabel(opt)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
