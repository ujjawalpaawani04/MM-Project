import { products } from "../data/products";

/**
 * Lightweight "recently viewed" history backed by localStorage (`mm-recent`).
 * Stores product ids most-recent-first; resolves them back to catalog objects
 * on read so callers always get fresh product data.
 */
const KEY = "mm-recent";
const MAX = 8;

const readIds = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
};

/** Record a viewed product (moves it to the front, de-duplicated). */
export function recordRecentlyViewed(productId) {
  try {
    const ids = [productId, ...readIds().filter((id) => id !== productId)].slice(
      0,
      MAX
    );
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable - non-fatal */
  }
}

/**
 * Resolve recently viewed ids to product objects.
 * @param {object} [opts]
 * @param {number} [opts.excludeId]  product id to omit (e.g. the current page)
 * @param {number} [opts.limit]      max items to return
 */
export function getRecentlyViewed({ excludeId, limit = MAX } = {}) {
  return readIds()
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, limit);
}
