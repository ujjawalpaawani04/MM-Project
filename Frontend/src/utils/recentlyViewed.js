import { products } from "../data/products";
import { restoreSession, normalizeEmail } from "./auth";

/**
 * Per-user "recently viewed" history backed by localStorage. Each account gets
 * its own namespaced bucket (`mm-recent:<email>`) so one user's browsing never
 * leaks into another's session; signed-out visitors use a shared `guest`
 * bucket. Stores product ids most-recent-first and resolves them back to
 * catalog objects on read so callers always get fresh product data.
 */
const PREFIX = "mm-recent:";
const GUEST_KEY = `${PREFIX}guest`;
const MAX = 8;

// Resolve the current bucket key from the active session (no React needed).
const currentKey = () => {
  const user = restoreSession();
  return user?.email ? `${PREFIX}${normalizeEmail(user.email)}` : GUEST_KEY;
};

const readIds = (key) => {
  try {
    const raw = localStorage.getItem(key);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
};

/** Record a viewed product (moves it to the front, de-duplicated). */
export function recordRecentlyViewed(productId) {
  try {
    const key = currentKey();
    const ids = [productId, ...readIds(key).filter((id) => id !== productId)].slice(
      0,
      MAX
    );
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* storage unavailable - non-fatal */
  }
}

/**
 * Resolve recently viewed ids to product objects for the current user.
 * @param {object} [opts]
 * @param {number} [opts.excludeId]  product id to omit (e.g. the current page)
 * @param {number} [opts.limit]      max items to return
 */
export function getRecentlyViewed({ excludeId, limit = MAX } = {}) {
  return readIds(currentKey())
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, limit);
}
