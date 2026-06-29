/* eslint-disable react-refresh/only-export-components -- provider + its hook are intentionally co-located */
import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const MAX_QTY = 10;
// Each user gets their own namespaced cart so one account's items can never
// leak into another's session.
const CART_PREFIX = "mm-cart:";
// The pre-scoping shared key. It's the source of the cross-user leak, so it is
// migrated to the current user (if any) and then permanently removed.
const LEGACY_CART_KEY = "mm-cart";

// Email is this app's stable user identifier (front-end auth, no backend).
const cartKeyFor = (user) =>
  user?.email ? `${CART_PREFIX}${user.email.trim().toLowerCase()}` : null;

// Safe read of a stored cart. Returns [] for "no key" (logged out), missing
// data, or malformed JSON - so the cart is always empty unless a real user has
// real items.
const readCart = (key) => {
  if (!key || typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const storageKey = cartKeyFor(user);

  // The cart is strictly per-user: seeded from the logged-in user's stored cart,
  // and empty whenever nobody is signed in.
  const [items, setItems] = useState(() => readCart(storageKey));

  // Track which key the current `items` belong to. When the signed-in user
  // changes (login / logout / switch), resync during render so there is never a
  // frame showing the wrong user's cart (same pattern used elsewhere in the app).
  //
  // Logging out simply loads the "no user" cart (empty) - the previous user's
  // cart is left untouched under its own key, so it is restored automatically
  // the next time that same user signs in (like Amazon/Flipkart). Each account's
  // cart stays isolated under its own key, so one user never sees another's.
  const [activeKey, setActiveKey] = useState(storageKey);
  if (activeKey !== storageKey) {
    setActiveKey(storageKey);
    setItems(readCart(storageKey));
  }

  // One-time migration: retire the legacy shared cart key. If the current user
  // has no cart yet, adopt the legacy one so an in-progress cart isn't lost on
  // upgrade; otherwise simply discard it. Done once during render (guarded by
  // state) so the leaked key is gone before the first paint.
  const [migrated, setMigrated] = useState(false);
  if (!migrated && typeof window !== "undefined") {
    setMigrated(true);
    try {
      const legacy = window.localStorage.getItem(LEGACY_CART_KEY);
      if (legacy != null) {
        if (storageKey && window.localStorage.getItem(storageKey) == null) {
          window.localStorage.setItem(storageKey, legacy);
          setItems(readCart(storageKey));
        }
        window.localStorage.removeItem(LEGACY_CART_KEY);
      }
    } catch {
      /* ignore - cart still works from in-memory state */
    }
  }

  // Persist the cart for the signed-in user. Never write when logged out, so a
  // guest session leaves nothing behind in storage.
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      /* storage full/unavailable - keep working from in-memory state */
    }
  }, [items, storageKey]);

  // Keep the active user's cart in sync across browser tabs.
  useEffect(() => {
    if (!storageKey) return;
    const onStorage = (e) => {
      if (e.key === storageKey) setItems(readCart(storageKey));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id
              ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + quantity) }
              : i
          );
        }
        // Store only what the cart needs (keeps localStorage small).
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
            quantity: Math.min(MAX_QTY, quantity),
          },
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [setItems]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      const q = Math.max(1, Math.min(MAX_QTY, quantity));
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: q } : i))
      );
    },
    [setItems]
  );

  const increment = useCallback(
    (id) =>
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) }
            : i
        )
      ),
    [setItems]
  );

  const decrement = useCallback(
    (id) =>
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
        )
      ),
    [setItems]
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const isInCart = useCallback(
    (id) => items.some((i) => i.id === id),
    [items]
  );

  const { totalItems, subtotal, savings } = useMemo(() => {
    let totalItems = 0;
    let subtotal = 0;
    let savings = 0;
    for (const i of items) {
      totalItems += i.quantity;
      subtotal += i.price * i.quantity;
      if (i.originalPrice) savings += (i.originalPrice - i.price) * i.quantity;
    }
    return { totalItems, subtotal, savings };
  }, [items]);

  const SHIPPING_THRESHOLD = 1999;
  const shipping = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : 99;
  const total = subtotal + shipping;

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    increment,
    decrement,
    clearCart,
    isInCart,
    totalItems,
    subtotal,
    savings,
    shipping,
    total,
    shippingThreshold: SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
