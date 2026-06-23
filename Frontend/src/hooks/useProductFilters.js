import { useMemo, useState, useCallback } from "react";
import { PRICE_RANGES } from "../data/products";

const PAGE_SIZE = 6;

const DEFAULTS = {
  search: "",
  categories: [],
  characters: [],
  priceRanges: [],
  sort: "featured",
};

/**
 * Encapsulates all Shop filtering/sorting/pagination. Stateful and
 * URL-search aware (the `?search=` param seeds the initial query).
 */
export function useProductFilters(products, initialSearch = "", initialCategory = "") {
  const [filters, setFilters] = useState({
    ...DEFAULTS,
    search: initialSearch,
    categories: initialCategory ? [initialCategory] : [],
  });
  const [page, setPage] = useState(1);

  // Sync search when the URL param changes (header search navigates here).
  // React's recommended "store previous prop in state" pattern - adjust during
  // render, guarded by the previous value (no effect, no cascading renders).
  const [prevInitial, setPrevInitial] = useState(initialSearch);
  if (prevInitial !== initialSearch) {
    setPrevInitial(initialSearch);
    setFilters((f) => ({ ...f, search: initialSearch }));
    setPage(1);
  }

  // Same pattern for the ?category= param (Shop-by-Category cards navigate here).
  const [prevCategory, setPrevCategory] = useState(initialCategory);
  if (prevCategory !== initialCategory) {
    setPrevCategory(initialCategory);
    setFilters((f) => ({
      ...f,
      categories: initialCategory ? [initialCategory] : f.categories,
    }));
    setPage(1);
  }

  // Any filter change returns the user to page 1.
  const updateFilters = useCallback((updater) => {
    setFilters(updater);
    setPage(1);
  }, []);

  const toggleArrayValue = useCallback(
    (key, value) => {
      updateFilters((f) => {
        const list = f[key];
        return {
          ...f,
          [key]: list.includes(value)
            ? list.filter((v) => v !== value)
            : [...list, value],
        };
      });
    },
    [updateFilters]
  );

  const setSearch = useCallback(
    (search) => updateFilters((f) => ({ ...f, search })),
    [updateFilters]
  );
  const setSort = useCallback(
    (sort) => updateFilters((f) => ({ ...f, sort })),
    [updateFilters]
  );
  const clearFilters = useCallback(
    () => updateFilters((f) => ({ ...DEFAULTS, search: f.search })),
    [updateFilters]
  );
  const clearAll = useCallback(() => updateFilters(DEFAULTS), [updateFilters]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    const ranges = PRICE_RANGES.filter((r) => filters.priceRanges.includes(r.id));

    let list = products.filter((p) => {
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.character.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (filters.characters.length && !filters.characters.includes(p.character))
        return false;
      if (
        ranges.length &&
        !ranges.some((r) => p.price >= r.min && p.price <= r.max)
      )
        return false;
      return true;
    });

    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "name-asc": (a, b) => a.name.localeCompare(b.name),
      "rating-desc": (a, b) => b.rating - a.rating,
      latest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      featured: (a, b) => Number(b.featured) - Number(a.featured),
    };
    return [...list].sort(sorters[filters.sort] || sorters.featured);
  }, [products, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage]
  );

  const activeFilterCount =
    filters.categories.length +
    filters.characters.length +
    filters.priceRanges.length +
    (filters.search ? 1 : 0);

  return {
    filters,
    setSearch,
    setSort,
    toggleArrayValue,
    clearFilters,
    clearAll,
    results: paginated,
    totalResults: filtered.length,
    page: safePage,
    totalPages,
    setPage,
    activeFilterCount,
  };
}
