/**
 * Customer reviews (no backend).
 *
 * Catalog sample reviews live on each product (`product.reviews`). Reviews a
 * visitor writes are persisted per-product to localStorage under
 * `mm-reviews:{id}` and merged in front of the samples for display, so they
 * survive refresh and navigation. A real API can later replace these calls
 * without touching the UI.
 */

const PREFIX = "mm-reviews:";
const keyFor = (productId) => `${PREFIX}${productId}`;

const safeParse = (raw) => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/** User-submitted reviews for a product (most recent first), [] if none. */
export function getStoredReviews(productId) {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(keyFor(productId)));
}

/**
 * Persist a new review (prepended). Returns the updated stored list. Falls back
 * to storing the review without its images if the quota is exceeded, so the
 * text review is never lost.
 */
export function addStoredReview(productId, review) {
  const next = [review, ...getStoredReviews(productId)];
  try {
    window.localStorage.setItem(keyFor(productId), JSON.stringify(next));
  } catch {
    try {
      const lite = [{ ...review, images: [] }, ...getStoredReviews(productId)];
      window.localStorage.setItem(keyFor(productId), JSON.stringify(lite));
      return lite;
    } catch {
      /* storage unavailable - keep the in-memory review only */
    }
  }
  return next;
}

/**
 * Read a File into a downscaled JPEG data URL so review photos persist in
 * localStorage without exhausting the quota. Resolves to null on any failure.
 */
export function fileToCompressedDataUrl(file, { maxSize = 800, quality = 0.7 } = {}) {
  return new Promise((resolve) => {
    if (!file || !file.type?.startsWith("image/")) return resolve(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } catch {
        resolve(null);
      } finally {
        URL.revokeObjectURL(url);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
