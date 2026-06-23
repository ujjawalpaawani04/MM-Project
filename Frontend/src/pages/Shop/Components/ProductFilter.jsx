import { FiX } from "react-icons/fi";
import {
  CATEGORIES,
  CHARACTERS,
  PRICE_RANGES,
  SORT_OPTIONS,
} from "../../../data/products";

function CheckGroup({ title, options, selected, onToggle, getKey, getLabel }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-brand-500 mb-3">{title}</h3>
      <div className="space-y-2.5">
        {options.map((opt) => {
          const key = getKey(opt);
          const label = getLabel(opt);
          return (
            <label
              key={key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selected.includes(key)}
                onChange={() => onToggle(key)}
                className="h-4 w-4 accent-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-brand-500 transition-colors">
                {label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function ProductFilters({
  filters,
  toggleArrayValue,
  setSort,
  clearFilters,
  activeFilterCount,
  className = "",
}) {
  return (
    <aside
      className={`bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-5 lg:p-6 shadow-sm xl:w-[280px] shrink-0 w-full theme-surface ${className}`}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600"
          >
            <FiX size={14} /> Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Sort (handy near top on mobile) */}
      <div className="mb-6">
        <h3 className="font-semibold text-brand-500 mb-3">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <hr className="my-5 border-gray-100 dark:border-slate-700" />

      <CheckGroup
        title="Category"
        options={CATEGORIES}
        selected={filters.categories}
        onToggle={(v) => toggleArrayValue("categories", v)}
        getKey={(o) => o}
        getLabel={(o) => o}
      />

      <hr className="my-5 border-gray-100 dark:border-slate-700" />

      <CheckGroup
        title="Character"
        options={CHARACTERS}
        selected={filters.characters}
        onToggle={(v) => toggleArrayValue("characters", v)}
        getKey={(o) => o}
        getLabel={(o) => o}
      />

      <hr className="my-5 border-gray-100 dark:border-slate-700" />

      <CheckGroup
        title="Price Range"
        options={PRICE_RANGES}
        selected={filters.priceRanges}
        onToggle={(v) => toggleArrayValue("priceRanges", v)}
        getKey={(o) => o.id}
        getLabel={(o) => o.label}
      />
    </aside>
  );
}
