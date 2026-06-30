/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

// Each user gets their own namespaced wishlist so one account's saved items can
// never leak into another's session (mirrors the per-user cart isolation).
// Unlike the cart, saving to the wishlist is NOT gated behind sign-in, so guests
// get their own "guest" bucket that merges into their account on login.
const WISHLIST_PREFIX = "mm-wishlist:";
const GUEST_KEY = `${WISHLIST_PREFIX}guest`;
// The pre-scoping shared key. It is the source of the cross-user leak, so it is
// migrated to the current user (if any) and then permanently removed.
const LEGACY_WISHLIST_KEY = "mm-wishlist";

// Email is this app's stable user identifier (front-end auth, no backend).
// Guests fall back to a shared-on-this-browser guest bucket.
const wishlistKeyFor = (user) =>
  user?.email ? `${WISHLIST_PREFIX}${user.email.trim().toLowerCase()}` : GUEST_KEY;

// Safe read of a stored wishlist. Returns [] for missing data or malformed JSON.
const readWishlist = (key) => {
  if (!key || typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Union two wishlists by product id (first occurrence wins).
const mergeById = (a, b) => {
  const seen = new Set(a.map((i) => i.id));
  return [...a, ...b.filter((i) => !seen.has(i.id))];
};

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const storageKey = wishlistKeyFor(user);

  // Seeded from the logged-in user's stored wishlist; empty when nobody is
  // signed in.
  const [items, setItems] = useState(() => readWishlist(storageKey));

  // When the signed-in user changes (login / logout / switch), resync during
  // render so there is never a frame showing the wrong user's wishlist. On
  // login, a guest's saved items are merged into the account (then the guest
  // bucket is cleared) so nothing built while logged out is lost.
  const [activeKey, setActiveKey] = useState(storageKey);
  if (activeKey !== storageKey) {
    const loggingIn = activeKey === GUEST_KEY && storageKey !== GUEST_KEY;
    let next = readWishlist(storageKey);
    if (loggingIn) {
      const guestItems = readWishlist(GUEST_KEY);
      if (guestItems.length) {
        next = mergeById(next, guestItems);
        try {
          window.localStorage.removeItem(GUEST_KEY);
        } catch {
          /* ignore - merge still applied in memory */
        }
      }
    }
    setActiveKey(storageKey);
    setItems(next);
  }

  // One-time migration: retire the legacy shared wishlist key. If the current
  // user has no wishlist yet, adopt the legacy one so saved items aren't lost on
  // upgrade; otherwise discard it.
  const [migrated, setMigrated] = useState(false);
  if (!migrated && typeof window !== "undefined") {
    setMigrated(true);
    try {
      const legacy = window.localStorage.getItem(LEGACY_WISHLIST_KEY);
      if (legacy != null) {
        if (storageKey && window.localStorage.getItem(storageKey) == null) {
          window.localStorage.setItem(storageKey, legacy);
          setItems(readWishlist(storageKey));
        }
        window.localStorage.removeItem(LEGACY_WISHLIST_KEY);
      }
    } catch {
      /* ignore - wishlist still works from in-memory state */
    }
  }

  // Persist for the signed-in user only, so a guest session leaves nothing
  // behind in storage.
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      /* storage full/unavailable - keep working from in-memory state */
    }
  }, [items, storageKey]);

  // Keep the active user's wishlist in sync across browser tabs.
  useEffect(() => {
    if (!storageKey) return;
    const onStorage = (e) => {
      if (e.key === storageKey) setItems(readWishlist(storageKey));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const isInWishlist = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const addItem = useCallback((product) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === product.id)) return prev;
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          character: product.character,
          rating: product.rating,
        },
      ];
    });
  }, []);

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    []
  );

  /** Toggle and return the resulting state (true = now in wishlist). */
  const toggle = useCallback(
    (product) => {
      const added = !items.some((i) => i.id === product.id);
      if (added) addItem(product);
      else removeItem(product.id);
      return added;
    },
    [items, addItem, removeItem]
  );

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      isInWishlist,
      addItem,
      removeItem,
      toggle,
      clear,
    }),
    [items, isInWishlist, addItem, removeItem, toggle, clear]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
